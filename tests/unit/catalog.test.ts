/**
 * @file Verifies cache validation, deterministic catalog merging, featured order, and facets.
 * Functions: Vitest catalog contract cases.
 * Variables: repositoryCache, projectCuration, and small invalid fixtures.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import {
  buildCatalog,
  featuredProjects,
  listFacetValues,
  projects,
  repositoryCache,
  validateCache,
} from "@/lib/catalog";
import { projectCuration } from "@/data/project-curation";

describe("portfolio catalog", () => {
  it("merges every curated project with a unique cached repository", () => {
    expect(projects).toHaveLength(projectCuration.length);
    expect(new Set(projects.map((project) => project.name)).size).toBe(projects.length);
    expect(projects.every((project) => project.url.endsWith(project.name))).toBe(true);
  });

  it("keeps six case studies in explicit order", () => {
    expect(featuredProjects.map((project) => project.featuredOrder)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(featuredProjects.every((project) => project.caseStudySlug)).toBe(true);
  });

  it("derives sorted, deduplicated facets", () => {
    const languages = listFacetValues(projects, "languages");
    expect(languages).toContain("C++");
    expect(languages).toContain("Rust");
    expect(languages).toEqual([...languages].sort((left, right) => left.localeCompare(right)));
    expect(listFacetValues(projects, "maturity")).toEqual(["validated"]);
  });

  it("rejects malformed cache envelopes", () => {
    expect(() => validateCache(null)).toThrow(/object/);
    expect(() => validateCache([])).toThrow(/object/);
    expect(() => validateCache({ schemaVersion: 2 })).toThrow(/schema/);
    expect(() =>
      validateCache({
        schemaVersion: 1,
        owner: "JasonStys",
        fetchedAt: "not-a-date",
        source: "GitHub REST API",
        repositories: [],
      }),
    ).toThrow(/ISO timestamp/);
    expect(() =>
      validateCache({
        schemaVersion: 1,
        owner: "JasonStys",
        fetchedAt: "2026-09-19T00:00:00.000Z",
        source: "GitHub REST API",
        repositories: [],
      }),
    ).toThrow(/non-empty array/);
  });

  it("rejects invalid or duplicate cached repositories", () => {
    const repository = repositoryCache.repositories[0];
    const envelope = {
      schemaVersion: 1,
      owner: "JasonStys",
      fetchedAt: "2026-09-19T00:00:00.000Z",
      source: "GitHub REST API",
    } as const;

    expect(() => validateCache({ ...envelope, repositories: [null] })).toThrow(/must be an object/);
    expect(() => validateCache({ ...envelope, repositories: [repository, repository] })).toThrow(
      /Duplicate cached repository/,
    );
    expect(() =>
      validateCache({
        ...envelope,
        repositories: [{ ...repository, url: "https://example.com/wrong" }],
      }),
    ).toThrow(/expected GitHub repository URL/);
    expect(() =>
      validateCache({
        ...envelope,
        repositories: [{ ...repository, languages: ["TypeScript", "TypeScript"] }],
      }),
    ).toThrow(/must not contain duplicates/);
    expect(() =>
      validateCache({ ...envelope, repositories: [{ ...repository, topics: [] }] }),
    ).toThrow(/non-empty string array/);

    expect(
      validateCache({
        ...envelope,
        owner: "ExampleOwner",
        repositories: [{ ...repository, url: "https://example.com/repository" }],
      }).repositories[0]?.url,
    ).toBe("https://example.com/repository");
  });

  it("rejects inconsistent curation metadata", () => {
    expect(() => buildCatalog(repositoryCache, [...projectCuration, projectCuration[0]])).toThrow(
      /Duplicate/,
    );
    expect(() =>
      buildCatalog(repositoryCache, [{ ...projectCuration[0], name: "missing" }]),
    ).toThrow(/Missing/);
    expect(() =>
      buildCatalog(repositoryCache, [
        {
          name: projectCuration[0].name,
          roles: projectCuration[0].roles,
          domains: projectCuration[0].domains,
          maturity: projectCuration[0].maturity,
          outcome: projectCuration[0].outcome,
          featuredOrder: 1,
        },
      ]),
    ).toThrow(/requires a case study slug/);
    expect(() =>
      buildCatalog(repositoryCache, [
        projectCuration[0],
        { ...projectCuration[1], featuredOrder: projectCuration[0].featuredOrder },
      ]),
    ).toThrow(/must be unique/);
  });
});
