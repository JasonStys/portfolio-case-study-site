/**
 * @file Validates generated routes, repository-base links, metadata, and compressed asset budgets.
 * Functions: collectFiles, targetForUrl, validateHtml, validateBudgets, main.
 * Variables: ROOT, DIST, REQUIRED_OUTPUTS, BUDGETS.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { access, readFile, readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BASE = "/portfolio-case-study-site/";
const REQUIRED_OUTPUTS = [
  "index.html",
  "projects/index.html",
  "updates/index.html",
  "downloads/index.html",
  "downloads/index.json",
  "space-systems/index.html",
  "drone-systems/index.html",
  "about/index.html",
  "404.html",
  "search-index.json",
  "feed.xml",
  "sitemap.xml",
  "robots.txt",
  "favicon.svg",
  "manifest.webmanifest",
];
const BUDGETS = {
  javascriptGzipBytes: 32_000,
  cssGzipBytes: 24_000,
  largestHtmlBytes: 55_000,
  searchIndexBytes: 100_000,
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(absolute)));
    else files.push(absolute);
  }
  return files;
}

function targetForUrl(url) {
  const pathname = url.split(/[?#]/u, 1)[0] ?? "";
  if (!pathname.startsWith(BASE)) return null;
  const relative = pathname.slice(BASE.length);
  if (relative.length === 0 || relative.endsWith("/"))
    return path.join(DIST, relative, "index.html");
  return path.join(DIST, relative);
}

async function validateHtml(file) {
  const html = await readFile(file, "utf8");
  for (const required of [
    '<meta name="description"',
    'rel="canonical"',
    "Skip to main content",
    '<main id="main-content"',
  ]) {
    if (!html.includes(required))
      throw new Error(`${path.relative(DIST, file)} is missing ${required}.`);
  }
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/gu)].map((match) => match[1] ?? "");
  for (const url of urls) {
    const target = targetForUrl(url);
    if (target)
      await access(target).catch(() => {
        throw new Error(`${path.relative(DIST, file)} links to missing output ${url}.`);
      });
  }
  const inlineJavaScript = [...html.matchAll(/<script\s+type="module">([\s\S]*?)<\/script>/gu)].map(
    (match) => match[1] ?? "",
  );
  return { htmlBytes: Buffer.byteLength(html), inlineJavaScript };
}

async function validateBudgets(files, htmlSizes, inlineJavaScript) {
  const javascript = files.filter((file) => file.endsWith(".js"));
  const css = files.filter((file) => file.endsWith(".css"));
  const compressedSize = async (selected) =>
    selected.reduce(
      async (totalPromise, file) =>
        (await totalPromise) + gzipSync(await readFile(file)).byteLength,
      Promise.resolve(0),
    );
  const metrics = {
    javascriptGzipBytes:
      (await compressedSize(javascript)) +
      inlineJavaScript.reduce((total, source) => total + gzipSync(source).byteLength, 0),
    cssGzipBytes: await compressedSize(css),
    largestHtmlBytes: Math.max(...htmlSizes),
    searchIndexBytes: (await stat(path.join(DIST, "search-index.json"))).size,
  };
  const failures = Object.entries(BUDGETS)
    .filter(([key, maximum]) => (metrics[key] ?? Number.POSITIVE_INFINITY) > maximum)
    .map(([key]) => key);
  if (failures.length > 0)
    throw new Error(`Generated asset budgets failed: ${failures.join(", ")}.`);
  console.log(JSON.stringify({ metrics, budgets: BUDGETS }, null, 2));
}

async function main() {
  for (const output of REQUIRED_OUTPUTS) await access(path.join(DIST, output));
  const names = JSON.parse(
    await readFile(path.join(ROOT, "src/data/portfolio-priority.json"), "utf8"),
  );
  const upgrades = JSON.parse(
    await readFile(path.join(ROOT, "src/data/project-upgrades.json"), "utf8"),
  );
  const index = await readFile(path.join(DIST, "projects/index.html"), "utf8");
  const renderedNames = [...index.matchAll(/data-project-id="([^"]+)"/gu)].map((match) => match[1]);
  if (JSON.stringify(renderedNames) !== JSON.stringify(names))
    throw new Error("All 67 projects must retain canonical static, no-JavaScript catalog order.");
  const updates = await readFile(path.join(DIST, "updates/index.html"), "utf8");
  const updateNames = [...updates.matchAll(/data-upgrade-project="([^"]+)"/gu)].map(
    (match) => match[1],
  );
  if (JSON.stringify(updateNames) !== JSON.stringify(names))
    throw new Error("Latest-work index must cover all 67 projects in canonical order.");
  const sitemap = await readFile(path.join(DIST, "sitemap.xml"), "utf8");
  for (const name of names) {
    const detail = await readFile(path.join(DIST, "projects", name, "index.html"), "utf8");
    if (!sitemap.includes(`/projects/${name}/`)) throw new Error(`Sitemap missing ${name}.`);
    const upgrade = upgrades.repositories.find((entry) => entry.name === name);
    if (
      upgrade &&
      (!detail.includes(upgrade.sourceCommit) || !detail.includes(upgrade.validationReportUrl))
    )
      throw new Error(`Generated source-bound evidence missing for ${name}.`);
    if (
      !upgrade &&
      (name !== "portfolio-case-study-site" || !detail.includes("data-portfolio-hub"))
    )
      throw new Error(`Unexpected hub/evidence boundary for ${name}.`);
  }
  const files = await collectFiles(DIST);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const htmlSizes = [];
  const inlineJavaScript = [];
  for (const file of htmlFiles) {
    const result = await validateHtml(file);
    htmlSizes.push(result.htmlBytes);
    inlineJavaScript.push(...result.inlineJavaScript);
  }
  await validateBudgets(files, htmlSizes, inlineJavaScript);
  console.log(`Validated ${files.length} generated files and ${htmlFiles.length} HTML routes.`);
}

await main();
