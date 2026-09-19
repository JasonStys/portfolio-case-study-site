/**
 * @file Validates cached GitHub metadata, merges curation, and derives deterministic facets.
 * Functions: buildCatalog, listFacetValues, validateCache, requireText, requireStringArray.
 * Variables: repositoryCache, projectCuration, projects, featuredProjects.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import rawRepositoryCache from "@/data/github-repositories.json";
import { projectCuration } from "@/data/project-curation";
import type {
  CachedRepository,
  Project,
  ProjectCuration,
  RepositoryCache,
  SearchFacet,
} from "@/lib/types";

const GITHUB_REPOSITORY_PREFIX = "https://github.com/JasonStys/";

function requireText(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`);
  }
  return value.trim();
}

function requireStringArray(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty string array.`);
  }
  const entries = value.map((entry, index) => requireText(entry, `${field}[${index}]`));
  if (new Set(entries).size !== entries.length) {
    throw new TypeError(`${field} must not contain duplicates.`);
  }
  return entries;
}

export function validateCache(value: unknown): RepositoryCache {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Repository cache must be an object.");
  }
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== 1) throw new TypeError("Unsupported repository cache schema.");
  const owner = requireText(candidate.owner, "owner");
  const fetchedAt = requireText(candidate.fetchedAt, "fetchedAt");
  if (Number.isNaN(Date.parse(fetchedAt)))
    throw new TypeError("fetchedAt must be an ISO timestamp.");
  const source = requireText(candidate.source, "source");
  if (!Array.isArray(candidate.repositories) || candidate.repositories.length === 0) {
    throw new TypeError("repositories must be a non-empty array.");
  }
  const names = new Set<string>();
  const repositories = candidate.repositories.map((raw, index): CachedRepository => {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      throw new TypeError(`repositories[${index}] must be an object.`);
    }
    const repository = raw as Record<string, unknown>;
    const name = requireText(repository.name, `repositories[${index}].name`);
    if (names.has(name)) throw new TypeError(`Duplicate cached repository: ${name}.`);
    names.add(name);
    const url = requireText(repository.url, `${name}.url`);
    if (owner === "JasonStys" && url !== `${GITHUB_REPOSITORY_PREFIX}${name}`) {
      throw new TypeError(`${name}.url must use the expected GitHub repository URL.`);
    }
    return Object.freeze({
      name,
      description: requireText(repository.description, `${name}.description`),
      url,
      primaryLanguage: requireText(repository.primaryLanguage, `${name}.primaryLanguage`),
      languages: requireStringArray(repository.languages, `${name}.languages`),
      topics: requireStringArray(repository.topics, `${name}.topics`),
      pushedAt: requireText(repository.pushedAt, `${name}.pushedAt`),
    });
  });
  return Object.freeze({ schemaVersion: 1, owner, fetchedAt, source, repositories });
}

export function buildCatalog(
  cache: RepositoryCache,
  curation: readonly ProjectCuration[],
): readonly Project[] {
  const repositories = new Map(
    cache.repositories.map((repository) => [repository.name, repository]),
  );
  const curationNames = new Set<string>();
  const merged = curation.map((entry) => {
    if (curationNames.has(entry.name))
      throw new TypeError(`Duplicate curation entry: ${entry.name}.`);
    curationNames.add(entry.name);
    const repository = repositories.get(entry.name);
    if (!repository) throw new TypeError(`Missing cached metadata for ${entry.name}.`);
    if (entry.featuredOrder !== undefined && entry.caseStudySlug === undefined) {
      throw new TypeError(`Featured project ${entry.name} requires a case study slug.`);
    }
    return Object.freeze({ ...repository, ...entry });
  });
  const orders = merged
    .map((project) => project.featuredOrder)
    .filter((order): order is number => order !== undefined);
  if (new Set(orders).size !== orders.length)
    throw new TypeError("Featured order values must be unique.");
  return Object.freeze(
    merged.sort(
      (left, right) =>
        (left.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
          (right.featuredOrder ?? Number.MAX_SAFE_INTEGER) || left.name.localeCompare(right.name),
    ),
  );
}

export function listFacetValues(
  catalog: readonly Project[],
  facet: SearchFacet,
): readonly string[] {
  const values = new Set<string>();
  for (const project of catalog) {
    const projectValues = facet === "maturity" ? [project.maturity] : project[facet];
    projectValues.forEach((value) => values.add(value));
  }
  return [...values].sort((left, right) => left.localeCompare(right));
}

export const repositoryCache = validateCache(rawRepositoryCache);
export const projects = buildCatalog(repositoryCache, projectCuration);
export const featuredProjects = projects.filter((project) => project.featuredOrder !== undefined);
