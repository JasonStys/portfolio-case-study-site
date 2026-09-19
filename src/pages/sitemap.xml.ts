/**
 * @file Generates a deterministic sitemap for static pages and every featured case study.
 * Functions: GET static endpoint.
 * Variables: route paths and absolute URLs.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { featuredProjects } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/url";
import { escapeXml } from "@/lib/xml";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () => {
  const caseStudyPaths = featuredProjects.map((project) => {
    if (!project.caseStudySlug)
      throw new Error(`Featured project ${project.name} has no case study.`);
    return `case-studies/${project.caseStudySlug}/`;
  });
  const paths = ["", "projects/", "about/", ...caseStudyPaths];
  const urls = paths
    .map((path) => `<url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
