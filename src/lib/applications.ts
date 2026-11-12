/**
 * @file Validates the exact66 published Windows application records and immutable guide links.
 * Functions: validateApplications, record, list, text, timestamp, identity, positive, exact,
 * asset, guide, currentSource; variables: APPLICATION_NAMES, OWNER and digest patterns.
 * Line locations: docs/CODE_INDEX.md after integration. No acquisition, execution or local data.
 */
import priority from "../data/portfolio-priority.json" with { type: "json" };

export const APPLICATION_NAMES = Object.freeze(
  priority.filter((name) => name !== "portfolio-case-study-site"),
);
const OWNER = "https://github.com/JasonStys/";
const SHA = /^[a-f0-9]{40}$/u;
const DIGEST = /^[a-f0-9]{64}$/u;
const VERSION = /^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)$/u;

export type ApplicationAsset = Readonly<{
  name: string;
  url: string;
  byteSize: number;
  sha256: string;
  assetId: number;
  platform: "windows" | "linux" | "macos";
  architecture: "x64" | "arm64" | "unspecified";
  format: "zip" | "tar.gz" | "exe" | "dmg" | "appimage";
  kind: "portable-archive" | "portable-executable" | "installer" | "disk-image";
  checksumName: string;
  checksumURL: string;
}>;
export type ApplicationWorkflow = Readonly<{
  name: string;
  url: string;
  sourceCommit: string;
  conclusion: "success";
}>;
export type ApplicationGuide = Readonly<{
  name: string;
  version: string;
  runtimeSource: string;
  publicationSource: string;
  documentPath: string;
  documentSha256: string;
  documentGitBlob: string;
  documentByteSize: number;
  documentUrl: string;
  manifestPath: string;
  manifestSha256: string;
  manifestGitBlob: string;
  manifestByteSize: number;
  manifestUrl: string;
}>;
export type CurrentApplication = Readonly<{
  name: string;
  purpose: string;
  summary: string;
  rationale: string;
  limitations: readonly string[];
  version: string;
  runtimeSource: string;
  runtimeSourceUrl: string;
  releaseUrl: string;
  publishedAt: string;
  releaseId: number;
  requirements: string;
  start: string;
  exit: string;
  assets: readonly ApplicationAsset[];
  currentSource: Readonly<{
    commit: string;
    url: string;
    observedAt: string;
    workflows: readonly ApplicationWorkflow[];
  }>;
  guide: ApplicationGuide;
}>;
export type ApplicationManifest = Readonly<{
  schemaVersion: 1;
  collectedAt: string;
  applications: readonly CurrentApplication[];
}>;

/** Admit closed own-data records without invoking getters or accepting inherited public fields. */
function record(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (value === null || typeof value !== "object")
    throw new TypeError("Application metadata must be a public record.");
  const prototype: unknown = Object.getPrototypeOf(value);
  if (
    (prototype !== Object.prototype && prototype !== null) ||
    Reflect.ownKeys(value).length !== keys.length ||
    keys.some((key) => !Object.hasOwn(value, key)) ||
    Reflect.ownKeys(value).some((key) => typeof key !== "string" || !keys.includes(key)) ||
    keys.some((key) => !Object.hasOwn(Object.getOwnPropertyDescriptor(value, key) ?? {}, "value"))
  )
    throw new TypeError("Application metadata must use exactly its public own-data fields.");
  return value as Record<string, unknown>;
}

/** A bounded dense array cannot silently omit a sparse record or carry hidden extra properties. */
function list(value: unknown, minimum: number, maximum: number): unknown[] {
  if (
    !Array.isArray(value) ||
    value.length < minimum ||
    value.length > maximum ||
    Reflect.ownKeys(value).length !== value.length + 1
  )
    throw new TypeError("Expected a bounded dense metadata array.");
  for (let index = 0; index < value.length; index++) {
    if (
      !Object.hasOwn(value, index) ||
      !Object.hasOwn(Object.getOwnPropertyDescriptor(value, index) ?? {}, "value")
    )
      throw new TypeError("Sparse or accessor metadata is unsupported.");
  }
  return value;
}

/** Public prose never carries markup, invisible controls, token material or private PC paths. */
function text(value: unknown, maximum: number): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.trim() !== value ||
    value.length > maximum ||
    /[\p{Cc}\p{Cf}\p{Cs}<>`]/u.test(value) ||
    /\[[^\]]*\]\([^)]*\)|^#{1,6}\s/u.test(value) ||
    /(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/u.test(value) ||
    /(?:api[_-]?key|access[_-]?token|password)\s*[=:]\s*\S+/iu.test(value) ||
    /(?:^|[\s"'(])[A-Za-z]:[\\/]|\\\\|\/(?:Users|home|tmp|private|mnt)\/|%(?:LOCALAPPDATA|APPDATA|USERPROFILE)%/iu.test(
      value,
    )
  )
    throw new TypeError("Expected bounded public plain text.");
  return value;
}

/** Real calendar timestamps retain microsecond ordering rather than rounding future values. */
function timestamp(value: unknown, latest?: string): string {
  const result = text(value, 40);
  const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?(?:Z|\+00:00)$/u.exec(
    result,
  );
  if (
    !match ||
    !Number.isFinite(Date.parse(result)) ||
    new Date(result).toISOString().slice(0, 19) !== result.slice(0, 19)
  )
    throw new TypeError("Expected a real UTC calendar timestamp.");
  const micros = (date: string) => {
    const base = date.slice(0, 19);
    const fraction = /\.(\d{1,6})/u.exec(date)?.[1] ?? "";
    return BigInt(Date.parse(base + "Z")) * 1000n + BigInt(fraction.padEnd(6, "0"));
  };
  if (latest !== undefined && micros(result) > micros(latest))
    throw new TypeError("An observation or publication cannot follow collection.");
  return result;
}

/** Keep SHA identities distinct from human-readable versions and numeric provider IDs. */
function identity(value: unknown, digest = false): string {
  const result = text(value, digest ? 64 : 40);
  if (!(digest ? DIGEST : SHA).test(result)) throw new TypeError("Expected a full lowercase hash.");
  return result;
}
/** Return a safe positive integer for provider IDs and byte counts; reject booleans and zero. */
function positive(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0)
    throw new TypeError("Expected a positive safe provider ID or byte count.");
  return value;
}
/** Admit only the exact derived public URL or identity; aliases never broaden the repository scope. */
function exact(value: unknown, expected: string): string {
  if (value !== expected) throw new TypeError("URL or identity differs from its bound source.");
  return expected;
}

/** Bind payload/checksum names to this release; a checksum is not another application payload. */
function asset(value: unknown, name: string, version: string): ApplicationAsset {
  const row = record(value, [
    "name",
    "url",
    "byteSize",
    "sha256",
    "assetId",
    "platform",
    "architecture",
    "format",
    "kind",
    "checksumName",
    "checksumURL",
  ]);
  const filename = text(row.name, 180);
  const checksumName = text(row.checksumName, 190);
  if (
    ![filename, checksumName].every(
      (part) =>
        /^[A-Za-z0-9][A-Za-z0-9._ -]*$/u.test(part) && !part.includes("..") && !/[. ]$/u.test(part),
    )
  )
    throw new TypeError("Expected safe literal asset filenames.");
  const escapedVersion = version.replaceAll(".", "\\.");
  if (!new RegExp(`(?:^|[-_. v])${escapedVersion}(?:[-_. ]|$)`, "u").test(filename))
    throw new TypeError("Payload must name this release version.");
  const platform = row.platform as ApplicationAsset["platform"];
  const architecture = row.architecture as ApplicationAsset["architecture"];
  const format = row.format as ApplicationAsset["format"];
  const kind = row.kind as ApplicationAsset["kind"];
  if (
    !["windows", "linux", "macos"].includes(platform) ||
    !["x64", "arm64", "unspecified"].includes(architecture) ||
    !["zip", "tar.gz", "exe", "dmg", "appimage"].includes(format) ||
    !["portable-archive", "portable-executable", "installer", "disk-image"].includes(kind) ||
    !filename.toLowerCase().endsWith("." + format) ||
    ((format === "zip" || format === "tar.gz") && kind !== "portable-archive") ||
    (format === "exe" && !["installer", "portable-executable"].includes(kind)) ||
    (format === "dmg" && (kind !== "disk-image" || platform !== "macos")) ||
    (format === "appimage" && (kind !== "portable-executable" || platform !== "linux")) ||
    (format === "exe" && platform !== "windows") ||
    (format === "tar.gz" && platform === "windows")
  )
    throw new TypeError("Unsupported or contradictory application distribution.");
  const stated = /[-_.](x64|amd64|x86_64|arm64)(?:[-_.]|$)/iu.exec(filename)?.[1]?.toLowerCase();
  if (stated && architecture !== (stated === "arm64" ? "arm64" : "x64"))
    throw new TypeError("Architecture contradicts its explicit filename.");
  const stem = filename.slice(0, -(format.length + 1));
  if (
    checksumName !== filename + ".sha256" &&
    checksumName !== stem + ".sha256" &&
    !(name === "drone-operations-console" && checksumName === "SHA256SUMS.txt")
  )
    throw new TypeError("Checksum must be the paired sidecar or declared DroneOps checksum set.");
  const base = `${OWNER}${name}/releases/download/v${version}/`;
  return Object.freeze({
    name: filename,
    url: exact(row.url, base + encodeURIComponent(filename)),
    byteSize: positive(row.byteSize),
    sha256: identity(row.sha256, true),
    assetId: positive(row.assetId),
    platform,
    architecture,
    format,
    kind,
    checksumName,
    checksumURL: exact(row.checksumURL, base + encodeURIComponent(checksumName)),
  });
}

/** A guide publication may differ from runtime/current source; each URL binds its own identity. */
function guide(value: unknown, name: string, version: string, runtime: string): ApplicationGuide {
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
  ]);
  exact(row.name, name);
  exact(row.version, version);
  exact(row.runtimeSource, runtime);
  const publicationSource = identity(row.publicationSource);
  const documentPath = text(row.documentPath, 200);
  const suffix = version.replaceAll(".", "\\.");
  if (
    !new RegExp(
      `^docs/reports/windows-application-guide(?:-${suffix}(?:-r[1-9][0-9]*)?)?\\.docx$`,
      "u",
    ).test(documentPath)
  )
    throw new TypeError("Expected an exact safe current-edition Word path.");
  const manifestPath = exact(row.manifestPath, documentPath.slice(0, -5) + ".json");
  const base = `${OWNER}${name}/blob/${publicationSource}/`;
  return Object.freeze({
    name,
    version,
    runtimeSource: runtime,
    publicationSource,
    documentPath,
    documentSha256: identity(row.documentSha256, true),
    documentGitBlob: identity(row.documentGitBlob),
    documentByteSize: positive(row.documentByteSize),
    documentUrl: exact(row.documentUrl, base + documentPath),
    manifestPath,
    manifestSha256: identity(row.manifestSha256, true),
    manifestGitBlob: identity(row.manifestGitBlob),
    manifestByteSize: positive(row.manifestByteSize),
    manifestUrl: exact(row.manifestUrl, base + manifestPath),
  });
}

/** Passing source checks bind this separately observed main, never the older runtime by inference. */
function currentSource(
  value: unknown,
  name: string,
  collectedAt: string,
): CurrentApplication["currentSource"] {
  const row = record(value, ["commit", "url", "observedAt", "workflows"]);
  const commit = identity(row.commit);
  const base = OWNER + name;
  const links = new Set<string>();
  const titles = new Set<string>();
  const workflows = list(row.workflows, 1, 12).map((raw): ApplicationWorkflow => {
    const item = record(raw, ["name", "url", "sourceCommit", "conclusion"]);
    const title = text(item.name, 120);
    const url = text(item.url, 250);
    const prefix = base + "/actions/runs/";
    if (
      !url.startsWith(prefix) ||
      !/^[1-9][0-9]{0,15}$/u.test(url.slice(prefix.length)) ||
      links.has(url) ||
      titles.has(title) ||
      item.sourceCommit !== commit ||
      item.conclusion !== "success"
    )
      throw new TypeError("Source workflows must be unique exact-source passing repository runs.");
    links.add(url);
    titles.add(title);
    return Object.freeze({ name: title, url, sourceCommit: commit, conclusion: "success" });
  });
  return Object.freeze({
    commit,
    url: exact(row.url, base + "/tree/" + commit),
    observedAt: timestamp(row.observedAt, collectedAt),
    workflows: Object.freeze(workflows),
  });
}

/** Validate the complete ordered66 app projection without accepting private acquisition records. */
export function validateApplications(input: unknown): ApplicationManifest {
  const envelope = record(input, ["schemaVersion", "collectedAt", "applications"]);
  if (
    envelope.schemaVersion !== 1 ||
    APPLICATION_NAMES.length !== 66 ||
    new Set(APPLICATION_NAMES).size !== 66
  )
    throw new TypeError("Unsupported application schema or catalog scope.");
  const collectedAt = timestamp(envelope.collectedAt);
  const ids = new Set<number>();
  const releaseIds = new Set<number>();
  const urls = new Set<string>();
  const applications = list(envelope.applications, 66, 66).map((raw, index): CurrentApplication => {
    const row = record(raw, [
      "name",
      "purpose",
      "summary",
      "rationale",
      "limitations",
      "version",
      "runtimeSource",
      "runtimeSourceUrl",
      "releaseUrl",
      "publishedAt",
      "releaseId",
      "requirements",
      "start",
      "exit",
      "assets",
      "currentSource",
      "guide",
    ]);
    const name = text(row.name, 100);
    if (name !== APPLICATION_NAMES[index])
      throw new TypeError("Applications must match the exact ordered66 repository catalog.");
    const version = text(row.version, 32);
    if (!VERSION.test(version))
      throw new TypeError("Expected a stable three-part application version.");
    const runtimeSource = identity(row.runtimeSource);
    const base = OWNER + name;
    const releaseId = positive(row.releaseId);
    if (releaseIds.has(releaseId)) throw new TypeError("Release IDs must be globally unique.");
    releaseIds.add(releaseId);
    const assets = list(row.assets, 1, 6).map((value) => asset(value, name, version));
    const assetNames = new Set<string>();
    for (const item of assets) {
      if (ids.has(item.assetId) || urls.has(item.url) || assetNames.has(item.name))
        throw new TypeError("Application payload IDs, names and links must be unique.");
      ids.add(item.assetId);
      urls.add(item.url);
      assetNames.add(item.name);
    }
    if (!assets.some((item) => item.platform === "windows"))
      throw new TypeError("Every delivered app must include its Windows payload.");
    const limitations = list(row.limitations, 1, 4).map((value) => text(value, 400));
    if (new Set(limitations).size !== limitations.length)
      throw new TypeError("Limitations must be unique.");
    return Object.freeze({
      name,
      purpose: text(row.purpose, 200),
      summary: text(row.summary, 700),
      rationale: text(row.rationale, 400),
      limitations: Object.freeze(limitations),
      version,
      runtimeSource,
      runtimeSourceUrl: exact(row.runtimeSourceUrl, base + "/tree/" + runtimeSource),
      releaseUrl: exact(row.releaseUrl, base + "/releases/tag/v" + version),
      publishedAt: timestamp(row.publishedAt, collectedAt),
      releaseId,
      requirements: text(row.requirements, 350),
      start: text(row.start, 300),
      exit: text(row.exit, 300),
      assets: Object.freeze(assets),
      currentSource: currentSource(row.currentSource, name, collectedAt),
      guide: guide(row.guide, name, version, runtimeSource),
    });
  });
  return Object.freeze({
    schemaVersion: 1,
    collectedAt,
    applications: Object.freeze(applications),
  });
}
