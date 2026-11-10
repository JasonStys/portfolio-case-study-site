/**
 * @file Validates a source-bound public index of the 20 projects with existing downloadable releases.
 * Functions: validateDownloads, object, text, exact, verifiedRun, archiveKind.
 * Variables: DOWNLOAD_NAMES, desktop/native scope and immutable public download records.
 * Line locations: docs/CODE_INDEX.md after integration. No runtime network requests or local records.
 */
export const DOWNLOAD_NAMES = [
  "code-flow-studio",
  "business-knowledge-workbench",
  "personal-image-model-studio",
  "secure-delivery-pipeline-lab",
  "applicant-evidence-studio",
  "spacecraft-flight-software-testbed",
  "spacecraft-telemetry-anomaly-studio",
  "mission-contact-resource-scheduler",
  "spacecraft-power-thermal-lab",
  "mission-verification-evidence-kit",
  "orbital-safety-workbench",
  "ccsds-telemetry-integrity-lab",
  "delay-tolerant-mission-network-lab",
  "earth-observation-change-studio",
  "mission-clock-integrity-lab",
  "resilient-energy-microgrid-lab",
  "scientific-sensor-calibration-lab",
  "space-weather-impact-observatory",
  "reactor-systems-simulator",
  "drone-operations-console",
] as const;

const DESKTOP = new Set<string>([
  "code-flow-studio",
  "business-knowledge-workbench",
  "personal-image-model-studio",
  "applicant-evidence-studio",
  "drone-operations-console",
]);
const NATIVE = new Set<string>(
  DOWNLOAD_NAMES.filter((name) => !DESKTOP.has(name) && name !== "secure-delivery-pipeline-lab"),
);
const OWNER = "https://github.com/JasonStys/";
const SHA = /^[a-f0-9]{40}$/u;
const DIGEST = /^[a-f0-9]{64}$/u;

export type DownloadAsset = Readonly<{
  assetName: string;
  assetUrl: string;
  checksumAssetName: string;
  checksumUrl: string;
  sha256: string;
  byteSize: number;
  platform: "windows" | "linux" | "macos" | "cross-platform";
  architecture: string;
  format: "zip" | "tar.gz" | "exe" | "msi" | "dmg" | "appimage" | "pyz";
  kind: "portable" | "installer" | "zipapp";
}>;
export type DownloadRun = Readonly<{
  name: string;
  sourceCommit: string;
  conclusion: "success";
  url: string;
}>;
export type ProjectDownload = Readonly<{
  name: string;
  version: string;
  distribution: "desktop-app" | "portable-gui" | "cli-zipapp";
  releaseUrl: string;
  publishedAt: string;
  sourceCommit: string;
  sourceUrl: string;
  validationReportUrl: string;
  sourceChecks: readonly DownloadRun[];
  releaseCheck: DownloadRun;
  acceptanceCheck: Readonly<{
    name: string;
    verifierSourceCommit: string;
    verifierSourceUrl: string;
    appSourceCommit: string;
    conclusion: "success";
    url: string;
  }> | null;
  assets: readonly DownloadAsset[];
  requirements: string;
  limitations: readonly string[];
}>;
export type DownloadManifest = Readonly<{
  schemaVersion: 1;
  collectedAt: string;
  repositories: readonly ProjectDownload[];
}>;

/** Refuse unknown fields rather than projecting private acquisition records into public JSON. */
function object(value: unknown, keys: readonly string[], label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(label + " must be an object.");
  const item = value as Record<string, unknown>;
  if (
    Object.keys(item).length !== keys.length ||
    Object.keys(item).some((key) => !keys.includes(key))
  )
    throw new TypeError(label + " has unexpected fields.");
  return item;
}

/** Accept only bounded public plain text, excluding markup, credentials and private PC paths. */
function text(value: unknown, maximum: number, label: string): string {
  if (
    typeof value !== "string" ||
    !value ||
    value.length > maximum ||
    value.trim() !== value ||
    /\p{Cc}/u.test(value) ||
    /<\/?[a-z][^>]*>/iu.test(value) ||
    /(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/u.test(value) ||
    /(?:^|[\s"'(])[A-Za-z]:[\\/]|\/(?:Users|home)\//u.test(value)
  )
    throw new TypeError(label + " must be bounded public plain text.");
  return value;
}

/** Literal URL equality refuses foreign namespaces, query strings, credentials and encoded traversal. */
function exact(value: unknown, expected: string, label: string): string {
  if (value !== expected) throw new TypeError(label + " must match its repository and source.");
  return expected;
}

/** UTC date round-trip rejects normalized impossible dates such as February30. */
function date(value: unknown, label: string): string {
  const result = text(value, 40, label);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|\+00:00)$/u.test(result) ||
    Number.isNaN(Date.parse(result)) ||
    new Date(result).toISOString().slice(0, 19) !== result.slice(0, 19)
  )
    throw new TypeError(label + " must be a real UTC timestamp.");
  return result;
}

/** Bind a completed passing hosted result to the same exact reviewed source revision. */
function verifiedRun(value: unknown, name: string, source: string): DownloadRun {
  const row = object(value, ["name", "sourceCommit", "conclusion", "url"], "Validation run");
  const title = text(row.name, 100, "Workflow name");
  if (row.sourceCommit !== source || row.conclusion !== "success")
    throw new TypeError("Only exact-source passing validation may be published.");
  const url = text(row.url, 250, "Workflow URL");
  if (
    !new RegExp("^https://github\\.com/JasonStys/" + name + "/actions/runs/[1-9][0-9]*$", "u").test(
      url,
    )
  )
    throw new TypeError("Workflow URL must be a direct repository Actions run.");
  return Object.freeze({ name: title, sourceCommit: source, conclusion: "success", url });
}

/** Normalize a finite archive format without claiming that an archive is an installer. */
function archiveKind(value: unknown): DownloadAsset["format"] {
  if (!["zip", "tar.gz", "exe", "msi", "dmg", "appimage", "pyz"].includes(value as string))
    throw new TypeError("Unsupported download format.");
  return value as DownloadAsset["format"];
}

/** Validate the complete fixed20-project release index; no partial or newly invented release is accepted. */
export function validateDownloads(value: unknown): DownloadManifest {
  const envelope = object(
    value,
    ["schemaVersion", "collectedAt", "repositories"],
    "Download manifest",
  );
  if (envelope.schemaVersion !== 1) throw new TypeError("Unsupported download schema.");
  const collectedAt = date(envelope.collectedAt, "collectedAt");
  if (
    !Array.isArray(envelope.repositories) ||
    envelope.repositories.length !== DOWNLOAD_NAMES.length
  )
    throw new TypeError("Downloads must cover exactly the20 existing download projects.");
  const seen = new Set<string>();
  const projects = envelope.repositories.map((raw): ProjectDownload => {
    const row = object(
      raw,
      [
        "name",
        "version",
        "distribution",
        "releaseUrl",
        "publishedAt",
        "sourceCommit",
        "sourceUrl",
        "validationReportUrl",
        "sourceChecks",
        "releaseCheck",
        "acceptanceCheck",
        "assets",
        "requirements",
        "limitations",
      ],
      "Project download",
    );
    const name = text(row.name, 80, "Repository");
    if (!(DOWNLOAD_NAMES as readonly string[]).includes(name) || seen.has(name))
      throw new TypeError("Foreign or duplicate download project.");
    seen.add(name);
    const version = text(row.version, 32, "Version");
    if (!/^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)$/u.test(version))
      throw new TypeError("Expected a stable three-part software version.");
    const source = text(row.sourceCommit, 40, "Source commit");
    if (!SHA.test(source)) throw new TypeError("Expected a full source commit.");
    const repository = OWNER + name;
    const releaseUrl = exact(
      row.releaseUrl,
      repository + "/releases/tag/v" + version,
      "Release URL",
    );
    const sourceUrl = exact(row.sourceUrl, repository + "/tree/" + source, "Source URL");
    const report = text(row.validationReportUrl, 400, "Validation report URL");
    const reportPrefix = repository + "/blob/" + source + "/docs/";
    const reportPath = report.slice(reportPrefix.length);
    if (
      !report.startsWith(reportPrefix) ||
      !/^[A-Za-z0-9_/-]+\.(?:md|json)$/u.test(reportPath) ||
      reportPath.includes("..")
    )
      throw new TypeError("Validation report must bind to the reviewed source docs.");
    const publishedAt = date(row.publishedAt, "publishedAt");
    if (Date.parse(publishedAt) > Date.parse(collectedAt))
      throw new TypeError("A release cannot be published after its observation.");
    const expected = DESKTOP.has(name)
      ? "desktop-app"
      : NATIVE.has(name)
        ? "portable-gui"
        : "cli-zipapp";
    if (row.distribution !== expected)
      throw new TypeError("Incorrect application distribution category.");
    if (
      !Array.isArray(row.sourceChecks) ||
      row.sourceChecks.length < 1 ||
      row.sourceChecks.length > 6
    )
      throw new TypeError("Expected bounded source workflow evidence.");
    const sourceChecks = row.sourceChecks.map((run) => verifiedRun(run, name, source));
    if (new Set(sourceChecks.map((run) => run.name)).size !== sourceChecks.length)
      throw new TypeError("Duplicate source workflow names.");
    const releaseCheck = verifiedRun(row.releaseCheck, name, source);
    let acceptanceCheck: ProjectDownload["acceptanceCheck"] = null;
    if (row.acceptanceCheck !== null) {
      const acceptance = object(
        row.acceptanceCheck,
        [
          "name",
          "verifierSourceCommit",
          "verifierSourceUrl",
          "appSourceCommit",
          "conclusion",
          "url",
        ],
        "Download acceptance",
      );
      const verifier = text(acceptance.verifierSourceCommit, 40, "Verifier source");
      if (!SHA.test(verifier) || acceptance.appSourceCommit !== source)
        throw new TypeError(
          "Download acceptance must identify its verifier and the actual app source.",
        );
      const proof = verifiedRun(
        {
          name: acceptance.name,
          sourceCommit: verifier,
          conclusion: acceptance.conclusion,
          url: acceptance.url,
        },
        name,
        verifier,
      );
      acceptanceCheck = Object.freeze({
        name: proof.name,
        verifierSourceCommit: verifier,
        verifierSourceUrl: exact(
          acceptance.verifierSourceUrl,
          repository + "/tree/" + verifier,
          "Verifier source URL",
        ),
        appSourceCommit: source,
        conclusion: "success",
        url: proof.url,
      });
    }
    if (name === "applicant-evidence-studio" && acceptanceCheck === null)
      throw new TypeError(
        "Applicant download acceptance needs its separately identified verifier source.",
      );
    if (!Array.isArray(row.assets) || !row.assets.length || row.assets.length > 8)
      throw new TypeError("Expected bounded release payloads.");
    const files = new Set<string>();
    const assetKeys = new Set<string>();
    const assets = row.assets.map((rawAsset): DownloadAsset => {
      const asset = object(
        rawAsset,
        [
          "assetName",
          "assetUrl",
          "checksumAssetName",
          "checksumUrl",
          "sha256",
          "byteSize",
          "platform",
          "architecture",
          "format",
          "kind",
        ],
        "Download asset",
      );
      const filename = text(asset.assetName, 180, "Asset name");
      const checksum = text(asset.checksumAssetName, 180, "Checksum asset name");
      if (
        ![filename, checksum].every(
          (part) => /^[A-Za-z0-9][A-Za-z0-9._ +()-]*$/u.test(part) && !part.includes(".."),
        ) ||
        files.has(filename)
      )
        throw new TypeError("Unsafe or duplicate release filename.");
      files.add(filename);
      const base = repository + "/releases/download/v" + version + "/";
      const assetUrl = exact(asset.assetUrl, base + encodeURIComponent(filename), "Asset URL");
      const checksumUrl = exact(
        asset.checksumUrl,
        base + encodeURIComponent(checksum),
        "Checksum URL",
      );
      const digest = text(asset.sha256, 64, "SHA256");
      if (
        !DIGEST.test(digest) ||
        typeof asset.byteSize !== "number" ||
        !Number.isSafeInteger(asset.byteSize) ||
        asset.byteSize < 1 ||
        asset.byteSize > 2_147_483_648
      )
        throw new TypeError("Asset needs an actual positive byte size and SHA256.");
      const format = archiveKind(asset.format);
      const suffix = format === "appimage" ? ".AppImage" : "." + format;
      if (!filename.endsWith(suffix))
        throw new TypeError("Filename extension disagrees with format.");
      const platform = text(asset.platform, 20, "Platform");
      if (!["windows", "linux", "macos", "cross-platform"].includes(platform))
        throw new TypeError("Unsupported platform.");
      const architecture = text(asset.architecture, 25, "Architecture");
      if (!/^[A-Za-z0-9_]+$/u.test(architecture)) throw new TypeError("Invalid architecture.");
      const kind = text(asset.kind, 20, "Package kind");
      if (!["portable", "installer", "zipapp"].includes(kind))
        throw new TypeError("Unknown package kind.");
      const key = [platform, architecture, kind, format].join("/");
      if (assetKeys.has(key)) throw new TypeError("Duplicate platform payload.");
      assetKeys.add(key);
      if (
        expected === "portable-gui" &&
        (kind !== "portable" ||
          platform === "cross-platform" ||
          (platform === "windows" ? format !== "zip" : format !== "tar.gz"))
      )
        throw new TypeError(
          "Native GUI archives must retain their platform-specific portable format.",
        );
      if (
        expected === "cli-zipapp" &&
        (kind !== "zipapp" ||
          format !== "pyz" ||
          platform !== "cross-platform" ||
          architecture !== "any")
      )
        throw new TypeError("Secure delivery is a Python zipapp, not a desktop installer.");
      if (
        expected === "desktop-app" &&
        (platform === "cross-platform" || kind === "zipapp" || format === "pyz")
      )
        throw new TypeError("Desktop application payload must name its actual platform.");
      if (
        expected === "desktop-app" &&
        !(
          platform === "windows"
            ? ["zip", "exe", "msi"]
            : platform === "linux"
              ? ["tar.gz", "appimage"]
              : ["zip", "tar.gz", "dmg"]
        ).includes(format)
      )
        throw new TypeError("Desktop file format does not match its platform.");
      if (["zip", "tar.gz", "appimage"].includes(format) && kind !== "portable")
        throw new TypeError("An extracted portable archive is not an installer.");
      if (["msi", "dmg"].includes(format) && kind !== "installer")
        throw new TypeError("Installable package kind must be explicit.");
      return Object.freeze({
        assetName: filename,
        assetUrl,
        checksumAssetName: checksum,
        checksumUrl,
        sha256: digest,
        byteSize: asset.byteSize,
        platform: platform as DownloadAsset["platform"],
        architecture,
        format,
        kind: kind as DownloadAsset["kind"],
      });
    });
    const requiredPlatforms =
      name === "drone-operations-console" ? ["windows"] : ["windows", "linux", "macos"];
    if (
      expected === "cli-zipapp"
        ? assets.length !== 1
        : !requiredPlatforms.every((platform) =>
            assets.some((asset) => asset.platform === platform),
          )
    )
      throw new TypeError("Missing required platform payloads.");
    const primaryAsset = assets[0];
    if (name === "drone-operations-console") {
      if (assets.length !== 1 || primaryAsset === undefined)
        throw new TypeError(
          "The existing Drone Operations release supplies only its Windows installer.",
        );
      if (
        primaryAsset.platform !== "windows" ||
        primaryAsset.kind !== "installer" ||
        primaryAsset.format !== "exe"
      )
        throw new TypeError(
          "The existing Drone Operations release supplies only its Windows installer.",
        );
    }
    if (expected === "portable-gui" && assets.length !== 3)
      throw new TypeError("Expected one native portable payload per OS.");
    if (
      expected === "desktop-app" &&
      name !== "drone-operations-console" &&
      assets.length !==
        (["code-flow-studio", "business-knowledge-workbench"].includes(name) ? 6 : 3)
    )
      throw new TypeError(
        "Core application payload count must match its reviewed release inventory.",
      );
    const requirements = text(row.requirements, 400, "Runtime requirements");
    if (expected === "cli-zipapp" && !/Python/iu.test(requirements))
      throw new TypeError("Zipapp runtime requirements must identify Python.");
    if (!Array.isArray(row.limitations) || !row.limitations.length || row.limitations.length > 4)
      throw new TypeError("Expected explicit bounded distribution limits.");
    const limitations = row.limitations.map((limit) => text(limit, 400, "Limit"));
    return Object.freeze({
      name,
      version,
      distribution: expected,
      releaseUrl,
      publishedAt,
      sourceCommit: source,
      sourceUrl,
      validationReportUrl: report,
      sourceChecks: Object.freeze(sourceChecks),
      releaseCheck,
      acceptanceCheck,
      assets: Object.freeze(assets),
      requirements,
      limitations: Object.freeze(limitations),
    });
  });
  const order = new Map<string, number>(DOWNLOAD_NAMES.map((name, index) => [name, index]));
  projects.sort((a, b) => {
    const first = order.get(a.name);
    const second = order.get(b.name);
    if (first === undefined || second === undefined)
      throw new TypeError("Validated download project is absent from canonical order.");
    return first - second;
  });
  return Object.freeze({ schemaVersion: 1, collectedAt, repositories: Object.freeze(projects) });
}
