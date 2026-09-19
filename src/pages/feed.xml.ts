/**
 * @file Generates an RSS feed of featured case studies without runtime network access.
 * Functions: GET and XML item rendering.
 * Variables: caseStudies and canonical site URLs.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { absoluteUrl } from "@/lib/url";
import { escapeXml } from "@/lib/xml";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = (await getCollection("caseStudies")).sort(
    (left, right) => left.data.featuredOrder - right.data.featuredOrder,
  );
  const items = entries.map((entry) => {
    const url = absoluteUrl(`case-studies/${entry.id}/`);
    return `<item><title>${escapeXml(entry.data.title)}</title><link>${escapeXml(url)}</link><guid>${escapeXml(url)}</guid><description>${escapeXml(entry.data.summary)}</description></item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Jason Stys engineering case studies</title><link>${escapeXml(absoluteUrl(""))}</link><description>Evidence-first software, AI, data, cloud, web, and game-technology case studies.</description>${items.join("")}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
