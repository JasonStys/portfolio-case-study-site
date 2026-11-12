/**
 * @file Proves actual HTML pagination checks reject missing/duplicate cards, dropped evidence and incomplete navigation.
 * Functions: independently authored HTML fixtures and failure mutations; variables: unchanged public catalog records.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import raw from "../../src/data/project-downloads.json";
import { validateDownloads } from "../../src/lib/downloads";
import { validateDownloadPages } from "../../scripts/download-page-contract.mjs";
const repositories = validateDownloads(raw).repositories;
function fixture() {
  const pages = new Map<string, string>();
  const total = Math.ceil(repositories.length / 12);
  const sitemap = Array.from(
    { length: total },
    (_, index) =>
      `/portfolio-case-study-site/${index === 0 ? "downloads/" : `downloads/page/${index + 1}/`}`,
  ).join("\n");
  for (let page = 1; page <= total; page++) {
    const route = page === 1 ? "downloads/" : `downloads/page/${page}/`;
    const cards = repositories
      .slice((page - 1) * 12, page * 12)
      .map((project) => {
        const links = [
          project.releaseUrl,
          project.sourceUrl,
          project.releaseCheck.url,
          ...(project.acceptanceCheck
            ? [project.acceptanceCheck.url, project.acceptanceCheck.verifierSourceUrl]
            : []),
        ];
        return `<li data-download-project="${project.name}"><p>${project.requirements}</p>${links.map((url) => `<a href="${url}">Evidence</a>`).join("")}<ul>${project.assets.map((asset) => `<li data-download-platform="${asset.platform}"><a href="${asset.assetUrl}">Package</a><a href="${asset.checksumUrl}">Checksum</a><code>${asset.sha256.slice(0, 12)}</code></li>`).join("")}</ul><p>${project.limitations[0]}</p></li>`;
      })
      .join("");
    const navigation = Array.from(
      { length: total },
      (_, index) =>
        `<a href="/portfolio-case-study-site/${index === 0 ? "downloads/" : `downloads/page/${index + 1}/`}" aria-label="Download page ${index + 1}"${index + 1 === page ? ' aria-current="page"' : ""}>Page ${index + 1}</a>`,
    ).join("");
    pages.set(route, `<ol>${cards}</ol><nav aria-label="Download pages">${navigation}</nav>`);
  }
  return { pages, sitemap };
}
describe("built download page contract", () => {
  it("accepts the complete independent current20/62 evidence spread across12/8 cards", () => {
    const f = fixture();
    expect(() => validateDownloadPages(f.pages, repositories, f.sitemap)).not.toThrow();
  });
  it("rejects a missing whole page instead of silently omitting its projects", () => {
    const f = fixture();
    f.pages.delete("downloads/page/2/");
    expect(() => validateDownloadPages(f.pages, repositories, f.sitemap)).toThrow(/page count/);
  });
  it("rejects duplicated identities even when the card count stays unchanged", () => {
    const f = fixture(),
      html = f.pages.get("downloads/");
    if (!html) throw Error("Missing fixture");
    const first = repositories[0],
      second = repositories[1];
    if (!first || !second) throw Error("Missing fixture");
    f.pages.set(
      "downloads/",
      html.replace(
        `data-download-project="${second.name}"`,
        `data-download-project="${first.name}"`,
      ),
    );
    expect(() => validateDownloadPages(f.pages, repositories, f.sitemap)).toThrow(
      /duplicate|reorder/,
    );
  });
  it("rejects a dropped checksum href while preserving the correct project/body/hash fixture", () => {
    const f = fixture(),
      html = f.pages.get("downloads/"),
      checksum = repositories[0]?.assets[0]?.checksumUrl;
    if (!html || !checksum) throw Error("Missing fixture");
    f.pages.set(
      "downloads/",
      html.replace(`href="${checksum}"`, `href="https://github.com/JasonStys/not-the-checksum"`),
    );
    expect(() => validateDownloadPages(f.pages, repositories, f.sitemap)).toThrow(/evidence/);
  });
  it("rejects wrong current-page navigation and missing sitemap evidence independently", () => {
    const f = fixture(),
      html = f.pages.get("downloads/");
    if (!html) throw Error("Missing fixture");
    f.pages.set("downloads/", html.replace('aria-current="page"', 'aria-current="step"'));
    expect(() => validateDownloadPages(f.pages, repositories, f.sitemap)).toThrow(/navigation/);
    const g = fixture();
    expect(() => validateDownloadPages(g.pages, repositories, "")).toThrow(/sitemap/);
  });
});
