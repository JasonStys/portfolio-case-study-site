/**
 * @file Runs three production Lighthouse audits and enforces category, paint, blocking, and layout budgets.
 * Functions: scope validation, bounded raw diagnostics, runAudit, summarize, enforceBudgets, main.
 * Variables: owned target/output, diagnostic caps, unchanged three-run category and metric budgets.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { chromium } from "playwright";
import { startOwnedPreview } from "./owned-preview.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIRECTORY = path.join(ROOT, ".runtime", "lighthouse");
const TARGET_URL = "http://127.0.0.1:4175/portfolio-case-study-site/";
const RUN_COUNT = 3;
const CATEGORY_BUDGETS = { accessibility: 1, "best-practices": 0.95, performance: 0.92, seo: 0.95 };
const AUDIT_BUDGETS = {
  "first-contentful-paint": 1_800,
  "largest-contentful-paint": 2_500,
  "total-blocking-time": 200,
  "cumulative-layout-shift": 0.05,
};
const TRACE_BYTES = 12 * 1024 * 1024;
const DEVTOOLS_BYTES = 2 * 1024 * 1024;
const METADATA_BYTES = 256 * 1024;
const MAX_TRACE_EVENTS = 100_000;
const MAX_DEVTOOLS_ENTRIES = 10_000;

/** Accept diagnostic URLs only from this owned static listener; never record private user URLs. */
function checkDiagnosticUrl(raw, mainDocument = false, browserTrace = false) {
  if (!mainDocument && (raw === "" || raw === "about:blank")) return;
  // V8/sourceURL labels in Trace are plain strings, not navigable network destinations.
  if (browserTrace && typeof raw === "string" && !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(raw)) {
    if (/^[\\/]/u.test(raw))
      throw new Error("Lighthouse diagnostics refused an absolute filesystem source label.");
    return;
  }
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Lighthouse diagnostics refused a malformed static-target URL.");
  }
  // Internal Chrome source labels vary by platform/version; they are not page network destinations.
  if (
    browserTrace &&
    ["chrome:", "chrome-untrusted:"].includes(url.protocol) &&
    url.hostname &&
    !url.port &&
    !url.username &&
    !url.password &&
    !url.search &&
    !url.hash
  )
    return;
  if (
    url.origin !== new URL(TARGET_URL).origin ||
    !url.pathname.startsWith(new URL(TARGET_URL).pathname) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (mainDocument && url.href !== TARGET_URL)
  )
    throw new Error(
      `Lighthouse diagnostics refused a URL outside the owned static target (protocol=${["http:", "https:", "file:", "about:", "data:", "chrome:", "devtools:"].includes(url.protocol) ? url.protocol : "other"}; ownedOrigin=${url.origin === new URL(TARGET_URL).origin}; basePath=${url.pathname.startsWith(new URL(TARGET_URL).pathname)}).`,
    );
}

/** Inspect the raw artifacts before any write; unexpected traffic or credentials fail closed. */
function validateDiagnosticScope(result) {
  for (const value of [
    result.lhr.requestedUrl,
    result.lhr.mainDocumentUrl,
    result.lhr.finalDisplayedUrl,
    result.artifacts.URL?.requestedUrl,
    result.artifacts.URL?.mainDocumentUrl,
    result.artifacts.URL?.finalDisplayedUrl,
  ])
    checkDiagnosticUrl(value, true);
  let visited = 0;
  function visit(value, depth = 0, browserTrace = false) {
    if (++visited > 1_000_000 || depth > 48)
      throw new Error("Diagnostic structure exceeds its inspection budget.");
    if (
      typeof value === "string" &&
      /(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u.test(
        value,
      )
    )
      throw new Error("Lighthouse diagnostics refused a secret-like value.");
    if (value === null || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (/^(?:url|documentURL)$/iu.test(key) && typeof child === "string")
        checkDiagnosticUrl(child, false, browserTrace);
      if (
        /^(?:headers|requestHeaders|responseHeaders)$/iu.test(key) &&
        child &&
        typeof child === "object" &&
        Object.keys(child).some((name) =>
          /^(?:authorization|proxy-authorization|cookie|set-cookie)$/iu.test(name),
        )
      )
        throw new Error("Lighthouse diagnostics refused credential-bearing headers.");
      if (
        /^(?:postData|postDataEntries|cookies|associatedCookies)$/iu.test(key) &&
        child &&
        (typeof child === "string" ? child.length > 0 : Array.isArray(child) && child.length > 0)
      )
        throw new Error("Lighthouse diagnostics refused request bodies or cookies.");
      visit(child, depth + 1, browserTrace);
    }
  }
  visit(result.artifacts.Trace, 0, true);
  visit(result.artifacts.DevtoolsLog);
}

/** Refuse oversize JSON rather than truncating a trace into misleading or invalid evidence. */
function boundedJson(value, maximum) {
  const json = JSON.stringify(value) + "\n";
  if (Buffer.byteLength(json, "utf8") > maximum)
    throw new Error("Lighthouse diagnostic byte budget exceeded.");
  return json;
}

/** Save only the public Trace/DevtoolsLog artifacts, exact resolved profile and measured timings. */
export async function saveRunDiagnostics(result, runNumber, timings, directory = OUTPUT_DIRECTORY) {
  if (!Number.isInteger(runNumber) || runNumber < 1 || runNumber > RUN_COUNT)
    throw new Error("Invalid Lighthouse diagnostic run number.");
  const { Trace, DevtoolsLog } = result.artifacts;
  if (
    !Array.isArray(Trace?.traceEvents) ||
    Trace.traceEvents.length > MAX_TRACE_EVENTS ||
    !Array.isArray(DevtoolsLog) ||
    DevtoolsLog.length > MAX_DEVTOOLS_ENTRIES
  )
    throw new Error("Missing or excessive raw Lighthouse diagnostics.");
  if (
    !Object.values(timings).every(
      (value) => typeof value === "number" && Number.isFinite(value) && value >= 0,
    )
  )
    throw new Error("Invalid Lighthouse diagnostic timing.");
  validateDiagnosticScope(result);
  const trace = boundedJson(Trace, TRACE_BYTES);
  const devtools = boundedJson(DevtoolsLog, DEVTOOLS_BYTES);
  const artifactStarted = performance.now();
  const files = [
    [`run-${runNumber}.trace.json`, trace],
    [`run-${runNumber}.devtoolslog.json`, devtools],
  ];
  const settings = result.lhr.configSettings;
  const metadata = {
    schemaVersion: 1,
    run: runNumber,
    targetUrl: TARGET_URL,
    observedAt: new Date().toISOString(),
    lighthouseVersion: result.lhr.lighthouseVersion,
    profile: {
      formFactor: settings.formFactor,
      screenEmulation: settings.screenEmulation,
      emulatedUserAgent: settings.emulatedUserAgent,
      throttlingMethod: settings.throttlingMethod,
      throttling: settings.throttling,
      disableStorageReset: settings.disableStorageReset,
    },
    environment: result.lhr.environment,
    lighthouseTiming: result.lhr.timing,
    timingsMs: { ...timings },
    caps: {
      traceBytes: TRACE_BYTES,
      devtoolsBytes: DEVTOOLS_BYTES,
      metadataBytes: METADATA_BYTES,
      traceEvents: MAX_TRACE_EVENTS,
      devtoolsEntries: MAX_DEVTOOLS_ENTRIES,
    },
    artifacts: files.map(([name, body]) => ({
      name,
      bytes: Buffer.byteLength(body, "utf8"),
      sha256: createHash("sha256").update(body).digest("hex"),
    })),
    scope:
      "Fresh owned Chrome profile and fixed loopback static site only; raw artifacts are complete within caps, not a cause diagnosis. No warm-up, retries or discarded samples.",
  };
  // Validate every byte budget and scope before creating any diagnostic files.
  boundedJson(metadata, METADATA_BYTES);
  for (const [name, body] of files) await writeFile(path.join(directory, name), body, "utf8");
  metadata.timingsMs.artifactWrite = performance.now() - artifactStarted;
  await writeFile(
    path.join(directory, `run-${runNumber}.diagnostics.json`),
    boundedJson(metadata, METADATA_BYTES),
    "utf8",
  );
}

function isWindowsCleanupError(error) {
  const code = /** @type {NodeJS.ErrnoException} */ (error)?.code;
  return process.platform === "win32" && (code === "EPERM" || code === "EBUSY");
}

async function stopChrome(chrome) {
  try {
    await chrome.kill();
  } catch (error) {
    if (!isWindowsCleanupError(error)) throw error;
    console.warn("Chromium stopped; Windows deferred temporary-profile cleanup.");
  }
}

async function runAudit(runNumber) {
  const startupStarted = performance.now();
  const chrome = await launch({
    chromePath: process.env.CHROME_PATH || chromium.executablePath(),
    chromeFlags: ["--headless", "--disable-dev-shm-usage"],
    logLevel: "error",
  });
  const browserStartup = performance.now() - startupStarted;
  try {
    const auditStarted = performance.now();
    const result = await lighthouse(TARGET_URL, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: Object.keys(CATEGORY_BUDGETS),
      formFactor: "desktop",
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
    });
    if (!result) throw new Error(`Lighthouse run ${runNumber} returned no result.`);
    const audit = performance.now() - auditStarted;
    await writeFile(path.join(OUTPUT_DIRECTORY, `run-${runNumber}.json`), result.report, "utf8");
    await saveRunDiagnostics(result, runNumber, { browserStartup, audit });
    return result.lhr;
  } finally {
    await stopChrome(chrome);
  }
}

function median(values) {
  if (values.length === 0 || values.length % 2 === 0)
    throw new Error("Median requires a non-empty odd-sized sample.");
  const sorted = values.toSorted((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

export function summarize(results) {
  const categories = Object.fromEntries(
    Object.keys(CATEGORY_BUDGETS).map((name) => {
      const scores = results.map((result) => result.categories[name]?.score ?? 0);
      return [name, name === "performance" ? median(scores) : Math.min(...scores)];
    }),
  );
  const audits = Object.fromEntries(
    Object.keys(AUDIT_BUDGETS).map((name) => [
      name,
      Math.max(
        ...results.map((result) => result.audits[name]?.numericValue ?? Number.POSITIVE_INFINITY),
      ),
    ]),
  );
  return { categories, audits };
}

export function enforceBudgets(summary) {
  const failures = [];
  for (const [name, minimum] of Object.entries(CATEGORY_BUDGETS))
    if ((summary.categories[name] ?? 0) < minimum) failures.push(`${name} score`);
  for (const [name, maximum] of Object.entries(AUDIT_BUDGETS))
    if ((summary.audits[name] ?? Number.POSITIVE_INFINITY) > maximum) failures.push(name);
  if (failures.length > 0) throw new Error(`Lighthouse budgets failed: ${failures.join(", ")}.`);
}

async function main() {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const preview = await startOwnedPreview({ port: 4175 });
  try {
    const results = [];
    for (let runNumber = 1; runNumber <= RUN_COUNT; runNumber += 1)
      results.push(await runAudit(runNumber));
    const summary = summarize(results);
    await writeFile(
      path.join(OUTPUT_DIRECTORY, "summary.json"),
      `${JSON.stringify({ generatedAt: new Date().toISOString(), ...summary }, null, 2)}\n`,
      "utf8",
    );
    console.log(JSON.stringify(summary, null, 2));
    enforceBudgets(summary);
  } finally {
    await preview.stop();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (process.platform === "win32") process.exit(process.exitCode ?? 0);
  }
}
