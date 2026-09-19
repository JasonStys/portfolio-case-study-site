/**
 * @file Builds and queries a deterministic inverted index for project text and exact facets.
 * Functions: tokenize, buildSearchIndex, searchProjectIds, intersectOrdered, addPosting.
 * Variables: TOKEN_PATTERN and facetKeys.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import type { Project, ProjectFilters, SearchFacet, SerializedSearchIndex } from "@/lib/types";

const TOKEN_PATTERN = /[\p{L}\p{N}+#.]+/gu;
const facetKeys = [
  "roles",
  "languages",
  "domains",
  "maturity",
] as const satisfies readonly SearchFacet[];

export function tokenize(value: string): readonly string[] {
  const normalized = value.normalize("NFKC").toLocaleLowerCase("en-US");
  return [...new Set(normalized.match(TOKEN_PATTERN) ?? [])];
}

function addPosting(index: Map<string, Set<string>>, key: string, projectId: string): void {
  const postings = index.get(key) ?? new Set<string>();
  postings.add(projectId);
  index.set(key, postings);
}

function serializeMap(
  index: Map<string, Set<string>>,
): Readonly<Record<string, readonly string[]>> {
  return Object.fromEntries(
    [...index.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, values]) => [key, [...values]]),
  );
}

export function buildSearchIndex(
  catalog: readonly Project[],
  generatedFrom: string,
): SerializedSearchIndex {
  const terms = new Map<string, Set<string>>();
  const facets = Object.fromEntries(
    facetKeys.map((facet) => [facet, new Map<string, Set<string>>()]),
  ) as Record<SearchFacet, Map<string, Set<string>>>;

  for (const project of catalog) {
    const searchable = [
      project.name,
      project.description,
      project.outcome,
      project.primaryLanguage,
      ...project.languages,
      ...project.roles,
      ...project.domains,
      ...project.topics,
    ].join(" ");
    for (const token of tokenize(searchable)) addPosting(terms, token, project.name);
    for (const facet of facetKeys) {
      const values = facet === "maturity" ? [project.maturity] : project[facet];
      for (const value of values)
        addPosting(facets[facet], value.toLocaleLowerCase("en-US"), project.name);
    }
  }

  return Object.freeze({
    schemaVersion: 1,
    generatedFrom,
    projectOrder: catalog.map((project) => project.name),
    terms: serializeMap(terms),
    facets: Object.fromEntries(
      facetKeys.map((facet) => [facet, serializeMap(facets[facet])]),
    ) as SerializedSearchIndex["facets"],
  });
}

function intersectOrdered(
  current: readonly string[],
  allowed: ReadonlySet<string>,
): readonly string[] {
  return current.filter((projectId) => allowed.has(projectId));
}

export function searchProjectIds(
  index: SerializedSearchIndex,
  query: string,
  filters: ProjectFilters = {},
): readonly string[] {
  let matches: readonly string[] = index.projectOrder;
  for (const token of tokenize(query)) {
    matches = intersectOrdered(matches, new Set(index.terms[token] ?? []));
    if (matches.length === 0) return matches;
  }
  const selections: readonly [SearchFacet, string | undefined][] = [
    ["roles", filters.role],
    ["languages", filters.language],
    ["domains", filters.domain],
    ["maturity", filters.maturity],
  ];
  for (const [facet, selection] of selections) {
    if (!selection) continue;
    const allowed = index.facets[facet][selection.toLocaleLowerCase("en-US")] ?? [];
    matches = intersectOrdered(matches, new Set(allowed));
  }
  return matches;
}
