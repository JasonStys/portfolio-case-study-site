/**
 * @file Emits the complete public download evidence without repeating large digests in HTML.
 * Functions: GET; variables: immutable source-bound manifest and static prerender setting.
 * Line locations: docs/CODE_INDEX.md after integration. No user, local acquisition or credential data.
 */
import { applicationManifest } from "@/lib/application-catalog";

export const prerender = true;
export function GET(): Response {
  return new Response(JSON.stringify(applicationManifest), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
