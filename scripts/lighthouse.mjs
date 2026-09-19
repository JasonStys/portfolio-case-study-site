/**
 * @file Runs three production Lighthouse audits and enforces category, paint, blocking, and layout budgets.
 * Functions: waitForServer, launchPreview, stopChrome, runAudit, median, summarize, enforceBudgets, main.
 * Variables: ROOT, OUTPUT_DIRECTORY, TARGET_URL, RUN_COUNT, CATEGORY_BUDGETS, AUDIT_BUDGETS.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { chromium } from "playwright";

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

async function waitForServer(attempts = 60) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(TARGET_URL);
      if (response.ok) return;
    } catch {
      // Preview may still be binding the local port.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Production preview did not become ready.");
}

function launchPreview() {
  const astroExecutable = path.join(ROOT, "node_modules", "astro", "bin", "astro.mjs");
  return spawn(
    process.execPath,
    [astroExecutable, "preview", "--host", "127.0.0.1", "--port", "4175"],
    {
      cwd: ROOT,
      stdio: "ignore",
      windowsHide: true,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
    },
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
  const chrome = await launch({
    chromePath: process.env.CHROME_PATH || chromium.executablePath(),
    chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
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
    await writeFile(path.join(OUTPUT_DIRECTORY, `run-${runNumber}.json`), result.report, "utf8");
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

function summarize(results) {
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

function enforceBudgets(summary) {
  const failures = [];
  for (const [name, minimum] of Object.entries(CATEGORY_BUDGETS))
    if ((summary.categories[name] ?? 0) < minimum) failures.push(`${name} score`);
  for (const [name, maximum] of Object.entries(AUDIT_BUDGETS))
    if ((summary.audits[name] ?? Number.POSITIVE_INFINITY) > maximum) failures.push(name);
  if (failures.length > 0) throw new Error(`Lighthouse budgets failed: ${failures.join(", ")}.`);
}

async function main() {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const preview = launchPreview();
  try {
    await waitForServer();
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
    preview.kill();
  }
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (process.platform === "win32") process.exit(process.exitCode ?? 0);
}
