/**
 * @file Independently checks static-preview isolation, literal paths, HTTP semantics and port refusal.
 * Functions: request, main; uses only synthetic temporary build files and owned listeners.
 * Variables: temporary root, sentinel listener, public file bytes and request counter.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer, request as httpRequest } from "node:http";
import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { checkedPort, startOwnedPreview } from "./owned-preview.mjs";

/** Request the literal wire path so URL normalization cannot hide traversal controls from the test. */
function request(port, pathname, method = "GET", host = `127.0.0.1:${port}`, timeoutMs = 2_000) {
  return new Promise((resolve, reject) => {
    let timer;
    const failed = (error) => {
      clearTimeout(timer);
      reject(error);
    };
    const outgoing = httpRequest(
      { host: "127.0.0.1", port, path: pathname, method, headers: { Host: host } },
      (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk.toString();
        });
        response.on("end", () => {
          clearTimeout(timer);
          resolve({ status: response.statusCode, headers: response.headers, body });
        });
        response.once("error", failed);
      },
    );
    outgoing.once("error", failed);
    timer = setTimeout(
      () => outgoing.destroy(new Error("Owned preview request deadline exceeded")),
      timeoutMs,
    );
    outgoing.end();
  });
}

/** Exercise a separate fixture build and leave an occupied unknown listener entirely untouched. */
async function main() {
  for (const invalid of ["0", "80", "65536", "4392;echo", "1e4", "-1", " 4392", "4392.0"])
    assert.throws(() => checkedPort(invalid), /Preview port/);
  const temporary = await mkdtemp(path.join(tmpdir(), "portfolio-preview-test-"));
  const directory = path.join(temporary, "dist");
  await mkdir(path.join(directory, "nested"), { recursive: true });
  await writeFile(path.join(directory, "index.html"), "<h1>Owned fixture</h1>");
  await writeFile(path.join(directory, "404.html"), "<h1>Missing fixture page</h1>");
  await writeFile(path.join(directory, "nested", "index.html"), "Nested fixture");
  await writeFile(path.join(directory, "style.css"), "body{color:black}");
  await writeFile(path.join(temporary, "private.txt"), "PRIVATE_OUTSIDE_DIST");
  let count = 0;
  let stall = false;
  const sentinel = createServer((_request, response) => {
    count++;
    if (!stall) response.end("untouched listener");
  });
  let preview;
  try {
    await new Promise((resolve, reject) => {
      sentinel.once("error", reject);
      sentinel.listen(0, "127.0.0.1", resolve);
    });
    const port = sentinel.address().port;
    await assert.rejects(startOwnedPreview({ port, directory }), { code: "EADDRINUSE" });
    await assert.rejects(
      promisify(execFile)(
        process.execPath,
        [fileURLToPath(new URL("./owned-preview.mjs", import.meta.url)), "--port", String(port)],
        { timeout: 3_000, maxBuffer: 10_000, windowsHide: true },
      ),
      (error) =>
        error.code === 1 &&
        error.stderr.includes("EADDRINUSE") &&
        !error.stdout.includes("PORTFOLIO_OWNED_PREVIEW_READY"),
    );
    assert.equal(count, 0, "Occupied-listener refusal must precede every HTTP request");
    assert.equal((await request(port, "/")).body, "untouched listener");
    stall = true;
    await assert.rejects(
      request(port, "/", "GET", `127.0.0.1:${port}`, 100),
      /request deadline exceeded/,
    );
    sentinel.closeAllConnections();
    await new Promise((resolve) => sentinel.close(resolve));
    preview = await startOwnedPreview({ port, directory });
    const base = "/portfolio-case-study-site/";
    const home = await request(port, base);
    assert.equal(home.status, 200);
    assert.equal(home.body, "<h1>Owned fixture</h1>");
    assert.match(home.headers["content-type"], /^text\/html/);
    const head = await request(port, base, "HEAD");
    assert.equal(head.status, 200);
    assert.equal(head.body, "");
    assert.equal(Number(head.headers["content-length"]), Buffer.byteLength(home.body));
    assert.equal((await request(port, `${base}nested/`)).body, "Nested fixture");
    assert.match((await request(port, `${base}style.css`)).headers["content-type"], /^text\/css/);
    const missing = await request(port, `${base}unknown-project/`);
    assert.equal(missing.status, 404);
    assert.match(missing.body, /Missing fixture/);
    for (const pathname of [
      "/",
      `${base}../private.txt`,
      `${base}%2e%2e/private.txt`,
      `${base}%2E%2E%2Fprivate.txt`,
      `${base}..%5cprivate.txt`,
      `${base}style.css%3Aprivate`,
    ]) {
      const result = await request(port, pathname);
      assert.equal(result.status, 404);
      assert.doesNotMatch(result.body, /PRIVATE_OUTSIDE_DIST/);
    }
    assert.equal((await request(port, `${base}%ZZ`)).status, 400);
    assert.equal((await request(port, base, "POST")).status, 405);
    assert.equal((await request(port, base, "GET", "outside.invalid")).status, 400);
    let symlinkTest = "passed";
    try {
      await symlink(path.join(temporary, "private.txt"), path.join(directory, "escape.txt"));
      const escaped = await request(port, `${base}escape.txt`);
      assert.equal(escaped.status, 404);
      assert.doesNotMatch(escaped.body, /PRIVATE_OUTSIDE_DIST/);
    } catch (error) {
      if (process.platform !== "win32" || error.code !== "EPERM") throw error;
      symlinkTest = "unavailable: Windows symlink privilege; required on Linux CI";
    }
    console.log(
      JSON.stringify({
        checks:
          "Port refusal/no HTTP adoption, literal traversal, realpath containment, GET/HEAD, MIME, true 404, host and method bounds passed",
        symlinkTest,
      }),
    );
  } finally {
    if (preview) await preview.stop();
    if (sentinel.listening) await new Promise((resolve) => sentinel.close(resolve));
    const target = path.resolve(temporary);
    assert.ok(
      target.startsWith(path.resolve(tmpdir()) + path.sep) &&
        path.basename(target).startsWith("portfolio-preview-test-"),
    );
    await rm(target, { recursive: true, force: true });
  }
}

await main();
