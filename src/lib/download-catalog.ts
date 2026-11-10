/**
 * @file Loads only the coordinator's final public download index after all release checks pass.
 * Functions: validateDownloads invocation; variables: downloadManifest.
 * Line locations: docs/CODE_INDEX.md after integration. This draft intentionally ships no fake index.
 */
import raw from "@/data/project-downloads.json";
import { validateDownloads } from "@/lib/downloads";

export const downloadManifest = validateDownloads(raw);
