/**
 * @file Defines the schema-validated Markdown collection for consistent engineering case studies.
 * Functions: defineCollection invocation with a Zod schema.
 * Variables: caseStudies and exported collections.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const caseStudies = defineCollection({
  loader: glob({ base: "./src/content/case-studies", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(3).max(90),
    repository: z.url().startsWith("https://github.com/JasonStys/"),
    summary: z.string().min(40).max(240),
    role: z.string().min(3).max(80),
    languages: z.array(z.string().min(1)).min(1),
    evidence: z.array(z.string().min(3).max(100)).min(3).max(6),
    featuredOrder: z.number().int().min(1).max(6),
  }),
});

export const collections = { caseStudies };
