/**
 * @file Enhances the project catalog with debounced text search, exact facets, URL state, and announcements.
 * Functions: initializeFilter, readFilters, applyFilter, scheduleFilter, updateUrl, requireElement.
 * Variables: controls, projectCards, searchIndex, debounceTimer, and live output.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { searchProjectIds } from "@/lib/search";
import type { ProjectFilters, ProjectMaturity, SerializedSearchIndex } from "@/lib/types";

const DEBOUNCE_MS = 120;

function requireElement<T extends Element>(
  selector: string,
  expectedType: abstract new () => T,
): T {
  const element = document.querySelector(selector);
  if (!(element instanceof expectedType)) {
    throw new Error(`Required project filter element is missing or invalid: ${selector}`);
  }
  return element;
}

function readFilters(controls: {
  role: HTMLSelectElement;
  language: HTMLSelectElement;
  domain: HTMLSelectElement;
  maturity: HTMLSelectElement;
}): ProjectFilters {
  const filters: { role?: string; language?: string; domain?: string; maturity?: ProjectMaturity } =
    {};
  if (controls.role.value) filters.role = controls.role.value;
  if (controls.language.value) filters.language = controls.language.value;
  if (controls.domain.value) filters.domain = controls.domain.value;
  if (controls.maturity.value) filters.maturity = controls.maturity.value as ProjectMaturity;
  return filters;
}

function updateUrl(query: string, filters: ProjectFilters): void {
  const url = new URL(window.location.href);
  const entries = [
    ["q", query],
    ["role", filters.role ?? ""],
    ["language", filters.language ?? ""],
    ["domain", filters.domain ?? ""],
    ["maturity", filters.maturity ?? ""],
  ] as const;
  for (const [key, value] of entries) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(null, "", url);
}

async function initializeFilter(): Promise<void> {
  const root = requireElement("[data-project-filter]", HTMLElement);
  const indexUrl = root.dataset.indexUrl;
  if (!indexUrl) throw new Error("Project search index URL is missing.");
  const response = await fetch(indexUrl, { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Project search index failed with ${response.status}.`);
  const searchIndex = (await response.json()) as SerializedSearchIndex;
  if (searchIndex.schemaVersion !== 1) throw new Error("Unsupported project search index schema.");

  const query = requireElement("#project-query", HTMLInputElement);
  const controls = {
    role: requireElement("#project-role", HTMLSelectElement),
    language: requireElement("#project-language", HTMLSelectElement),
    domain: requireElement("#project-domain", HTMLSelectElement),
    maturity: requireElement("#project-maturity", HTMLSelectElement),
  };
  const reset = requireElement("#project-reset", HTMLButtonElement);
  const output = requireElement("#project-count", HTMLOutputElement);
  const projectCards = new Map(
    [...document.querySelectorAll<HTMLElement>("[data-project-card]")].map((card) => [
      card.dataset.projectId ?? "",
      card,
    ]),
  );

  const parameters = new URLSearchParams(window.location.search);
  query.value = parameters.get("q") ?? "";
  controls.role.value = parameters.get("role") ?? "";
  controls.language.value = parameters.get("language") ?? "";
  controls.domain.value = parameters.get("domain") ?? "";
  controls.maturity.value = parameters.get("maturity") ?? "";

  const applyFilter = (): void => {
    const filters = readFilters(controls);
    const matches = new Set(searchProjectIds(searchIndex, query.value, filters));
    for (const [projectId, card] of projectCards) card.hidden = !matches.has(projectId);
    output.value = `${matches.size} project${matches.size === 1 ? "" : "s"}`;
    updateUrl(query.value.trim(), filters);
  };

  let debounceTimer: number | undefined;
  const scheduleFilter = (): void => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(applyFilter, DEBOUNCE_MS);
  };
  query.addEventListener("input", scheduleFilter);
  Object.values(controls).forEach((control) => control.addEventListener("change", applyFilter));
  reset.addEventListener("click", () => {
    query.value = "";
    Object.values(controls).forEach((control) => {
      control.value = "";
    });
    applyFilter();
    query.focus();
  });
  root.dataset.enhanced = "true";
  applyFilter();
}

void initializeFilter().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Project filtering could not start.");
});
