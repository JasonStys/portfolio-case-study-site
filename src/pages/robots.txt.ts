/**
 * @file Publishes crawler policy and the absolute sitemap location.
 * Functions: GET static endpoint.
 * Variables: sitemap URL.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { absoluteUrl } from "@/lib/url";
import type { APIRoute } from "astro";

export const prerender = true;
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${absoluteUrl("sitemap.xml")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
