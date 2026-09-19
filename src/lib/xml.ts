/**
 * @file Escapes authored text for XML feeds and sitemap documents.
 * Functions: escapeXml.
 * Variables: replacement table embedded in the function.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
