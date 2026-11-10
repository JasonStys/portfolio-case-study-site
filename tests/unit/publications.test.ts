/**
 * @file Tests complete public publication scope, immutable identities and hostile metadata rejection.
 * Functions: mutated and independent invalid-input cases; no network or Office execution.
 * Variables: fixed portfolio order, real publication snapshot and negative metadata fixtures.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import raw from "@/data/project-publications.json";
import priority from "@/data/portfolio-priority.json";
import { publicationFor, publicationLinks, publicationManifest, validatePublications } from "@/lib/publications";

function mutated(change: (value: any) => void): unknown {
  const copy = structuredClone(raw);
  change(copy);
  return copy;
}

describe("reviewed documentation catalog", () => {
  it("covers all67 projects with91Word editions and24workbooks", () => {
    expect(publicationManifest.repositories.map((row) => row.name)).toEqual(priority);
    const files = publicationManifest.repositories.flatMap((row) => row.documents);
    expect(files.filter((file) => file.filename.endsWith(".docx"))).toHaveLength(91);
    expect(files.filter((file) => file.filename.endsWith(".xlsx"))).toHaveLength(24);
    expect(Object.isFrozen(publicationManifest.repositories[0]?.documents[0])).toBe(true);
  });
  it("constructs only repository-and-commit confined public links", () => {
    for (const row of publicationManifest.repositories) {
      const links = publicationLinks(publicationFor(row.name));
      const base = `https://github.com/JasonStys/${row.name}`;
      expect(links.handbook).toBe(`${base}/blob/${row.publishedCommit}/docs/handbook.md`);
      expect(links.manifest).toBe(`${base}/blob/${row.publishedCommit}/docs/reports/publications.json`);
      expect(links.report).toBe(`${base}/blob/${row.publishedCommit}/docs/reports/documentation-refresh-2026-11-09.md`);
      for (const file of links.files) expect(file.url).toBe(`${base}/raw/${row.publishedCommit}/docs/reports/${file.filename}`);
    }
    expect(() => publicationFor("not-a-portfolio-project")).toThrow();
  });
  const invalid: [string, (value: any) => void][] = [
    ["private extra envelope metadata", (v) => { v.localAccount = "private"; }],
    ["unsupported schema", (v) => { v.schemaVersion = 2; }],
    ["non-object envelope", (v) => { v.repositories = null; }],
    ["impossible date", (v) => { v.collectedAt = "2026-02-30T00:00:00Z"; }],
    ["local-time date", (v) => { v.collectedAt = "2026-11-10T00:00:00-08:00"; }],
    ["missing repository", (v) => { v.repositories.pop(); }],
    ["duplicate/out-of-order project", (v) => { v.repositories[1] = v.repositories[0]; }],
    ["foreign repository", (v) => { v.repositories[0].name = "other-owner/repo"; }],
    ["private extra row metadata", (v) => { v.repositories[0].token = "private"; }],
    ["null row", (v) => { v.repositories[0] = null; }],
    ["mutable revision", (v) => { v.repositories[0].publishedCommit = "main"; }],
    ["invalid documented revision", (v) => { v.repositories[0].sourceBaseline = "A".repeat(40); }],
    ["missing evidence workbook", (v) => { v.repositories[0].documents.pop(); }],
    ["unexpected stored URL", (v) => { v.repositories[0].documents[0].url = "https://example.invalid/private"; }],
    ["duplicate publication", (v) => { v.repositories[0].documents[1] = v.repositories[0].documents[0]; }],
    ["filename traversal", (v) => { v.repositories[0].documents[0].filename = "../private.docx"; }],
    ["unknown executable file", (v) => { v.repositories[0].documents[0].filename = "installer.exe"; }],
    ["invalid digest", (v) => { v.repositories[0].documents[0].sha256 = "not-a-digest"; }],
    ["zero bytes", (v) => { v.repositories[0].documents[0].bytes = 0; }],
    ["boolean bytes", (v) => { v.repositories[0].documents[0].bytes = true; }],
    ["oversized file", (v) => { v.repositories[0].documents[0].bytes = 20 * 1024 * 1024 + 1; }],
    ["fractional page count", (v) => { v.repositories[0].documents[0].pages = 1.5; }],
    ["unreviewed pages", (v) => { v.repositories[0].documents[0].pages = 0; }],
    ["invented workbook pagination", (v) => { v.repositories[0].documents.find((d: any) => d.filename.endsWith(".xlsx")).pages = 3; }],
  ];
  it.each(invalid)("rejects %s", (_name, change) => { expect(() => validatePublications(mutated(change))).toThrow(); });
  it.each([null, [], "data", 1])("rejects non-object metadata %s", (value) => { expect(() => validatePublications(value)).toThrow(); });
});
