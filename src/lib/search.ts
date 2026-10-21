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

function addPosting(index: Map<string, Set<number>>, key: string, projectId: number): void {
  const postings = index.get(key) ?? new Set<number>();
  postings.add(projectId);
  index.set(key, postings);
}

function serializeMap(
  index: Map<string, Set<number>>,
): Readonly<Record<string, readonly number[]>> {
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
  const terms = new Map<string, Set<number>>();
  const facets = Object.fromEntries(
    facetKeys.map((facet) => [facet, new Map<string, Set<number>>()]),
  ) as Record<SearchFacet, Map<string, Set<number>>>;

  for (const [position, project] of catalog.entries()) {
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
    for (const token of tokenize(searchable)) addPosting(terms, token, position);
    for (const facet of facetKeys) {
      const values = facet === "maturity" ? [project.maturity] : project[facet];
      for (const value of values)
        addPosting(facets[facet], value.toLocaleLowerCase("en-US"), position);
    }
  }

  return Object.freeze({
    schemaVersion: 2,
    generatedFrom,
    projectOrder: catalog.map((project) => project.name),
    terms: serializeMap(terms),
    facets: Object.fromEntries(
      facetKeys.map((facet) => [facet, serializeMap(facets[facet])]),
    ) as SerializedSearchIndex["facets"],
  });
}

function intersectOrdered(
  current: readonly number[],
  allowed: ReadonlySet<number>,
): readonly number[] {
  return current.filter((projectId) => allowed.has(projectId));
}

export function searchProjectIds(
  index: SerializedSearchIndex,
  query: string,
  filters: ProjectFilters = {},
): readonly string[] {
  let matches: readonly number[] = index.projectOrder.map((_, position) => position);
  for (const token of tokenize(query)) {
    const postings = Object.hasOwn(index.terms, token) ? index.terms[token] : [];
    matches = intersectOrdered(matches, new Set(postings));
    if (matches.length === 0) return [];
  }
  const selections: readonly [SearchFacet, string | undefined][] = [
    ["roles", filters.role],
    ["languages", filters.language],
    ["domains", filters.domain],
    ["maturity", filters.maturity],
  ];
  for (const [facet, selection] of selections) {
    if (!selection) continue;
    const key = selection.toLocaleLowerCase("en-US");
    const allowed = Object.hasOwn(index.facets[facet], key) ? index.facets[facet][key] : [];
    matches = intersectOrdered(matches, new Set(allowed));
  }
  return matches.map((position) => {
    const name = index.projectOrder[position];
    if (name === undefined) throw new Error("Search posting is outside the project dictionary");
    return name;
  });
}
