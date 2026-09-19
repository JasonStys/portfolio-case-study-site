/**
 * @file Verifies Unicode tokenization, deterministic postings, intersections, facets, and empty results.
 * Functions: Vitest search-index cases.
 * Variables: production-derived search index.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import { projects, repositoryCache } from "@/lib/catalog";
import { buildSearchIndex, searchProjectIds, tokenize } from "@/lib/search";

const index = buildSearchIndex(projects, repositoryCache.fetchedAt);

describe("project search", () => {
  it("normalizes, deduplicates, and preserves language punctuation", () => {
    expect(tokenize("C++ C# Résumé résumé")).toEqual(["c++", "c#", "résumé"]);
  });

  it("finds text terms with AND semantics in catalog order", () => {
    expect(searchProjectIds(index, "deterministic replays")).toContain("forge2d-engine");
    expect(searchProjectIds(index, "definitely-not-present")).toEqual([]);
  });

  it("intersects exact role, language, domain, and maturity facets", () => {
    expect(
      searchProjectIds(index, "", {
        language: "Rust",
        domain: "Cloud computing",
        maturity: "validated",
      }),
    ).toEqual(["cloud-job-orchestrator"]);
    expect(searchProjectIds(index, "", { role: "Game programmer" })).toEqual([
      "forge2d-engine",
      "unity-tactical-ai-sandbox",
    ]);
  });

  it("serializes stable, duplicate-free postings", () => {
    expect(index.schemaVersion).toBe(1);
    expect(index.projectOrder).toHaveLength(projects.length);
    for (const postings of Object.values(index.terms))
      expect(new Set(postings).size).toBe(postings.length);
  });
});
