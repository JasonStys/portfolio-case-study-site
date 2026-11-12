/**
 * @file Generates a deterministic sitemap for static pages and every featured case study.
 * Functions: GET static endpoint.
 * Variables: route paths and absolute URLs.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { projects } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/url";
import { escapeXml } from "@/lib/xml";
import type { APIRoute } from "astro";
import { downloadManifest } from "@/lib/download-catalog";
import { applicationManifest } from "@/lib/application-catalog";
import { downloadPageCount, downloadPagePath } from "@/lib/download-pages";

export const prerender = true;

export const GET: APIRoute = () => {
  const caseStudyPaths = projects
    .filter((project) => project.caseStudySlug)
    .map((project) => {
      if (!project.caseStudySlug)
        throw new Error(`Featured project ${project.name} has no case study.`);
      return `case-studies/${project.caseStudySlug}/`;
    });
  const projectPaths = projects.map((project) => `projects/${project.name}/`);
  const paths = [
    "",
    "projects/",
    "updates/",
    "documentation/",
    "downloads/portfolio/",
    ...Array.from(
      { length: downloadPageCount(applicationManifest.applications.length) },
      (_, index) => downloadPagePath(index + 1),
    ),
    ...Array.from({ length: downloadPageCount(downloadManifest.repositories.length) }, (_, index) =>
      downloadPagePath(index + 1).replace("downloads/", "downloads/history/2026-11-10/"),
    ),
    "space-systems/",
    "drone-systems/",
    "about/",
    ...caseStudyPaths,
    ...projectPaths,
  ];
  const urls = paths
    .map((path) => `<url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
