/**
 * @file Enforces documentation, source-header, case-study, action-pin, secret, and content-safety contracts.
 * Functions: collectFiles, readTextFiles, validateRequiredFiles, validateHeaders, validateWorkflows, validateContent, main.
 * Variables: ROOT, EXCLUDED_DIRECTORIES, REQUIRED_FILES, CODE_EXTENSIONS, FORBIDDEN_PATTERNS.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXCLUDED_DIRECTORIES = new Set([
  ".astro",
  ".git",
  ".runtime",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);
const REQUIRED_FILES = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CHANGELOG.md",
  "LICENSE",
  "docs/ARCHITECTURE.md",
  "docs/COMPLEXITY.md",
  "docs/CONTENT_GUIDE.md",
  "docs/DEPLOYMENT_CHECKLIST.md",
  "docs/LIMITATIONS.md",
  "docs/OPERATIONS.md",
  "docs/RESEARCH.md",
  "docs/SECURITY.md",
  "docs/TESTING.md",
  "docs/adrs/0001-static-astro.md",
  "docs/reports/PERFORMANCE.md",
  "docs/reports/SITE_QUALITY.md",
  "docs/reports/TEST_SUMMARY.md",
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/dependency-review.yml",
  ".github/dependabot.yml",
];
const CODE_EXTENSIONS = new Set([".astro", ".css", ".js", ".mjs", ".ts"]);
const FORBIDDEN_PATTERNS = [
  /ghp_[A-Za-z0-9]{20,}/u,
  /github_pat_[A-Za-z0-9_]{20,}/u,
  /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/u,
  /opto\s*22/iu,
];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (EXCLUDED_DIRECTORIES.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(absolute)));
    else files.push(absolute);
  }
  return files;
}

async function readTextFiles(files) {
  const records = [];
  for (const file of files) {
    if ([".png", ".jpg", ".jpeg", ".woff2"].includes(path.extname(file))) continue;
    records.push({
      file,
      relative: path.relative(ROOT, file).replaceAll("\\", "/"),
      source: await readFile(file, "utf8"),
    });
  }
  return records;
}

async function validateRequiredFiles() {
  for (const file of REQUIRED_FILES)
    await access(path.join(ROOT, file)).catch(() => {
      throw new Error(`Required repository file is missing: ${file}.`);
    });
}

function validateHeaders(records) {
  for (const record of records.filter(({ file }) => CODE_EXTENSIONS.has(path.extname(file)))) {
    const header = record.source.split(/\r?\n/u).slice(0, 12).join("\n");
    if (!/@file\s+/u.test(header))
      throw new Error(
        `${record.relative} lacks an @file responsibility header in its first 12 lines.`,
      );
    if (!/Line locations:/u.test(header))
      throw new Error(`${record.relative} does not reference docs/CODE_INDEX.md.`);
  }
}

function validateWorkflows(records) {
  const workflows = records.filter(
    ({ relative }) => relative.startsWith(".github/workflows/") && /\.ya?ml$/u.test(relative),
  );
  for (const workflow of workflows) {
    if (!/^# File:/u.test(workflow.source))
      throw new Error(`${workflow.relative} lacks its descriptive file header.`);
    for (const match of workflow.source.matchAll(/^\s*uses:\s*([^\s#]+).*$/gmu)) {
      const action = match[1] ?? "";
      if (!/@[0-9a-f]{40}$/u.test(action))
        throw new Error(`${workflow.relative} uses an unpinned action: ${action}.`);
    }
  }
}

function validateContent(records) {
  const combined = records.map(({ source }) => source).join("\n");
  for (const pattern of FORBIDDEN_PATTERNS)
    if (pattern.test(combined))
      throw new Error(`Repository content matched forbidden pattern ${pattern}.`);
  const sourceRecords = records.filter(({ relative }) => relative.startsWith("src/"));
  for (const record of sourceRecords) {
    if (/\b(?:innerHTML|outerHTML|eval|new Function)\b/u.test(record.source))
      throw new Error(
        `${record.relative} uses a prohibited dynamic-code or dynamic-HTML primitive.`,
      );
  }
  const caseStudies = records.filter(
    ({ relative }) => relative.startsWith("src/content/case-studies/") && relative.endsWith(".md"),
  );
  if (caseStudies.length !== 6)
    throw new Error(`Expected 6 featured case studies, found ${caseStudies.length}.`);
  for (const study of caseStudies)
    for (const heading of [
      "## Problem",
      "## Constraints",
      "## Design",
      "## Verification",
      "## Measured result",
      "## Limitations",
    ])
      if (!study.source.includes(heading))
        throw new Error(`${study.relative} is missing ${heading}.`);
}

async function main() {
  await validateRequiredFiles();
  const files = await collectFiles(ROOT);
  const records = await readTextFiles(files);
  validateHeaders(records);
  validateWorkflows(records);
  validateContent(records);
  console.log(`Repository contract passed for ${records.length} authored text files.`);
}

await main();
