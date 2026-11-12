/**
 * @file Binds the actual approved Word, canonical pair and report bytes to the own public delivery projection.
 * Functions: actual file hash/Git-blob and pair-context tests; variables: fixed repository root and validated delivery.
 * Line locations: see docs/CODE_INDEX.md. Reads source publications only, never installed apps or profiles.
 */
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readRegular } from "../../desktop/files.cjs";
import { portfolioDeliveryManifest } from "../../src/lib/portfolio-delivery-catalog";

const root = fileURLToPath(new URL("../../", import.meta.url));
const delivery = portfolioDeliveryManifest.delivery;
if (!delivery)
  throw new Error("The published portfolio requires its actual complete delivery record.");
const guide = delivery.guide;
const files = [
  {
    path: guide.documentPath,
    sha256: guide.documentSha256,
    gitBlob: guide.documentGitBlob,
    bytes: guide.documentByteSize,
  },
  {
    path: guide.manifestPath,
    sha256: guide.manifestSha256,
    gitBlob: guide.manifestGitBlob,
    bytes: guide.manifestByteSize,
  },
  {
    path: guide.validationReportPath,
    sha256: guide.validationReportSha256,
    gitBlob: guide.validationReportGitBlob,
    bytes: guide.validationReportByteSize,
  },
];

describe("actual own publication identities", () => {
  it.each(files)(
    "preserves the actual source file $path and its published Git identity",
    (file) => {
      const bytes = readRegular(path.join(root, file.path), 8 * 1024 * 1024);
      expect(bytes.length).toBe(file.bytes);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(file.sha256);
      expect(
        createHash("sha1")
          .update(Buffer.from(`blob ${bytes.length}\0`))
          .update(bytes)
          .digest("hex"),
      ).toBe(file.gitBlob);
    },
  );
  it("keeps the real canonical guide pair bound to its documented runtime and Word", () => {
    const bytes = readRegular(path.join(root, guide.manifestPath), 1024 * 1024);
    const pair: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    expect(pair).toMatchObject({
      schema: 1,
      repository: "portfolio-case-study-site",
      runtimeVersion: delivery.version,
      runtimeSource: delivery.runtimeSource,
      document: path.posix.basename(guide.documentPath),
      sha256: guide.documentSha256,
      visualReview: "approved",
      review: {
        pages: 4,
        renderedPageReview: "passed",
        ooxmlValidation: "passed",
        privacyAndScope: "passed",
      },
    });
    expect(bytes.includes(13)).toBe(false);
    expect(guide.publicationSource).not.toBe(delivery.runtimeSource);
  });
});
