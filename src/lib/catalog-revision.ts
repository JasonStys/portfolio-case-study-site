/**
 * @file Derives build-only search cache identities from the complete reviewed catalog and metadata timestamp.
 * Functions: catalogRevision; no Node crypto is imported by browser code.
 * Variables: catalog, metadataTimestamp and SEARCH_TOKENIZATION_REVISION bind format and semantics.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { createHash } from "node:crypto";
import type { Project } from "@/lib/types";
import { SEARCH_TOKENIZATION_REVISION } from "@/lib/search";

/** Bind editorial content, order, metadata and tokenizer semantics; not an approval signature. */
export function catalogRevision(catalog: readonly Project[], metadataTimestamp: string): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        schemaVersion: 2,
        tokenizationRevision: SEARCH_TOKENIZATION_REVISION,
        metadataTimestamp,
        catalog,
      }),
    )
    .digest("hex");
}
