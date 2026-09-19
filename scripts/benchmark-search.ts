/**
 * @file Benchmarks inverted-index construction and intersections over deterministic synthetic projects.
 * Functions: createProject, percentile, measure, main.
 * Variables: PROJECT_COUNT, QUERY_COUNT, BUDGETS, and checkOnly.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { buildSearchIndex, searchProjectIds } from "../src/lib/search.ts";
import type { Project } from "../src/lib/types.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "docs", "reports", "generated", "search-benchmark.json");
const PROJECT_COUNT = 10_000;
const QUERY_COUNT = 500;
const BUDGETS = { buildMs: 1_500, queryP95Ms: 12, serializedMiB: 12 } as const;
const checkOnly = process.argv.includes("--check");

function createProject(index: number): Project {
  const language = ["TypeScript", "Python", "C++", "Rust"][index % 4] ?? "TypeScript";
  return {
    name: `synthetic-project-${index.toString().padStart(5, "0")}`,
    description: `Deterministic ${language} service with retry telemetry cohort ${index % 137}`,
    url: `https://github.com/JasonStys/synthetic-project-${index}`,
    primaryLanguage: language,
    languages: [language, "SQL"],
    topics: ["reliability", `cohort-${index % 137}`],
    pushedAt: "2026-09-19T00:00:00Z",
    roles: index % 2 === 0 ? ["Backend engineer"] : ["Data engineer"],
    domains: index % 3 === 0 ? ["Reliability"] : ["Analytics"],
    maturity: "validated",
    outcome: "Measures bounded work and records reproducible evidence.",
  };
}

function percentile(values: readonly number[], fraction: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))] ?? 0;
}

function measure<T>(operation: () => T): { value: T; durationMs: number } {
  const startedAt = performance.now();
  const value = operation();
  return { value, durationMs: performance.now() - startedAt };
}

async function main(): Promise<void> {
  const projects = Array.from({ length: PROJECT_COUNT }, (_, index) => createProject(index));
  const build = measure(() => buildSearchIndex(projects, "synthetic"));
  const queryDurations: number[] = [];
  for (let index = 0; index < QUERY_COUNT; index += 1) {
    queryDurations.push(
      measure(() =>
        searchProjectIds(build.value, `retry cohort-${index % 137}`, {
          language: index % 2 === 0 ? "TypeScript" : "Python",
        }),
      ).durationMs,
    );
  }
  const serializedMiB = Buffer.byteLength(JSON.stringify(build.value)) / 1024 / 1024;
  const metrics = {
    buildMs: build.durationMs,
    queryP50Ms: percentile(queryDurations, 0.5),
    queryP95Ms: percentile(queryDurations, 0.95),
    serializedMiB,
  };
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    runtime: process.version,
    platform: `${process.platform}-${process.arch}`,
    projectCount: PROJECT_COUNT,
    queryCount: QUERY_COUNT,
    metrics,
    budgets: BUDGETS,
  };
  console.log(JSON.stringify(report, null, 2));
  const failures = Object.entries(BUDGETS)
    .filter(([key, maximum]) => metrics[key as keyof typeof BUDGETS] > maximum)
    .map(([key]) => key);
  if (failures.length > 0)
    throw new Error(`Search performance budgets failed: ${failures.join(", ")}.`);
  if (!checkOnly) {
    await mkdir(path.dirname(OUTPUT), { recursive: true });
    await writeFile(OUTPUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
}

await main();
