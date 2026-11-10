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

  it("ignores terminal sentence dots while retaining language and version identities", () => {
    expect(tokenize("drafts. drafts... .NET .NET. v0.4.0 v0.4.0. C++. C#. . .. ...")).toEqual([
      "drafts",
      ".net",
      "v0.4.0",
      "c++",
      "c#",
    ]);
    expect(tokenize("Ｎｏｄｅ.js. Café. café")).toEqual(["node.js", "café"]);
  });

  it("retrieves an isolated sentence-final word with or without query punctuation", () => {
    const first = projects[0];
    if (!first) throw new Error("The reviewed catalog must contain a fixture source shape.");
    const fixture = {
      ...first,
      name: "punctuation-fixture",
      description: "Independent example",
      outcome: "Inspect cached drafts.",
      primaryLanguage: "TypeScript",
      languages: ["TypeScript"],
      topics: ["fixture"],
      roles: ["Reviewer"],
      domains: ["Tools"],
    };
    const isolated = buildSearchIndex([fixture], "punctuation-contract");
    expect(searchProjectIds(isolated, "cached drafts")).toEqual(["punctuation-fixture"]);
    expect(searchProjectIds(isolated, "cached drafts.")).toEqual(["punctuation-fixture"]);
    expect(searchProjectIds(index, "matching drafts")).toContain("code-flow-studio");
  });

  it("finds text terms with AND semantics in catalog order", () => {
    expect(searchProjectIds(index, "deterministic collision")).toContain("forge2d-engine");
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
    expect(index.schemaVersion).toBe(2);
    expect(index.projectOrder).toHaveLength(projects.length);
    for (const postings of Object.values(index.terms)) {
      expect(new Set(postings).size).toBe(postings.length);
      expect(
        postings.every(
          (position) => Number.isInteger(position) && position >= 0 && position < projects.length,
        ),
      ).toBe(true);
    }
  });

  it("treats inherited object names as missing terms and facets", () => {
    expect(searchProjectIds(index, "constructor")).toEqual([]);
    expect(searchProjectIds(index, "", { domain: "constructor" })).toEqual([]);
    expect(searchProjectIds(index, "prototype")).toEqual([]);
  });

  it("retains the byte budget with integer dictionary references", () => {
    const bytes = new TextEncoder().encode(JSON.stringify(index)).length;
    expect(bytes).toBeLessThan(100000);
    for (const project of projects)
      expect(searchProjectIds(index, project.name)).toContain(project.name);
  });
});
