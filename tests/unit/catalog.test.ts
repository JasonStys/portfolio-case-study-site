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
import portfolioPriority from "@/data/portfolio-priority.json";
import { spaceSystemsCuration, spaceHighlightNames } from "@/data/space-systems";
import { droneSystemsCuration, droneHighlightNames } from "@/data/drone-systems";
import { buildSearchIndex, searchProjectIds } from "@/lib/search";
import { catalogRevision } from "@/lib/catalog-revision";

describe("portfolio catalog", () => {
  it("binds search cache revisions to editorial content, order and metadata", () => {
    const revision = catalogRevision(projects, repositoryCache.fetchedAt);
    expect(revision).toMatch(/^[a-f0-9]{64}$/u);
    expect(catalogRevision(structuredClone(projects), repositoryCache.fetchedAt)).toBe(revision);
    const edited = projects.map((project) =>
      project.name === "business-knowledge-workbench"
        ? { ...project, outcome: project.outcome + " Reviewed standards update." }
        : project,
    );
    expect(catalogRevision(edited, repositoryCache.fetchedAt)).not.toBe(revision);
    expect(catalogRevision([...projects].reverse(), repositoryCache.fetchedAt)).not.toBe(revision);
    expect(catalogRevision(projects, "2026-10-20T00:00:00.000Z")).not.toBe(revision);
  });

  it("merges every curated project with a unique cached repository", () => {
    expect(projects).toHaveLength(projectCuration.length);
    expect(new Set(projects.map((project) => project.name)).size).toBe(projects.length);
    expect(projects.every((project) => project.url.endsWith(project.name))).toBe(true);
  });

  it("keeps six case studies in explicit order", () => {
    expect(featuredProjects.map((project) => project.featuredOrder)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(featuredProjects.every((project) => project.caseStudySlug)).toBe(true);
  });

  it("keeps Code Flow first and makes its reviewed source evidence searchable", () => {
    expect(projects[0]?.name).toBe("code-flow-studio");
    expect(projects[0]?.outcome).toContain("12 isolated CLI adapters");
    expect(projects[0]?.outcome).toContain("review-only unused-code candidates");
    const index = buildSearchIndex(projects, "code-flow-evidence");
    for (const query of ["source-bound diagnostics", "coverage unused", "private revision"]) {
      expect(searchProjectIds(index, query)).toContain("code-flow-studio");
    }
  });

  it("covers all 67 repositories in canonical priority order", () => {
    expect(projects).toHaveLength(67);
    expect(repositoryCache.repositories).toHaveLength(67);
    expect(projects.map((project) => project.name)).toEqual(portfolioPriority);
    expect(projects.map((project) => project.portfolioOrder)).toEqual(
      Array.from({ length: 67 }, (_, index) => index + 1),
    );
    expect(featuredProjects.map((project) => project.name)).toEqual(portfolioPriority.slice(0, 6));
    expect(listFacetValues(projects, "roles")).toContain("Security engineer");
    expect(listFacetValues(projects, "roles")).toContain("DevOps engineer");
  });

  it("includes exactly the 14 reviewed space/energy projects with four inspectable highlights", () => {
    const names = spaceSystemsCuration.map((project) => project.name);
    expect(names).toHaveLength(14);
    expect(new Set(names).size).toBe(14);
    expect(portfolioPriority.slice(6, 20)).toEqual(names);
    expect(spaceHighlightNames).toHaveLength(4);
    for (const name of spaceHighlightNames) {
      const project = projects.find((project) => project.name === name);
      expect(project?.caseStudySlug).toBe(name);
      expect(project?.domains).toContain("Space systems");
    }
    const index = buildSearchIndex(projects, "reviewed-test");
    expect(searchProjectIds(index, "", { domain: "Space systems" })).toEqual(names);
    expect(searchProjectIds(index, "watchdog", { domain: "Space systems" })).toContain(
      "spacecraft-flight-software-testbed",
    );
    expect(projects.filter((project) => project.caseStudySlug)).toHaveLength(15);
  });

  it("includes all seven drone projects in reviewed order with four independent-evidence highlights", () => {
    const names = droneSystemsCuration.map((project) => project.name);
    expect(names).toHaveLength(7);
    expect(new Set(names).size).toBe(7);
    expect(portfolioPriority.slice(20, 27)).toEqual(names);
    expect(droneHighlightNames).toHaveLength(4);
    for (const name of droneHighlightNames) expect(names).toContain(name);
    const index = buildSearchIndex(projects, "drone-evidence");
    expect(searchProjectIds(index, "", { domain: "Drone safety" })).toEqual(names);
    expect(searchProjectIds(index, "PX4 simulator")).toContain("drone-operations-console");
    expect(searchProjectIds(index, "privacy masks")).toContain("drone-video-privacy-studio");
    expect(searchProjectIds(index, "serialized component")).toContain(
      "drone-maintenance-readiness-studio",
    );
  });

  it("rejects duplicate, omitted, unknown and contradictory editorial priorities", () => {
    expect(() =>
      buildCatalog(repositoryCache, projectCuration, [...portfolioPriority, "code-flow-studio"]),
    ).toThrow(/must be unique/);
    expect(() =>
      buildCatalog(repositoryCache, projectCuration, portfolioPriority.slice(1)),
    ).toThrow(/cover exactly/);
    expect(() =>
      buildCatalog(repositoryCache, projectCuration, ["unknown", ...portfolioPriority.slice(1)]),
    ).toThrow(/cover exactly/);
    expect(() =>
      buildCatalog(repositoryCache, projectCuration, [...portfolioPriority].reverse()),
    ).toThrow(/must agree/);
    const references = projectCuration.slice(6).map((entry) => ({ ...entry }));
    const reversed = references.map((entry) => entry.name).reverse();
    expect(
      buildCatalog(repositoryCache, references, reversed).map((project) => project.name),
    ).toEqual(reversed);
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
