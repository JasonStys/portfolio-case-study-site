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
const REVIEWED_REPOSITORY_NAMES = Object.freeze(
  JSON.parse(await readFile(path.join(ROOT, "src/data/portfolio-priority.json"), "utf8")),
);
if (
  !Array.isArray(REVIEWED_REPOSITORY_NAMES) ||
  new Set(REVIEWED_REPOSITORY_NAMES).size !== REVIEWED_REPOSITORY_NAMES.length
)
  throw new Error("Reviewed repository priority must be a unique array.");
const MAX_CACHE_AGE_DAYS = 90;
const checkOnly = process.argv.includes("--check");

function validateExisting(value, allowMissing = false) {
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
    (!allowMissing && names.length !== expectedNames.size) ||
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
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`GitHub request failed with ${response.status} for ${url}.`);
  return response.json();
}

async function refreshRepository(repositoryName, existing) {
  const [repository, languageBytes] = await Promise.all([
    fetchJson(`https://api.github.com/repos/${OWNER}/${repositoryName}`),
    fetchJson(`https://api.github.com/repos/${OWNER}/${repositoryName}/languages`),
  ]);
  if (repository.private || repository.archived)
    throw new Error(`${repositoryName} is not an active public repository.`);
  const detectedLanguages = Object.keys(languageBytes);
  return {
    ...existing,
    name: repositoryName,
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
  const existing = validateExisting(JSON.parse(await readFile(CACHE_PATH, "utf8")), !checkOnly);
  if (checkOnly) return checkCache(existing);
  const repositories = [];
  const existingByName = new Map(
    existing.repositories.map((repository) => [repository.name, repository]),
  );
  for (const repositoryName of REVIEWED_REPOSITORY_NAMES) {
    const repository = existingByName.get(repositoryName) ?? {
      name: repositoryName,
      languages: [],
      topics: [],
    };
    repositories.push(await refreshRepository(repositoryName, repository));
  }
  const refreshed = { ...existing, fetchedAt: new Date().toISOString(), repositories };
  validateExisting(refreshed);
  await writeFile(CACHE_PATH, `${JSON.stringify(refreshed, null, 2)}\n`, "utf8");
  checkCache(refreshed);
}

await main();
