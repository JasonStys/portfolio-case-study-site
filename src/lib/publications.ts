/**
 * @file Validates the public, commit-bound documentation catalog for the 67 reviewed projects.
 * Functions: object, text, validatePublications, publicationFor and publicationLinks.
 * Variables: publicationManifest and fixed publication filenames; no live or private data access.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import raw from "@/data/project-publications.json";
import priority from "@/data/portfolio-priority.json";
import { DOWNLOAD_NAMES } from "@/lib/downloads";

const COMPLEX = new Set<string>([
  ...DOWNLOAD_NAMES,
  "industrial-edge-digital-twin",
  "firmware-release-recovery-lab",
  "versioned-product-knowledge-portal",
  "engineering-documentation-foundry",
]);
const FILENAMES = [
  "project-guide.docx",
  "validation-review.docx",
  "validation-evidence.xlsx",
] as const;
type Filename = (typeof FILENAMES)[number];
export type PublicationFile = Readonly<{
  filename: Filename;
  sha256: string;
  bytes: number;
  pages: number | null;
}>;
export type ProjectPublication = Readonly<{
  name: string;
  publishedCommit: string;
  sourceBaseline: string;
  documents: readonly PublicationFile[];
}>;
export type PublicationManifest = Readonly<{
  schemaVersion: 1;
  collectedAt: string;
  repositories: readonly ProjectPublication[];
}>;

/** Accept exactly the selected public fields, so private acquisition metadata cannot leak through. */
function object(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new TypeError("Publication object required.");
  const row = value as Record<string, unknown>;
  if (
    Object.keys(row).length !== keys.length ||
    Object.keys(row).some((key) => !keys.includes(key))
  )
    throw new TypeError("Unexpected publication fields.");
  return row;
}

/** Require literal constrained identifiers rather than accepting caller-selected paths or URLs. */
function text(value: unknown, pattern: RegExp): string {
  if (typeof value !== "string" || !pattern.test(value))
    throw new TypeError("Invalid publication identity.");
  return value;
}

/** Require every authorized project once, exact known filenames, digests and bounded file/page counts. */
export function validatePublications(value: unknown): PublicationManifest {
  const envelope = object(value, ["schemaVersion", "collectedAt", "repositories"]);
  if (envelope.schemaVersion !== 1) throw new TypeError("Unsupported publication schema.");
  const collectedAt = text(
    envelope.collectedAt,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|\+00:00)$/u,
  );
  if (
    Number.isNaN(Date.parse(collectedAt)) ||
    new Date(collectedAt).toISOString().slice(0, 19) !== collectedAt.slice(0, 19)
  )
    throw new TypeError("Invalid UTC publication date.");
  if (!Array.isArray(envelope.repositories) || envelope.repositories.length !== priority.length)
    throw new TypeError("Complete portfolio publication inventory required.");
  const repositories = envelope.repositories.map((entry, index): ProjectPublication => {
    const row = object(entry, ["name", "publishedCommit", "sourceBaseline", "documents"]);
    if (row.name !== priority[index])
      throw new TypeError("Publication order or project scope changed.");
    const name = row.name as string;
    const publishedCommit = text(row.publishedCommit, /^[a-f0-9]{40}$/u);
    const sourceBaseline = text(row.sourceBaseline, /^[a-f0-9]{40}$/u);
    const expected = COMPLEX.has(name) ? FILENAMES : FILENAMES.slice(0, 1);
    if (!Array.isArray(row.documents) || row.documents.length !== expected.length)
      throw new TypeError("Missing or extra publication files.");
    const seen = new Set<string>();
    const documents = row.documents.map((entry): PublicationFile => {
      const file = object(entry, ["filename", "sha256", "bytes", "pages"]);
      const filename = file.filename as Filename;
      if (!expected.includes(filename) || seen.has(filename))
        throw new TypeError("Unknown or duplicate publication filename.");
      seen.add(filename);
      const sha256 = text(file.sha256, /^[a-f0-9]{64}$/u);
      if (
        typeof file.bytes !== "number" ||
        !Number.isSafeInteger(file.bytes) ||
        file.bytes < 1 ||
        file.bytes > 20 * 1024 * 1024
      )
        throw new TypeError("Invalid publication byte count.");
      if (
        filename.endsWith(".docx")
          ? typeof file.pages !== "number" ||
            !Number.isSafeInteger(file.pages) ||
            file.pages < 1 ||
            file.pages > 100
          : file.pages !== null
      )
        throw new TypeError("Invalid publication page count.");
      return Object.freeze({
        filename,
        sha256,
        bytes: file.bytes,
        pages: file.pages as number | null,
      });
    });
    return Object.freeze({
      name,
      publishedCommit,
      sourceBaseline,
      documents: Object.freeze(documents),
    });
  });
  return Object.freeze({
    schemaVersion: 1,
    collectedAt,
    repositories: Object.freeze(repositories),
  });
}

export const publicationManifest = validatePublications(raw);
const byName = new Map(publicationManifest.repositories.map((row) => [row.name, row]));

/** Look up a validated project; missing documentation fails the static build. */
export function publicationFor(name: string): ProjectPublication {
  const row = byName.get(name);
  if (!row) throw new TypeError("Unknown publication project.");
  return row;
}

/** Construct repository/commit-confined links without accepting stored external URLs. */
export function publicationLinks(row: ProjectPublication) {
  const base = `https://github.com/JasonStys/${row.name}`;
  return {
    handbook: `${base}/blob/${row.publishedCommit}/docs/handbook.md`,
    manifest: `${base}/blob/${row.publishedCommit}/docs/reports/publications.json`,
    report: `${base}/blob/${row.publishedCommit}/docs/reports/documentation-refresh-2026-11-09.md`,
    files: row.documents.map((file) => ({
      ...file,
      url: `${base}/raw/${row.publishedCommit}/docs/reports/${file.filename}`,
    })),
  };
}
