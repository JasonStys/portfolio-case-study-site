/**
 * @file Independently checks every generated static download page against complete authoritative evidence and the sitemap.
 * Functions: nodes, text and validateDownloadPages; variables: actual parsed anchor/card attributes and twelve-item limits.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import { parse, ELEMENT_NODE, TEXT_NODE } from "ultrahtml";
import { decodeHTML } from "entities";
function nodes(root) {
  const pending = [root],
    result = [];
  while (pending.length) {
    const node = pending.shift();
    result.push(node);
    if (result.length > 100000) throw new Error("Download HTML node budget exceeded.");
    if (Array.isArray(node.children)) pending.unshift(...node.children);
  }
  return result;
}
function text(root) {
  return nodes(root)
    .filter((node) => node.type === TEXT_NODE)
    .map((node) => decodeHTML(node.value))
    .join(" ")
    .replace(/\s+/gu, " ")
    .trim();
}
/** @param {Map<string,string>} pages @param {readonly import('../src/lib/downloads').ProjectDownload[]} repositories @param {string} sitemap */
export function validateDownloadPages(pages, repositories, sitemap) {
  const count = Math.ceil(repositories.length / 12),
    names = [],
    assets = [];
  if (!count || count > 6 || pages.size !== count)
    throw new Error("Download static page count differs.");
  for (let number = 1; number <= count; number++) {
    const route = number === 1 ? "downloads/" : `downloads/page/${number}/`,
      html = pages.get(route);
    if (!html || !sitemap.includes(`/portfolio-case-study-site/${route}`))
      throw new Error("Download static route/sitemap is missing.");
    const all = nodes(parse(html)),
      cards = all.filter(
        (node) =>
          node.type === ELEMENT_NODE && Object.hasOwn(node.attributes, "data-download-project"),
      );
    const expected = repositories.slice((number - 1) * 12, number * 12);
    if (
      JSON.stringify(cards.map((node) => node.attributes["data-download-project"])) !==
      JSON.stringify(expected.map((project) => project.name))
    )
      throw new Error("Download pages omit, duplicate or reorder a repository.");
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index],
        project = expected[index],
        children = nodes(card),
        links = children
          .filter((node) => node.type === ELEMENT_NODE && node.name === "a")
          .map((node) => decodeHTML(node.attributes.href ?? "")),
        visible = text(card);
      names.push(project.name);
      const expectedLinks = [
        project.releaseUrl,
        project.sourceUrl,
        project.releaseCheck.url,
        ...project.assets.flatMap((asset) => [asset.assetUrl, asset.checksumUrl]),
      ];
      if (project.acceptanceCheck)
        expectedLinks.push(project.acceptanceCheck.url, project.acceptanceCheck.verifierSourceUrl);
      if (
        expectedLinks.some((link) => !links.includes(link)) ||
        !visible.includes(project.requirements.replace(/\s+/gu, " ").trim()) ||
        !visible.includes(project.limitations[0].replace(/\s+/gu, " ").trim()) ||
        project.assets.some((asset) => !visible.includes(asset.sha256.slice(0, 12)))
      )
        throw new Error(
          "Download page lost exact source, package, checksum or limitation evidence.",
        );
      const rows = children.filter(
        (node) =>
          node.type === ELEMENT_NODE && Object.hasOwn(node.attributes, "data-download-platform"),
      );
      if (rows.length !== project.assets.length)
        throw new Error("Download page asset count differs.");
      for (let row = 0; row < rows.length; row++) {
        const first = nodes(rows[row]).find(
          (node) => node.type === ELEMENT_NODE && node.name === "a",
        );
        if (
          !first ||
          decodeHTML(first.attributes.href ?? "") !== project.assets[row].assetUrl ||
          rows[row].attributes["data-download-platform"] !== project.assets[row].platform
        )
          throw new Error("Download page asset ordering/platform differs.");
        assets.push(decodeHTML(first.attributes.href));
      }
    }
    const navigation = all.find(
      (node) =>
        node.type === ELEMENT_NODE &&
        node.name === "nav" &&
        node.attributes["aria-label"] === "Download pages",
    );
    if (!navigation) throw new Error("Download all-pages navigation is missing.");
    const links = nodes(navigation).filter(
      (node) => node.type === ELEMENT_NODE && node.name === "a",
    );
    for (let page = 1; page <= count; page++) {
      const route = page === 1 ? "downloads/" : `downloads/page/${page}/`;
      const link = links.find((node) => node.attributes["aria-label"] === `Download page ${page}`);
      if (
        !link ||
        link.attributes.href !== `/portfolio-case-study-site/${route}` ||
        (page === number
          ? link.attributes["aria-current"] !== "page"
          : Object.hasOwn(link.attributes, "aria-current"))
      )
        throw new Error("Download numbered/current-page navigation differs.");
    }
  }
  if (
    new Set(names).size !== repositories.length ||
    JSON.stringify(names) !== JSON.stringify(repositories.map((project) => project.name)) ||
    JSON.stringify(assets) !==
      JSON.stringify(
        repositories.flatMap((project) => project.assets.map((asset) => asset.assetUrl)),
      )
  )
    throw new Error("Download pages do not exactly cover the complete catalog.");
}
