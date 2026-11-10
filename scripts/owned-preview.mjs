/**
 * @file Serves only an owned loopback production-dist socket for browser and Lighthouse acceptance.
 * Functions: checkedPort, startOwnedPreview, main; exact bind precedes every readiness signal.
 * Variables: ROOT, DIST, BASE, MIME; no alternate port or existing-listener adoption.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BASE = "/portfolio-case-study-site/";
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

/** Validate a literal nonprivileged port before any process, bind or HTTP request. */
export function checkedPort(raw = "4392") {
  const port = Number(raw);
  if (
    !/^[0-9]{4,5}$/u.test(String(raw)) ||
    !Number.isSafeInteger(port) ||
    port < 1024 ||
    port > 65535
  )
    throw new TypeError("Preview port must be an integer from 1024 through 65535.");
  return port;
}

/** Start one static-build listener; literal paths and realpaths must both stay inside its root. */
export async function startOwnedPreview({ port = 4392, directory = DIST } = {}) {
  port = checkedPort(port);
  const root = await realpath(directory);
  await stat(path.join(root, "index.html"));
  const server = createServer((request, response) => {
    void serve(request, response).catch(() => {
      if (!response.headersSent) response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Preview request failed.");
    });
  });

  /** Serve GET/HEAD build bytes only, with true 404s and no directory listing or SPA fallback. */
  async function serve(request, response) {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "no-store");
    if (request.headers.host !== `127.0.0.1:${port}`) {
      response.writeHead(400);
      response.end("Unexpected preview host.");
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }
    const raw = (request.url ?? "").split(/[?#]/u)[0];
    let pathname;
    try {
      pathname = decodeURIComponent(raw);
    } catch {
      response.writeHead(400);
      response.end();
      return;
    }
    if (
      !pathname.startsWith(BASE) ||
      /[\\:]|\p{Cc}/u.test(pathname) ||
      pathname.split("/").includes("..")
    ) {
      response.writeHead(404);
      response.end();
      return;
    }
    const relative = pathname.slice(BASE.length);
    let candidate = path.resolve(root, relative);
    if (candidate !== root && !candidate.startsWith(root + path.sep)) {
      response.writeHead(404);
      response.end();
      return;
    }
    let status = 200;
    try {
      if ((await stat(candidate)).isDirectory()) candidate = path.join(candidate, "index.html");
      candidate = await realpath(candidate);
      if (!candidate.startsWith(root + path.sep)) throw new Error("Outside build root");
      if (!(await stat(candidate)).isFile()) throw new Error("Not a build file");
    } catch {
      candidate = await realpath(path.join(root, "404.html"));
      if (!candidate.startsWith(root + path.sep)) throw new Error("Invalid 404 build output");
      status = 404;
    }
    const body = await readFile(candidate);
    response.writeHead(status, {
      "Content-Type": MIME[path.extname(candidate)] ?? "application/octet-stream",
      "Content-Length": body.byteLength,
    });
    response.end(request.method === "HEAD" ? undefined : body);
  }

  // The bind itself establishes ownership. EADDRINUSE rejects before any HTTP probe or ready output.
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen({ port, host: "127.0.0.1", exclusive: true }, resolve);
  });
  return {
    url: `http://127.0.0.1:${port}${BASE}`,
    stop: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  };
}

/** CLI emits a fixed readiness line only after this process owns its requested socket. */
async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== "--port")
    throw new Error("Usage: owned-preview.mjs --port NUMBER");
  const preview = await startOwnedPreview({ port: checkedPort(args[1]) });
  const stop = () => {
    void preview.stop().then(() => process.exit(0));
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  console.log(`PORTFOLIO_OWNED_PREVIEW_READY ${preview.url}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Owned preview refused startup: ${error.code ?? error.message}`);
    process.exitCode = 1;
  });
}
