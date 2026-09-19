/**
 * @file Configures deterministic unit coverage for search, catalog, and content helpers.
 * Functions: defineConfig invocation.
 * Variables: coverage thresholds and test include patterns.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  base: "/portfolio-case-study-site/",
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  define: {
    "import.meta.env.BASE_URL": JSON.stringify("/portfolio-case-study-site/"),
    "import.meta.env.SITE": JSON.stringify("https://jasonstys.github.io"),
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/lib/**/*.ts"],
      thresholds: { statements: 92, branches: 88, functions: 92, lines: 92 },
    },
  },
});
