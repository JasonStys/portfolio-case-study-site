/**
 * @file Exercises complete bounded Lighthouse diagnostic capture and unchanged strict sampling gates.
 * Functions: synthetic raw-artifact fixtures and independent filesystem/negative budget cases.
 * Variables: temporary output directories and fixed owned-site trace, network and metric records.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Browser, Page } from "puppeteer-core";
import {
  enforceBudgets,
  prepareAuditedPage,
  saveRunDiagnostics,
  summarize,
} from "../../scripts/lighthouse.mjs";

const target = "http://127.0.0.1:4175/portfolio-case-study-site/";
const directories: string[] = [];

function first<T>(items: T[]): T {
  const item = items[0];
  assert(item !== undefined);
  return item;
}

function fixture() {
  return {
    lhr: {
      requestedUrl: target,
      mainDocumentUrl: target,
      finalDisplayedUrl: target,
      lighthouseVersion: "13.5.0",
      environment: { benchmarkIndex: 1700 },
      timing: { total: 1900, entries: [] },
      configSettings: {
        formFactor: "desktop",
        screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1 },
        emulatedUserAgent: "Synthetic mobile UA",
        throttlingMethod: "simulate",
        throttling: { cpuSlowdownMultiplier: 4, rttMs: 150 },
        disableStorageReset: false,
      },
    },
    artifacts: {
      URL: { requestedUrl: target, mainDocumentUrl: target, finalDisplayedUrl: target },
      Trace: { traceEvents: [{ name: "RunTask", dur: 66000, args: { data: { url: target } } }] },
      DevtoolsLog: [
        { method: "Network.requestWillBeSent", params: { request: { url: target, headers: {} } } },
      ],
    },
  };
}

async function directory() {
  const name = await mkdtemp(path.join(os.tmpdir(), "portfolio-lighthouse-fixture-"));
  directories.push(name);
  return name;
}

afterEach(async () => {
  vi.useRealTimers();
  await Promise.all(
    directories.splice(0).map((name) => {
      if (
        !path.isAbsolute(name) ||
        path.dirname(name) !== os.tmpdir() ||
        !path.basename(name).startsWith("portfolio-lighthouse-fixture-")
      )
        throw new Error("Refusing cleanup outside the owned fixture directory.");
      return rm(name, { recursive: true, force: true });
    }),
  );
});

function readyFixture() {
  let observe: ((request: { url: () => string }) => void) | undefined;
  const proof = {
    url: "about:blank",
    readyState: "complete",
    frameTimestamps: [16, 32],
    httpResources: 0,
  };
  const page = {
    url: vi.fn(() => "about:blank"),
    bringToFront: vi.fn(() => Promise.resolve(undefined)),
    waitForFunction: vi.fn(() => Promise.resolve(undefined)),
    evaluate: vi.fn(() => Promise.resolve(proof)),
    on: vi.fn((_event: string, handler: (request: { url: () => string }) => void) => {
      observe = handler;
    }),
    off: vi.fn(),
  };
  const browser = {
    newPage: vi.fn(() => Promise.resolve(page as unknown as Page)),
    disconnect: vi.fn(() => Promise.resolve(undefined)),
  };
  return {
    page,
    browser,
    proof,
    connect: vi.fn(() => Promise.resolve(browser as unknown as Browser)),
    request: (url: string) => observe?.({ url: () => url }),
  };
}

describe("exact audited-page lifecycle readiness", () => {
  it("returns the same new blank Page with two distinct callbacks and zero HTTP before the audit", async () => {
    const context = readyFixture();
    const ready = await prepareAuditedPage(18999, { connect: context.connect });
    expect(ready.page).toBe(context.page);
    expect(ready.browser).toBe(context.browser);
    expect(ready.proof.frameTimestamps).toEqual([16, 32]);
    expect(ready.proof.httpRequests).toBe(0);
    expect(ready.proof.httpResources).toBe(0);
    expect(context.connect).toHaveBeenCalledExactlyOnceWith({
      browserURL: "http://127.0.0.1:18999",
      defaultViewport: null,
    });
    expect(context.browser.newPage).toHaveBeenCalledTimes(1);
    expect(context.page.off).toHaveBeenCalledWith("request", expect.any(Function));
    expect(context.browser.disconnect).not.toHaveBeenCalled();
  });

  it("refuses an already navigated target without adopting it or loading a site", async () => {
    const context = readyFixture();
    context.page.url.mockReturnValue(target);
    await expect(prepareAuditedPage(18999, { connect: context.connect })).rejects.toThrow(
      /new blank page/,
    );
    expect(context.page.evaluate).not.toHaveBeenCalled();
    expect(context.browser.disconnect).toHaveBeenCalledTimes(1);
  });

  it.each(["document", "frames", "resources"])(
    "refuses invalid %s proof and disconnects",
    async (invalid) => {
      const context = readyFixture();
      if (invalid === "document") context.proof.readyState = "loading";
      if (invalid === "frames") context.proof.frameTimestamps = [16, 16];
      if (invalid === "resources") context.proof.httpResources = 1;
      await expect(prepareAuditedPage(18999, { connect: context.connect })).rejects.toThrow(
        /readiness proof/,
      );
      expect(context.browser.disconnect).toHaveBeenCalledTimes(1);
    },
  );

  it("refuses an observed HTTP request even when the returned resource list is empty", async () => {
    const context = readyFixture();
    context.page.waitForFunction.mockImplementation(() => {
      context.request(target);
      return Promise.resolve(undefined);
    });
    await expect(prepareAuditedPage(18999, { connect: context.connect })).rejects.toThrow(
      /readiness proof/,
    );
    expect(context.browser.disconnect).toHaveBeenCalledTimes(1);
  });

  it("fails the single readiness deadline rather than retrying a hung renderer", async () => {
    vi.useFakeTimers();
    const context = readyFixture();
    context.page.waitForFunction.mockImplementation(() => new Promise(() => undefined));
    const pending = prepareAuditedPage(18999, { connect: context.connect, timeoutMs: 20 });
    const failed = expect(pending).rejects.toThrow(/readiness deadline/);
    await vi.advanceTimersByTimeAsync(20);
    await failed;
    expect(context.connect).toHaveBeenCalledTimes(1);
    expect(context.page.evaluate).not.toHaveBeenCalled();
    expect(context.browser.disconnect).toHaveBeenCalledTimes(1);
  });

  it("disconnects a connection that arrives after the deadline without creating another target", async () => {
    vi.useFakeTimers();
    const context = readyFixture();
    let deliver: ((browser: Browser) => void) | undefined;
    const connect = vi.fn(
      () =>
        new Promise<Browser>((resolve) => {
          deliver = resolve;
        }),
    );
    const pending = prepareAuditedPage(18999, { connect, timeoutMs: 20 });
    const failed = expect(pending).rejects.toThrow(/readiness deadline/);
    await vi.advanceTimersByTimeAsync(20);
    await failed;
    assert(deliver);
    deliver(context.browser as unknown as Browser);
    await Promise.resolve();
    await Promise.resolve();
    expect(context.browser.disconnect).toHaveBeenCalledTimes(1);
    expect(context.browser.newPage).not.toHaveBeenCalled();
  });

  it("refuses invalid ports and an extended deadline before connecting", async () => {
    const context = readyFixture();
    await expect(prepareAuditedPage(80, { connect: context.connect })).rejects.toThrow(/bounds/);
    await expect(
      prepareAuditedPage(18999, { connect: context.connect, timeoutMs: 5001 }),
    ).rejects.toThrow(/bounds/);
    expect(context.connect).not.toHaveBeenCalled();
  });

  it("preserves the readiness cause when disconnect also fails", async () => {
    const context = readyFixture();
    context.page.url.mockReturnValue(target);
    context.browser.disconnect.mockRejectedValue(new Error("synthetic disconnect failure"));
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      await expect(prepareAuditedPage(18999, { connect: context.connect })).rejects.toThrow(
        /new blank page/,
      );
      expect(warning).toHaveBeenCalledExactlyOnceWith(
        "Owned-browser disconnect failed; launcher cleanup remains required.",
      );
    } finally {
      warning.mockRestore();
    }
  });
});

describe("bounded Lighthouse diagnostic evidence", () => {
  it("roundtrips complete raw artifacts and binds bytes/hashes to the exact resolved hybrid profile", async () => {
    const output = await directory();
    const result = fixture();
    await saveRunDiagnostics(result, 1, { browserStartup: 100, audit: 1900 }, output);
    const trace = await readFile(path.join(output, "run-1.trace.json"), "utf8");
    const network = await readFile(path.join(output, "run-1.devtoolslog.json"), "utf8");
    expect(JSON.parse(trace)).toEqual(result.artifacts.Trace);
    expect(JSON.parse(network)).toEqual(result.artifacts.DevtoolsLog);
    const metadata = JSON.parse(
      await readFile(path.join(output, "run-1.diagnostics.json"), "utf8"),
    );
    expect(metadata.profile).toEqual(result.lhr.configSettings);
    expect(metadata.timingsMs.browserStartup).toBe(100);
    expect(metadata.timingsMs.audit).toBe(1900);
    expect(metadata.timingsMs.artifactWrite).toBeGreaterThanOrEqual(0);
    expect(metadata.artifacts).toEqual(
      [
        ["run-1.trace.json", trace],
        ["run-1.devtoolslog.json", network],
      ].map(([name, body]) => ({
        name,
        bytes: Buffer.byteLength(body ?? "", "utf8"),
        sha256: createHash("sha256")
          .update(body ?? "")
          .digest("hex"),
      })),
    );
  });

  it.each([
    "https://example.invalid/private",
    "http://127.0.0.1:4175/other/",
    target + "?token=synthetic",
    target + "#private",
    "http://user:pass@127.0.0.1:4175/portfolio-case-study-site/",
  ])("refuses unexpected network URL %s before writing any evidence", async (url) => {
    const output = await directory();
    const result = fixture();
    first(result.artifacts.DevtoolsLog).params.request.url = url;
    await expect(saveRunDiagnostics(result, 1, { browserStartup: 1 }, output)).rejects.toThrow(
      /owned static target/,
    );
    expect(await readdir(output)).toEqual([]);
  });

  it("refuses an unexpected final navigation and trace source independently", async () => {
    const output = await directory();
    const redirect = fixture();
    redirect.lhr.finalDisplayedUrl = target + "redirected/";
    await expect(saveRunDiagnostics(redirect, 1, { audit: 1 }, output)).rejects.toThrow(
      /owned static target/,
    );
    const trace = fixture();
    first(trace.artifacts.Trace.traceEvents).args.data.url = "file:///private.txt";
    await expect(saveRunDiagnostics(trace, 1, { audit: 1 }, output)).rejects.toThrow(
      /owned static target/,
    );
    expect(await readdir(output)).toEqual([]);
  });

  it.each(["chrome:", "chrome-untrusted:"])(
    "retains %s source labels only in raw Trace, never as network destinations",
    async (scheme) => {
      const output = await directory();
      const result = fixture();
      const source = scheme + "//browser-internal/component/source.js";
      first(result.artifacts.Trace.traceEvents).args.data.url = source;
      await saveRunDiagnostics(result, 1, { audit: 1 }, output);
      const trace = JSON.parse(await readFile(path.join(output, "run-1.trace.json"), "utf8"));
      expect(trace.traceEvents[0].args.data.url).toBe(source);
      first(result.artifacts.Trace.traceEvents).args.data.url = "_lighthouse-eval.js";
      await saveRunDiagnostics(result, 2, { audit: 1 }, output);
      first(result.artifacts.DevtoolsLog).params.request.url = source;
      await expect(saveRunDiagnostics(result, 3, { audit: 1 }, output)).rejects.toThrow(
        /owned static target/,
      );
      expect(await readdir(output)).not.toContain("run-3.trace.json");
    },
  );

  it.each([
    "chrome://user:password@browser-internal/component",
    "chrome://browser-internal/component?private=value",
    "chrome://browser-internal/component#private",
    "chrome-untrusted://user:password@browser-internal/component",
    "chrome-untrusted://browser-internal/component?private=value",
    "chrome-untrusted://browser-internal/component#private",
  ])("refuses credentials/query/fragments in browser-internal Trace labels", async (source) => {
    const output = await directory();
    const result = fixture();
    first(result.artifacts.Trace.traceEvents).args.data.url = source;
    await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
      /owned static target/,
    );
    expect(await readdir(output)).toEqual([]);
  });

  it("refuses absolute filesystem labels even when they are not file URLs", async () => {
    const output = await directory();
    const result = fixture();
    first(result.artifacts.Trace.traceEvents).args.data.url = "/private/source.js";
    await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
      /absolute filesystem/,
    );
    first(result.artifacts.Trace.traceEvents).args.data.url = "C:/private/source.js";
    await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
      /owned static target/,
    );
    expect(await readdir(output)).toEqual([]);
  });

  it.each(["Authorization", "Cookie", "Set-Cookie", "Proxy-Authorization"])(
    "refuses credential header %s",
    async (name) => {
      const output = await directory();
      const result = fixture();
      first(result.artifacts.DevtoolsLog).params.request.headers = {
        [name]: "synthetic-private-value",
      };
      await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
        /credential-bearing/,
      );
      expect(await readdir(output)).toEqual([]);
    },
  );

  it("refuses excessive raw bytes without writing a truncated trace", async () => {
    const output = await directory();
    const result = fixture();
    first(result.artifacts.Trace.traceEvents).name = "é".repeat(7 * 1024 * 1024);
    await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
      /byte budget/,
    );
    expect(await readdir(output)).toEqual([]);
  });

  it("independently bounds DevTools bytes and record counts", async () => {
    const output = await directory();
    const bytes = fixture();
    first(bytes.artifacts.DevtoolsLog).method = "x".repeat(2 * 1024 * 1024);
    await expect(saveRunDiagnostics(bytes, 1, { audit: 1 }, output)).rejects.toThrow(/byte budget/);
    const count = fixture();
    count.artifacts.DevtoolsLog = Array.from({ length: 10001 }, () =>
      first(count.artifacts.DevtoolsLog),
    );
    await expect(saveRunDiagnostics(count, 1, { audit: 1 }, output)).rejects.toThrow(
      /excessive raw/,
    );
    expect(await readdir(output)).toEqual([]);
  });

  it.each([{ postData: "synthetic-body" }, { associatedCookies: [{ cookie: "synthetic" }] }])(
    "refuses body or cookie records before writing raw diagnostics",
    async (privateFields) => {
      const output = await directory();
      const result = fixture();
      Object.assign(first(result.artifacts.DevtoolsLog).params.request, privateFields);
      await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
        /bodies or cookies/,
      );
      expect(await readdir(output)).toEqual([]);
    },
  );

  it("does not echo a malformed URL into an exception", async () => {
    const output = await directory();
    const result = fixture();
    result.lhr.requestedUrl = "synthetic-private-non-url";
    await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
      "Lighthouse diagnostics refused a malformed static-target URL.",
    );
    expect(await readdir(output)).toEqual([]);
  });

  it("refuses secret-like raw values without recording the offending content", async () => {
    const output = await directory();
    const result = fixture();
    first(result.artifacts.Trace.traceEvents).name = "ghp_" + "a".repeat(24);
    await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
      "Lighthouse diagnostics refused a secret-like value.",
    );
    expect(await readdir(output)).toEqual([]);
  });

  it("refuses excessive record counts, invalid run identifiers and invalid durations", async () => {
    const output = await directory();
    const result = fixture();
    result.artifacts.Trace.traceEvents = Array.from({ length: 100001 }, () =>
      first(result.artifacts.Trace.traceEvents),
    );
    await expect(saveRunDiagnostics(result, 1, { audit: 1 }, output)).rejects.toThrow(
      /excessive raw/,
    );
    await expect(saveRunDiagnostics(fixture(), 4, { audit: 1 }, output)).rejects.toThrow(
      /run number/,
    );
    await expect(saveRunDiagnostics(fixture(), 1, { audit: Number.NaN }, output)).rejects.toThrow(
      /timing/,
    );
    expect(await readdir(output)).toEqual([]);
  });

  it.each([511.5, 827.5])(
    "keeps one slow run of %sms fatal even when the other two are zero",
    (slow) => {
      const results = [slow, 0, 0].map((blocking) => ({
        categories: Object.fromEntries(
          ["accessibility", "best-practices", "performance", "seo"].map((name) => [
            name,
            { score: 1 },
          ]),
        ),
        audits: {
          "first-contentful-paint": { numericValue: 1000 },
          "largest-contentful-paint": { numericValue: 1300 },
          "total-blocking-time": { numericValue: blocking },
          "cumulative-layout-shift": { numericValue: 0 },
        },
      }));
      const summary = summarize(results);
      expect(summary.audits["total-blocking-time"]).toBe(slow);
      expect(() => enforceBudgets(summary)).toThrow(/total-blocking-time/);
    },
  );
});
