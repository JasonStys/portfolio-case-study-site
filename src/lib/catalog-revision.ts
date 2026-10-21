/**
 * @file Derives build-only search cache identities from the complete reviewed catalog and metadata timestamp.
 * Functions: catalogRevision; no Node crypto is imported by browser code.
 * Variables: catalog and metadataTimestamp parameters; schemaVersion binds the index format.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { createHash } from "node:crypto";
import type { Project } from "@/lib/types";

/** Invalidate cached search after editorial, metadata or ordering changes; not an approval signature. */
export function catalogRevision(catalog: readonly Project[], metadataTimestamp: string): string {
  return createHash("sha256")
    .update(JSON.stringify({ schemaVersion: 2, metadataTimestamp, catalog }))
    .digest("hex");
}
