/**
 * @file Pre-renders the versioned project text and facet index consumed by catalog enhancement.
 * Functions: GET static endpoint.
 * Variables: projects and repository cache timestamp.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { projects, repositoryCache } from "@/lib/catalog";
import { buildSearchIndex } from "@/lib/search";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildSearchIndex(projects, repositoryCache.fetchedAt)), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
