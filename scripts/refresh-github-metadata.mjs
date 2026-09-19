/**
 * @file Refreshes selected public GitHub facts while keeping reviewed technology annotations reproducible.
 * Functions: validateExisting, fetchJson, refreshRepository, checkCache, main.
 * Variables: ROOT, CACHE_PATH, OWNER, REVIEWED_REPOSITORY_NAMES, MAX_CACHE_AGE_DAYS, checkOnly.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_PATH = path.join(ROOT, "src", "data", "github-repositories.json");
const OWNER = "JasonStys";
const REVIEWED_REPOSITORY_NAMES = Object.freeze([
  "integration-operations-console",
  "player-telemetry-analytics-platform",
  "ml-model-lifecycle-observatory",
  "forge2d-engine",
  "accessible-design-system-lab",
  "cloud-job-orchestrator",
  "edge-vision-deployment-benchmark",
  "unity-tactical-ai-sandbox",
  "mips-pipeline-workbench",
  "secure-service-desk",
  "offline-first-field-app",
  "offline-incident-timeline-pwa",
  "mqtt-lifecycle-reliability-lab",
  "industrial-edge-digital-twin",
  "firmware-release-recovery-lab",
  "documentation-quality-gate",
  "node-red-resilient-metadata",
  "industrial-memory-protocol-workbench",
  "versioned-product-knowledge-portal",
  "engineering-documentation-foundry",
]);
const MAX_CACHE_AGE_DAYS = 90;
const checkOnly = process.argv.includes("--check");

function validateExisting(value) {
  if (
    value?.schemaVersion !== 1 ||
    value.owner !== OWNER ||
    !Array.isArray(value.repositories) ||
    value.repositories.length === 0
  )
    throw new Error("Repository cache has an unsupported shape.");
  const names = value.repositories.map((repository) => repository.name);
  const expectedNames = new Set(REVIEWED_REPOSITORY_NAMES);
  if (
    new Set(names).size !== names.length ||
    names.length !== expectedNames.size ||
    names.some((name) => !expectedNames.has(name))
  )
    throw new Error("Repository cache names must match the reviewed public allowlist.");
  return value;
}

async function fetchJson(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-case-study-site",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub request failed with ${response.status} for ${url}.`);
  return response.json();
}

async function refreshRepository(repositoryName, existing) {
  const [repository, languageBytes] = await Promise.all([
    fetchJson(`https://api.github.com/repos/${OWNER}/${repositoryName}`),
    fetchJson(`https://api.github.com/repos/${OWNER}/${repositoryName}/languages`),
  ]);
  if (repository.private || repository.archived)
    throw new Error(`${existing.name} is not an active public repository.`);
  const detectedLanguages = Object.keys(languageBytes);
  return {
    ...existing,
    description: repository.description || existing.description,
    url: repository.html_url,
    primaryLanguage: repository.language || existing.primaryLanguage,
    languages: [...new Set([...existing.languages, ...detectedLanguages])],
    topics: repository.topics.length > 0 ? repository.topics : existing.topics,
    pushedAt: repository.pushed_at,
  };
}

function checkCache(cache) {
  const ageDays = (Date.now() - Date.parse(cache.fetchedAt)) / 86_400_000;
  if (!Number.isFinite(ageDays) || ageDays < 0 || ageDays > MAX_CACHE_AGE_DAYS)
    throw new Error(
      `Repository cache age ${ageDays.toFixed(1)} days is outside the 0-${MAX_CACHE_AGE_DAYS} day policy.`,
    );
  for (const repository of cache.repositories) {
    if (repository.url !== `https://github.com/${cache.owner}/${repository.name}`)
      throw new Error(`Unexpected repository URL for ${repository.name}.`);
  }
  console.log(
    `Repository cache covers ${cache.repositories.length} projects and is ${ageDays.toFixed(1)} days old.`,
  );
}

async function main() {
  const existing = validateExisting(JSON.parse(await readFile(CACHE_PATH, "utf8")));
  if (checkOnly) return checkCache(existing);
  const repositories = [];
  const existingByName = new Map(
    existing.repositories.map((repository) => [repository.name, repository]),
  );
  for (const repositoryName of REVIEWED_REPOSITORY_NAMES) {
    const repository = existingByName.get(repositoryName);
    if (!repository) throw new Error(`Missing reviewed repository: ${repositoryName}.`);
    repositories.push(await refreshRepository(repositoryName, repository));
  }
  const refreshed = { ...existing, fetchedAt: new Date().toISOString(), repositories };
  await writeFile(CACHE_PATH, `${JSON.stringify(refreshed, null, 2)}\n`, "utf8");
  checkCache(refreshed);
}

await main();
