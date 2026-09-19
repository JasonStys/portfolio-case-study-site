/**
 * @file Builds repository-base-aware internal URLs and absolute canonical URLs.
 * Functions: withBase, absoluteUrl.
 * Variables: normalized base and configured site origin.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */

const BASE_PATH = "/portfolio-case-study-site/";
const SITE_ORIGIN = "https://jasonstys.github.io";

export function withBase(pathname: string): string {
  const suffix = pathname.replace(/^\/+/, "");
  return suffix.length === 0 ? BASE_PATH : `${BASE_PATH}${suffix}`;
}

export function absoluteUrl(pathname: string): string {
  return new URL(withBase(pathname), SITE_ORIGIN).toString();
}
