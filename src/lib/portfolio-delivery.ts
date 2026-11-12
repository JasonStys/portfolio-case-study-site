/**
 * @file Validates the hub's independent published delivery without extending the immutable66-app catalog.
 * Functions: validatePortfolioDelivery and closed-record/identity/asset/guide/source helpers.
 * Variables: fixed repository, three workflow paths and five exact release roles.
 * Line locations: see docs/CODE_INDEX.md. Null means no delivery evidence has been projected.
 */
import type { ApplicationGuide, ApplicationWorkflow } from "./applications";

export const PORTFOLIO_REPOSITORY = "https://github.com/JasonStys/portfolio-case-study-site";
export const PORTFOLIO_ASSET_ROLES = Object.freeze([
  "windows-archive",
  "archive-checksum",
  "package-evidence",
  "license",
  "instructions",
] as const);
const WORKFLOW_PATHS = [
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/native-app.yml",
] as const;
type AssetRole = (typeof PORTFOLIO_ASSET_ROLES)[number];
export type PortfolioAsset = Readonly<{
  role: AssetRole;
  name: string;
  url: string;
  assetId: number;
  byteSize: number;
  sha256: string;
}>;
export type PortfolioDelivery = Readonly<{
  version: string;
  runtimeSource: string;
  runtimeSourceUrl: string;
  releaseId: number;
  releaseUrl: string;
  publishedAt: string;
  collectedAt: string;
  assets: readonly PortfolioAsset[];
  sourceChecks: Readonly<{
    observedAt: string;
    workflows: readonly (ApplicationWorkflow & { readonly path: string })[];
  }>;
  guide: ApplicationGuide & {
    readonly validationReportPath: string;
    readonly validationReportUrl: string;
    readonly validationReportSha256: string;
    readonly validationReportGitBlob: string;
    readonly validationReportByteSize: number;
  };
}>;
export type PortfolioDeliveryManifest = Readonly<{
  schemaVersion: 1;
  delivery: PortfolioDelivery | null;
}>;

/** Accept only exactly named own-data fields, without evaluating accessors or inherited metadata. */
function record(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (value === null || typeof value !== "object") throw new TypeError("Expected a public record.");
  const prototype: unknown = Object.getPrototypeOf(value);
  if (
    (prototype !== Object.prototype && prototype !== null) ||
    Reflect.ownKeys(value).length !== keys.length ||
    keys.some(
      (key) => !Object.hasOwn(Object.getOwnPropertyDescriptor(value, key) ?? {}, "value"),
    ) ||
    Reflect.ownKeys(value).some((key) => typeof key !== "string" || !keys.includes(key))
  )
    throw new TypeError("Expected exact public own-data fields.");
  return value as Record<string, unknown>;
}

/** Admit a fixed-length dense array; holes, additional properties and element getters are refused. */
function list(value: unknown, length: number): unknown[] {
  if (
    !Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Array.prototype ||
    value.length !== length ||
    Reflect.ownKeys(value).length !== length + 1
  )
    throw new TypeError("Expected a complete fixed-length array.");
  for (let index = 0; index < length; index++)
    if (!Object.hasOwn(Object.getOwnPropertyDescriptor(value, index) ?? {}, "value"))
      throw new TypeError("Array holes and accessors are unsupported.");
  return value;
}

/** Return bounded public literal text, rejecting controls, markup, local paths and credential material. */
function text(value: unknown, maximum: number): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.trim() !== value ||
    value.length > maximum ||
    /[\p{Cc}\p{Cf}\p{Cs}<>`]/u.test(value) ||
    /(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/u.test(value) ||
    /(?:^|[\s"'(])[A-Za-z]:[\\/]|\\\\|\/(?:Users|home|tmp|private|mnt)\//iu.test(value)
  )
    throw new TypeError("Expected bounded public literal text.");
  return value;
}

/** Require a full lowercase SHA identity; short display prefixes never identify release bytes. */
function hash(value: unknown, length: 40 | 64): string {
  const result = text(value, length);
  if (!new RegExp(`^[a-f0-9]{${length}}$`, "u").test(result))
    throw new TypeError("Expected a full lowercase hash.");
  return result;
}

/** Provider IDs and byte counts are positive safe integers, never boolean or rounded values. */
function positive(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0)
    throw new TypeError("Expected a positive safe integer.");
  return value;
}

/** Exact derived URLs reject foreign repositories, moving main links and encoded aliases. */
function exact(value: unknown, expected: string): string {
  if (value !== expected) throw new TypeError("Identity differs from its exact public binding.");
  return expected;
}

/** Validate real UTC calendar values and compare microseconds without rounding future observations. */
function timestamp(value: unknown, latest?: string): string {
  const result = text(value, 40);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|\+00:00)$/u.test(result) ||
    !Number.isFinite(Date.parse(result)) ||
    new Date(result).toISOString().slice(0, 19) !== result.slice(0, 19)
  )
    throw new TypeError("Expected a real UTC calendar timestamp.");
  const micros = (date: string) =>
    BigInt(Date.parse(date.slice(0, 19) + "Z")) * 1000n +
    BigInt((/\.(\d{1,6})/u.exec(date)?.[1] ?? "").padEnd(6, "0"));
  if (latest !== undefined && micros(result) > micros(latest))
    throw new TypeError("Publication or observation cannot follow collection.");
  return result;
}

/** Keep the sole Windows payload separate from its checksum, inventory, license and instructions. */
function assets(value: unknown, version: string): readonly PortfolioAsset[] {
  const archive = `Jason-Stys-Portfolio-${version}-windows-x64.zip`;
  const filenames = [
    archive,
    archive + ".sha256",
    "package-integrity.json",
    "LICENSE.txt",
    "INSTALL.txt",
  ];
  const ids = new Set<number>();
  return Object.freeze(
    list(value, 5).map((input, index) => {
      const row = record(input, ["role", "name", "url", "assetId", "byteSize", "sha256"]);
      const name = filenames[index];
      const role = PORTFOLIO_ASSET_ROLES[index];
      if (!name || !role) throw new TypeError("Unknown release role.");
      const assetId = positive(row.assetId);
      if (ids.has(assetId)) throw new TypeError("Provider asset IDs must be unique.");
      ids.add(assetId);
      return Object.freeze({
        role: exact(row.role, role) as AssetRole,
        name: exact(row.name, name),
        url: exact(
          row.url,
          `${PORTFOLIO_REPOSITORY}/releases/download/v${version}/${encodeURIComponent(name)}`,
        ),
        assetId,
        byteSize: positive(row.byteSize),
        sha256: hash(row.sha256, 64),
      });
    }),
  );
}

/** All three main observations describe the released source, not this later metadata commit. */
function sourceChecks(
  value: unknown,
  runtimeSource: string,
  collectedAt: string,
): PortfolioDelivery["sourceChecks"] {
  const row = record(value, ["observedAt", "workflows"]);
  const paths = new Set<string>();
  const urls = new Set<string>();
  const workflows = list(row.workflows, 3).map((input) => {
    const item = record(input, ["name", "path", "url", "sourceCommit", "conclusion"]);
    const path = text(item.path, 100);
    const url = text(item.url, 220);
    if (
      !WORKFLOW_PATHS.some((allowed) => allowed === path) ||
      paths.has(path) ||
      urls.has(url) ||
      !new RegExp(
        `^${PORTFOLIO_REPOSITORY.replaceAll(".", "\\.")}/actions/runs/[1-9][0-9]{0,15}$`,
        "u",
      ).test(url)
    )
      throw new TypeError("Expected three unique repository workflow observations.");
    paths.add(path);
    urls.add(url);
    return Object.freeze({
      name: text(item.name, 120),
      path,
      url,
      sourceCommit: exact(item.sourceCommit, runtimeSource),
      conclusion: exact(item.conclusion, "success") as "success",
    });
  });
  return Object.freeze({
    observedAt: timestamp(row.observedAt, collectedAt),
    workflows: Object.freeze(workflows),
  });
}

/** GuideA identifies real published Word/pair/report bytes independently of immutable runtimeM. */
function guide(value: unknown, version: string, runtimeSource: string): PortfolioDelivery["guide"] {
  const row = record(value, [
    "name",
    "version",
    "runtimeSource",
    "publicationSource",
    "documentPath",
    "documentSha256",
    "documentGitBlob",
    "documentByteSize",
    "documentUrl",
    "manifestPath",
    "manifestSha256",
    "manifestGitBlob",
    "manifestByteSize",
    "manifestUrl",
    "validationReportPath",
    "validationReportUrl",
    "validationReportSha256",
    "validationReportGitBlob",
    "validationReportByteSize",
  ]);
  const publicationSource = hash(row.publicationSource, 40);
  if (publicationSource === runtimeSource)
    throw new TypeError(
      "The later guide publication must remain separate from the native snapshot.",
    );
  const documentPath = text(row.documentPath, 200);
  if (
    !new RegExp(
      `^docs/reports/windows-application-guide(?:-${version.replaceAll(".", "\\.")}(?:-r[1-9][0-9]*)?)?\\.docx$`,
      "u",
    ).test(documentPath)
  )
    throw new TypeError("Expected the exact current Word edition path.");
  const manifestPath = exact(row.manifestPath, documentPath.slice(0, -5) + ".json");
  const validationReportPath = text(row.validationReportPath, 200);
  if (
    !new RegExp(
      `^docs/reports/portfolio-application-${version.replaceAll(".", "\\.")}-[0-9]{4}-[0-9]{2}-[0-9]{2}\\.md$`,
      "u",
    ).test(validationReportPath)
  )
    throw new TypeError("Expected an existing separately verified documentation report path.");
  const base = `${PORTFOLIO_REPOSITORY}/blob/${publicationSource}/`;
  return Object.freeze({
    name: exact(row.name, "portfolio-case-study-site"),
    version: exact(row.version, version),
    runtimeSource: exact(row.runtimeSource, runtimeSource),
    publicationSource,
    documentPath,
    documentSha256: hash(row.documentSha256, 64),
    documentGitBlob: hash(row.documentGitBlob, 40),
    documentByteSize: positive(row.documentByteSize),
    documentUrl: exact(row.documentUrl, base + documentPath),
    manifestPath,
    manifestSha256: hash(row.manifestSha256, 64),
    manifestGitBlob: hash(row.manifestGitBlob, 40),
    manifestByteSize: positive(row.manifestByteSize),
    manifestUrl: exact(row.manifestUrl, base + manifestPath),
    validationReportPath,
    validationReportUrl: exact(row.validationReportUrl, base + validationReportPath),
    validationReportSha256: hash(row.validationReportSha256, 64),
    validationReportGitBlob: hash(row.validationReportGitBlob, 40),
    validationReportByteSize: positive(row.validationReportByteSize),
  });
}

/** Null carries no invented release; a populated record requires every independent public identity. */
export function validatePortfolioDelivery(input: unknown): PortfolioDeliveryManifest {
  const envelope = record(input, ["schemaVersion", "delivery"]);
  if (envelope.schemaVersion !== 1) throw new TypeError("Unsupported portfolio delivery schema.");
  if (envelope.delivery === null) return Object.freeze({ schemaVersion: 1, delivery: null });
  const row = record(envelope.delivery, [
    "version",
    "runtimeSource",
    "runtimeSourceUrl",
    "releaseId",
    "releaseUrl",
    "publishedAt",
    "collectedAt",
    "assets",
    "sourceChecks",
    "guide",
  ]);
  const version = text(row.version, 32);
  if (!/^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)$/u.test(version))
    throw new TypeError("Expected a stable three-part version.");
  const runtimeSource = hash(row.runtimeSource, 40);
  const collectedAt = timestamp(row.collectedAt);
  return Object.freeze({
    schemaVersion: 1,
    delivery: Object.freeze({
      version,
      runtimeSource,
      runtimeSourceUrl: exact(
        row.runtimeSourceUrl,
        PORTFOLIO_REPOSITORY + "/tree/" + runtimeSource,
      ),
      releaseId: positive(row.releaseId),
      releaseUrl: exact(row.releaseUrl, PORTFOLIO_REPOSITORY + "/releases/tag/v" + version),
      publishedAt: timestamp(row.publishedAt, collectedAt),
      collectedAt,
      assets: assets(row.assets, version),
      sourceChecks: sourceChecks(row.sourceChecks, runtimeSource, collectedAt),
      guide: guide(row.guide, version, runtimeSource),
    }),
  });
}
