/**
 * @file Emits the unchanged dated release manifest; no identities are relabeled.
 * Functions: GET; variables: downloadManifest. Line locations: docs/CODE_INDEX.md.
 */
import { downloadManifest } from "@/lib/download-catalog";
export const prerender = true;
export function GET(): Response {
  return new Response(JSON.stringify(downloadManifest), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
