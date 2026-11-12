/**
 * @file Checks every current download card and current guide binding against authoritative data, separately from history.
 * Functions: validateApplicationPages; variables: explicit public projection and complete static routes.
 * Line locations: see docs/CODE_INDEX.md. No external requests or reinterpretation of release workflows.
 */
import { parse, ELEMENT_NODE } from "ultrahtml";
import { decodeHTML } from "entities";
import { validateDownloadPages, nodes, text } from "./download-page-contract.mjs";
/** Bind each current card's version/guide to its own app after complete route/asset/order checks. */
export function validateApplicationPages(pages, applications, sitemap) {
  // Adapt only the independently shared presentation invariants; current evidence is checked below.
  const presentation = applications.map((app) => ({
    name: app.name,
    requirements: app.requirements,
    limitations: app.limitations,
    releaseUrl: app.releaseUrl,
    sourceUrl: app.runtimeSourceUrl,
    releaseCheck: { url: app.guide.documentUrl },
    assets: app.assets.map((asset) => ({
      assetUrl: asset.url,
      checksumUrl: asset.checksumURL,
      sha256: asset.sha256,
      platform: asset.platform,
    })),
  }));
  validateDownloadPages(pages, presentation, sitemap);
  const cards = new Map();
  for (const html of pages.values())
    for (const node of nodes(parse(html))) {
      if (node.type === ELEMENT_NODE && Object.hasOwn(node.attributes, "data-download-project"))
        cards.set(node.attributes["data-download-project"], node);
    }
  for (let index = 0; index < applications.length; index++) {
    const app = applications[index],
      page = Math.floor(index / 12) + 1;
    const route = page === 1 ? "downloads/" : `downloads/page/${page}/`;
    const html = pages.get(route);
    const children = nodes(cards.get(app.name));
    const links = children
      .filter((node) => node.type === ELEMENT_NODE && node.name === "a")
      .map((node) => decodeHTML(node.attributes.href ?? ""));
    const heading = children.find((node) => node.type === ELEMENT_NODE && node.name === "h2");
    if (
      !links.includes(app.guide.manifestUrl) ||
      !heading ||
      !text(heading).split(/\s+/u).includes(`v${app.version}`)
    )
      throw new Error("Current guide/version link missing.");
    if (!html.includes("published asset metadata") || !html.includes("Packages are unsigned"))
      throw new Error("Current platform/signature scope missing.");
  }
}
