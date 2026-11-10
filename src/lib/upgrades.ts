/**
 * @file Validates public source-bound upgrade evidence against the exact reviewed domain catalog.
 * Functions: validateUpgrades, requireObject, requireText, exactUrl, projectUpgrade.
 * Variables: DOMAIN_NAMES, UPGRADE_SCOPE, upgradeManifest and immutable upgrade records.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import rawUpgrades from "@/data/project-upgrades.json";
import { projects } from "@/lib/catalog";

export const UPGRADE_SCOPE =
  "66 domain repositories created in this chat; portfolio site is validated separately";
const DOMAIN_NAMES = projects
  .filter((project) => project.name !== "portfolio-case-study-site")
  .map((project) => project.name);
const SHA = /^[a-f0-9]{40}$/u;

export type UpgradeWorkflow = Readonly<{ name: string; url: string }>;
export type ProjectUpgrade = Readonly<{
  name: string;
  summary: string;
  rationale: string;
  limitations: readonly string[];
  sourceCommit: string;
  sourceUrl: string;
  reviewUrl: string;
  validationReportUrl: string;
  workflows: readonly UpgradeWorkflow[];
}>;
export type UpgradeManifest = Readonly<{
  schemaVersion: 1;
  collectedAt: string;
  scope: typeof UPGRADE_SCOPE;
  repositories: readonly ProjectUpgrade[];
}>;

/** Reject unknown fields rather than spreading private acquisition or local handoff data. */
function requireObject(value: unknown, keys: readonly string[], field: string) {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`${field} must be an object.`);
  const record = value as Record<string, unknown>;
  if (
    Object.keys(record).length !== keys.length ||
    Object.keys(record).some((key) => !keys.includes(key))
  )
    throw new TypeError(`${field} must contain exactly the public schema fields.`);
  return record;
}

/** Bound plain editorial text; never accept markup, controls, credentials or private PC paths. */
function requireText(value: unknown, maximum: number, field: string): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > maximum ||
    value.trim() !== value ||
    /\p{Cc}/u.test(value) ||
    /<\/?[a-z][^>]*>/iu.test(value) ||
    /(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/u.test(value) ||
    /(?:^|[\s"'(])[A-Za-z]:[\\/]|\/(?:Users|home)\//u.test(value)
  )
    throw new TypeError(`${field} must be bounded public plain text.`);
  return value;
}

/** Compare literal trusted URLs so credentials, encoded separators, queries and redirects fail. */
function exactUrl(value: unknown, expected: string, field: string): string {
  if (value !== expected) throw new TypeError(`${field} must bind to its repository and source.`);
  return expected;
}

/** Validate the entire 66-project snapshot; missing/duplicate/foreign/self evidence fails build. */
export function validateUpgrades(value: unknown): UpgradeManifest {
  const envelope = requireObject(
    value,
    ["schemaVersion", "collectedAt", "scope", "repositories"],
    "Upgrade manifest",
  );
  if (envelope.schemaVersion !== 1) throw new TypeError("Unsupported upgrade schema.");
  const collectedAt = requireText(envelope.collectedAt, 40, "collectedAt");
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|\+00:00)$/u.test(collectedAt) ||
    Number.isNaN(Date.parse(collectedAt)) ||
    new Date(collectedAt).toISOString().slice(0, 19) !== collectedAt.slice(0, 19)
  )
    throw new TypeError("collectedAt must be a UTC ISO timestamp.");
  if (envelope.scope !== UPGRADE_SCOPE) throw new TypeError("Upgrade scope must be explicit.");
  if (!Array.isArray(envelope.repositories) || envelope.repositories.length !== DOMAIN_NAMES.length)
    throw new TypeError("Upgrade evidence must cover exactly the 66 domain projects.");
  const names = new Set<string>();
  const repositories = envelope.repositories.map((raw): ProjectUpgrade => {
    const item = requireObject(
      raw,
      [
        "name",
        "summary",
        "rationale",
        "limitations",
        "sourceCommit",
        "sourceUrl",
        "reviewUrl",
        "validationReportUrl",
        "workflows",
      ],
      "Upgrade record",
    );
    const name = requireText(item.name, 100, "name");
    if (!DOMAIN_NAMES.includes(name) || names.has(name))
      throw new TypeError(`Unknown or duplicate upgrade project: ${name}.`);
    names.add(name);
    const sourceCommit = requireText(item.sourceCommit, 40, `${name}.sourceCommit`);
    if (!SHA.test(sourceCommit)) throw new TypeError(`${name} requires a full source commit.`);
    const base = `https://github.com/JasonStys/${name}`;
    const sourceUrl = exactUrl(item.sourceUrl, `${base}/tree/${sourceCommit}`, `${name}.sourceUrl`);
    const reviewUrl = requireText(item.reviewUrl, 250, `${name}.reviewUrl`);
    const reviewPrefix = `${base}/pull/`;
    if (
      !reviewUrl.startsWith(reviewPrefix) ||
      !/^[1-9][0-9]{0,9}$/u.test(reviewUrl.slice(reviewPrefix.length))
    )
      throw new TypeError(`${name}.reviewUrl must be a same-repository pull request.`);
    const validationReportUrl = requireText(
      item.validationReportUrl,
      400,
      `${name}.validationReportUrl`,
    );
    const reportPrefix = `${base}/blob/${sourceCommit}/docs/reports/`;
    const reportPath = validationReportUrl.slice(reportPrefix.length);
    if (
      !validationReportUrl.startsWith(reportPrefix) ||
      !/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.md$/u.test(reportPath)
    )
      throw new TypeError(
        `${name}.validationReportUrl must use source-bound report documentation.`,
      );
    if (
      !Array.isArray(item.limitations) ||
      item.limitations.length < 1 ||
      item.limitations.length > 4
    )
      throw new TypeError(`${name}.limitations must contain 1–4 bounded statements.`);
    const limitations = item.limitations.map((entry) =>
      requireText(entry, 400, `${name}.limitations`),
    );
    if (new Set(limitations).size !== limitations.length)
      throw new TypeError(`${name}.limitations must be unique.`);
    if (!Array.isArray(item.workflows) || item.workflows.length < 1 || item.workflows.length > 8)
      throw new TypeError(`${name}.workflows must contain 1–8 public run links.`);
    const workflows = item.workflows.map((rawWorkflow): UpgradeWorkflow => {
      const workflow = requireObject(rawWorkflow, ["name", "url"], `${name}.workflow`);
      const url = requireText(workflow.url, 250, `${name}.workflow.url`);
      const runPrefix = `${base}/actions/runs/`;
      if (!url.startsWith(runPrefix) || !/^[1-9][0-9]{0,15}$/u.test(url.slice(runPrefix.length)))
        throw new TypeError(`${name}.workflow.url must be a same-repository run.`);
      return Object.freeze({ name: requireText(workflow.name, 100, `${name}.workflow.name`), url });
    });
    if (
      new Set(workflows.map((workflow) => workflow.name)).size !== workflows.length ||
      new Set(workflows.map((workflow) => workflow.url)).size !== workflows.length
    )
      throw new TypeError(`${name}.workflows must have unique names and run URLs.`);
    return Object.freeze({
      name,
      summary: requireText(item.summary, 700, `${name}.summary`),
      rationale: requireText(item.rationale, 700, `${name}.rationale`),
      limitations: Object.freeze(limitations),
      sourceCommit,
      sourceUrl,
      reviewUrl,
      validationReportUrl,
      workflows: Object.freeze(workflows),
    });
  });
  return Object.freeze({
    schemaVersion: 1,
    collectedAt,
    scope: UPGRADE_SCOPE,
    repositories: Object.freeze(repositories),
  });
}

export const upgradeManifest = validateUpgrades(rawUpgrades);
const upgradesByName = new Map(upgradeManifest.repositories.map((entry) => [entry.name, entry]));

/** Return only a validated domain record; the portfolio hub has a distinct current-CI page. */
export function projectUpgrade(name: string): ProjectUpgrade | undefined {
  return upgradesByName.get(name);
}
