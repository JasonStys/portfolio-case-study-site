/**
 * @file Configures deterministic static output for the repository-scoped GitHub Pages URL.
 * Functions: defineConfig invocation.
 * Variables: site and base deployment coordinates.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jasonstys.github.io",
  base: "/portfolio-case-study-site",
  output: "static",
  build: {
    assets: "assets",
    inlineStylesheets: "never",
  },
  compressHTML: true,
  vite: {
    build: {
      sourcemap: true,
    },
  },
});
