/**
 * @file Tests complete publication scope, immutable file identities and hostile metadata rejection.
 * Functions: changed, rows, documents; independent negative metadata cases and fixed inventory oracles.
 * Variables: actual publication snapshot and 67-project order; no network or Office execution.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import raw from "@/data/project-publications.json";
import priority from "@/data/portfolio-priority.json";
import {
  publicationFor,
  publicationLinks,
  publicationManifest,
  validatePublications,
} from "@/lib/publications";

type RecordValue = Record<string, unknown>;
type Mutation = (row: RecordValue, envelope: RecordValue, file: RecordValue) => void;
function rows(envelope: RecordValue): RecordValue[] {
  return envelope.repositories as RecordValue[];
}
function documents(row: RecordValue): RecordValue[] {
  return row.documents as RecordValue[];
}
function changed(change: Mutation): unknown {
  const copy = structuredClone(raw) as unknown as RecordValue;
  const first = rows(copy)[0];
  if (!first) throw new Error("Independent fixture requires a real project.");
  const file = documents(first)[0];
  if (!file) throw new Error("Independent fixture requires a real document.");
  change(first, copy, file);
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
      expect(links.manifest).toBe(
        `${base}/blob/${row.publishedCommit}/docs/reports/publications.json`,
      );
      expect(links.report).toBe(
        `${base}/blob/${row.publishedCommit}/docs/reports/documentation-refresh-2026-11-09.md`,
      );
      for (const file of links.files)
        expect(file.url).toBe(`${base}/raw/${row.publishedCommit}/docs/reports/${file.filename}`);
    }
    expect(() => publicationFor("not-a-portfolio-project")).toThrow();
  });
  const invalid: [string, Mutation][] = [
    [
      "private envelope metadata",
      (_r, e) => {
        e.localAccount = "private";
      },
    ],
    [
      "unsupported schema",
      (_r, e) => {
        e.schemaVersion = 2;
      },
    ],
    [
      "non-array repository inventory",
      (_r, e) => {
        e.repositories = null;
      },
    ],
    [
      "impossible UTC date",
      (_r, e) => {
        e.collectedAt = "2026-02-30T00:00:00Z";
      },
    ],
    [
      "local-time date",
      (_r, e) => {
        e.collectedAt = "2026-11-10T00:00:00-08:00";
      },
    ],
    [
      "missing project",
      (_r, e) => {
        rows(e).pop();
      },
    ],
    [
      "duplicate/out-of-order project",
      (r, e) => {
        rows(e)[1] = r;
      },
    ],
    [
      "foreign project",
      (r) => {
        r.name = "other-owner/repo";
      },
    ],
    [
      "private extra row metadata",
      (r) => {
        r.token = "private";
      },
    ],
    [
      "non-object row",
      (_r, e) => {
        e.repositories = [null, ...rows(e).slice(1)];
      },
    ],
    [
      "mutable published revision",
      (r) => {
        r.publishedCommit = "main";
      },
    ],
    [
      "invalid documented revision",
      (r) => {
        r.sourceBaseline = "A".repeat(40);
      },
    ],
    [
      "missing evidence workbook",
      (r) => {
        documents(r).pop();
      },
    ],
    [
      "unexpected stored URL",
      (_r, _e, f) => {
        f.url = "https://example.invalid/private";
      },
    ],
    [
      "duplicate publication",
      (r, _e, f) => {
        documents(r)[1] = f;
      },
    ],
    [
      "filename traversal",
      (_r, _e, f) => {
        f.filename = "../private.docx";
      },
    ],
    [
      "executable document",
      (_r, _e, f) => {
        f.filename = "installer.exe";
      },
    ],
    [
      "invalid digest",
      (_r, _e, f) => {
        f.sha256 = "not-a-digest";
      },
    ],
    [
      "empty file",
      (_r, _e, f) => {
        f.bytes = 0;
      },
    ],
    [
      "boolean byte count",
      (_r, _e, f) => {
        f.bytes = true;
      },
    ],
    [
      "oversized file",
      (_r, _e, f) => {
        f.bytes = 20 * 1024 * 1024 + 1;
      },
    ],
    [
      "fractional page count",
      (_r, _e, f) => {
        f.pages = 1.5;
      },
    ],
    [
      "unreviewed page count",
      (_r, _e, f) => {
        f.pages = 0;
      },
    ],
    [
      "invented workbook pagination",
      (r) => {
        const workbook = documents(r).find((d) => d.filename === "validation-evidence.xlsx");
        if (!workbook) throw new Error("Fixture needs a workbook.");
        workbook.pages = 3;
      },
    ],
  ];
  it.each(invalid)("rejects %s", (_name, change) => {
    expect(() => validatePublications(changed(change))).toThrow();
  });
  it.each([null, [], "data", 1])("rejects non-object metadata %s", (value) => {
    expect(() => validatePublications(value)).toThrow();
  });
});
