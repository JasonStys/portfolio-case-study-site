/**
 * @file Tests complete current HTML evidence and targeted missing-guide/platform-scope regressions.
 * Functions: actual catalog fixtures and independent mutations; variables: complete66/108 input.
 * Line locations: see docs/CODE_INDEX.md for generated declarations.
 */
import { describe, expect, it } from "vitest";
import { applicationManifest } from "../../src/lib/application-catalog";
import { validateApplicationPages } from "../../scripts/current-application-contract.mjs";
const apps = applicationManifest.applications;
const first = apps[0],
  second = apps[1],
  firstAsset = first?.assets[0];
if (!first || !second || !firstAsset)
  throw new Error("Actual complete catalog fixtures are required.");
function html(f: { pages: Map<string, string> }) {
  const value = f.pages.get("downloads/");
  if (!value) throw new Error("Missing current HTML fixture.");
  return value;
}
function fixture() {
  const pages = new Map<string, string>();
  const count = Math.ceil(apps.length / 12);
  const route = (page: number) => (page === 1 ? "downloads/" : `downloads/page/${page}/`);
  const sitemap = Array.from(
    { length: count },
    (_, i) => `/portfolio-case-study-site/${route(i + 1)}`,
  ).join("\n");
  for (let page = 1; page <= count; page++) {
    const cards = apps
      .slice((page - 1) * 12, page * 12)
      .map(
        (app) =>
          `<li data-download-project="${app.name}"><h2>v${app.version}</h2><p>${app.requirements}</p>${[app.releaseUrl, app.runtimeSourceUrl, app.guide.documentUrl, app.guide.manifestUrl].map((url) => `<a href="${url}">Evidence</a>`).join("")}<ul>${app.assets.map((asset) => `<li data-download-platform="${asset.platform}"><a href="${asset.url}">Package</a><a href="${asset.checksumURL}">Checksum</a><code>${asset.sha256.slice(0, 12)}</code></li>`).join("")}</ul><p>${app.limitations[0]}</p></li>`,
      )
      .join("");
    const navigation = Array.from(
      { length: count },
      (_, i) =>
        `<a href="/portfolio-case-study-site/${route(i + 1)}" aria-label="Download page ${i + 1}"${i + 1 === page ? ' aria-current="page"' : ""}>Page</a>`,
    ).join("");
    pages.set(
      route(page),
      `Packages are unsigned; additional platforms are published asset metadata.<ol>${cards}</ol><nav aria-label="Download pages">${navigation}</nav>`,
    );
  }
  return { pages, sitemap };
}
describe("current download presentation evidence", () => {
  it("covers all66 apps/108 payloads and their current guide bindings", () => {
    const f = fixture();
    expect(() => validateApplicationPages(f.pages, apps, f.sitemap)).not.toThrow();
  });
  it("rejects a missing guide identity even when the Word and all package links remain", () => {
    const f = fixture();
    f.pages.set(
      "downloads/",
      html(f).replace(first.guide.manifestUrl, "https://example.org/forged.json"),
    );
    expect(() => validateApplicationPages(f.pages, apps, f.sitemap)).toThrow(/guide\/version/);
  });
  it("rejects omitted package links and platform/signing qualifiers", () => {
    const f = fixture();
    f.pages.set(
      "downloads/",
      html(f).replace(firstAsset.checksumURL, "https://example.org/forged.sha256"),
    );
    expect(() => validateApplicationPages(f.pages, apps, f.sitemap)).toThrow(/evidence/);
    const g = fixture();
    g.pages.set("downloads/", html(g).replace("Packages are unsigned", "Packages"));
    expect(() => validateApplicationPages(g.pages, apps, g.sitemap)).toThrow(/scope/);
  });
  it("rejects swapped guide identities and versions within one otherwise complete page", () => {
    const f = fixture();
    f.pages.set(
      "downloads/",
      html(f)
        .replace(first.guide.manifestUrl, "SWAP_GUIDE")
        .replace(second.guide.manifestUrl, first.guide.manifestUrl)
        .replace("SWAP_GUIDE", second.guide.manifestUrl),
    );
    expect(() => validateApplicationPages(f.pages, apps, f.sitemap)).toThrow(/guide\/version/);
    const g = fixture();
    g.pages.set(
      "downloads/",
      html(g)
        .replace(`<h2>v${first.version}</h2>`, "SWAP_VERSION")
        .replace(`<h2>v${second.version}</h2>`, `<h2>v${first.version}</h2>`)
        .replace("SWAP_VERSION", `<h2>v${second.version}</h2>`),
    );
    expect(() => validateApplicationPages(g.pages, apps, g.sitemap)).toThrow(/guide\/version/);
  });
});
