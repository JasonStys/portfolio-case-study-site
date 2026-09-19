/**
 * @file Defines the validated repository, curation, search, and evidence domain types.
 * Functions: none; exported types describe immutable build-time data contracts.
 * Variables: ProjectMaturity and SearchFacet union domains.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */

export type ProjectMaturity = "validated" | "reference" | "experimental";

export type CachedRepository = Readonly<{
  name: string;
  description: string;
  url: string;
  primaryLanguage: string;
  languages: readonly string[];
  topics: readonly string[];
  pushedAt: string;
}>;

export type RepositoryCache = Readonly<{
  schemaVersion: 1;
  owner: string;
  fetchedAt: string;
  source: string;
  repositories: readonly CachedRepository[];
}>;

export type ProjectCuration = Readonly<{
  name: string;
  roles: readonly string[];
  domains: readonly string[];
  maturity: ProjectMaturity;
  outcome: string;
  featuredOrder?: number;
  caseStudySlug?: string;
}>;

export type Project = CachedRepository & ProjectCuration;

export type SearchFacet = "roles" | "languages" | "domains" | "maturity";

export type SerializedSearchIndex = Readonly<{
  schemaVersion: 1;
  generatedFrom: string;
  projectOrder: readonly string[];
  terms: Readonly<Record<string, readonly string[]>>;
  facets: Readonly<Record<SearchFacet, Readonly<Record<string, readonly string[]>>>>;
}>;

export type ProjectFilters = Readonly<{
  role?: string;
  language?: string;
  domain?: string;
  maturity?: ProjectMaturity;
}>;
