/**
 * @file Checks the independent20-project62-payload download fixture and hostile public metadata boundaries.
 * Functions: required, fixture, payload, project and mutation cases; variables: app/verifier identities.
 * Line locations: docs/CODE_INDEX.md after integration. Synthetic GitHub URLs are not published records.
 */
import { describe, expect, it } from "vitest";
import { DOWNLOAD_NAMES, validateDownloads } from "../../src/lib/downloads";
/** Require an explicitly addressed independent fixture value; never substitute fallback data. */
function required<T>(value: T | null | undefined): T {
  if (value === null || value === undefined)
    throw new Error("Required independent fixture value is missing.");
  return value;
}

const NAMES = [
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
];
const SOURCE = "a".repeat(40);
const VERIFIER = "b".repeat(40);
const DESKTOP = new Set([
  required(NAMES[0]),
  required(NAMES[1]),
  required(NAMES[2]),
  required(NAMES[4]),
  required(NAMES[19]),
]);
/** Build actual independent filename/link/digest fields rather than calling validator internals. */
function payload(name: string, platform: string, format: string, kind: string) {
  const suffix = format === "appimage" ? "AppImage" : format;
  const assetName = `${name}-1.1.0-${platform}.${suffix}`;
  const checksumAssetName =
    name === "secure-delivery-pipeline-lab" ? "release.json" : "SHA256SUMS.txt";
  const base = `https://github.com/JasonStys/${name}/releases/download/v1.1.0/`;
  return {
    assetName,
    assetUrl: base + encodeURIComponent(assetName),
    checksumAssetName,
    checksumUrl: base + checksumAssetName,
    sha256: "c".repeat(64),
    byteSize: 123456,
    platform,
    architecture: platform === "cross-platform" ? "any" : "x64",
    format,
    kind,
  };
}
/** Reflect actual distribution categories/counts, including Windows-only DroneOps and verifier-only AES update. */
function project(name: string) {
  const repository = `https://github.com/JasonStys/${name}`;
  const native = !DESKTOP.has(name) && name !== "secure-delivery-pipeline-lab";
  const zipapp = name === "secure-delivery-pipeline-lab";
  const assets = zipapp
    ? [payload(name, "cross-platform", "pyz", "zipapp")]
    : name === "drone-operations-console"
      ? [payload(name, "windows", "exe", "installer")]
      : [
          payload(name, "windows", "zip", "portable"),
          payload(name, "linux", "tar.gz", "portable"),
          payload(name, "macos", native ? "tar.gz" : "zip", "portable"),
        ];
  if (["code-flow-studio", "business-knowledge-workbench"].includes(name))
    assets.push(
      payload(name, "windows", "exe", "installer"),
      payload(name, "linux", "appimage", "portable"),
      payload(name, "macos", "dmg", "installer"),
    );
  const run = {
    name: "Validation",
    sourceCommit: SOURCE,
    conclusion: "success",
    url: repository + "/actions/runs/101",
  };
  return {
    name,
    version: "1.1.0",
    distribution: zipapp ? "cli-zipapp" : native ? "portable-gui" : "desktop-app",
    releaseUrl: repository + "/releases/tag/v1.1.0",
    publishedAt: "2026-11-09T10:00:00Z",
    sourceCommit: SOURCE,
    sourceUrl: repository + "/tree/" + SOURCE,
    validationReportUrl: repository + "/blob/" + SOURCE + "/docs/reports/VALIDATION.md",
    sourceChecks: [run],
    releaseCheck: { ...run, name: "Portable release", url: repository + "/actions/runs/102" },
    acceptanceCheck:
      name === "applicant-evidence-studio"
        ? {
            name: "Existing download acceptance",
            verifierSourceCommit: VERIFIER,
            verifierSourceUrl: repository + "/tree/" + VERIFIER,
            appSourceCommit: SOURCE,
            conclusion: "success",
            url: repository + "/actions/runs/103",
          }
        : null,
    assets,
    requirements: zipapp
      ? "Python3.12 or later; command-line zipapp."
      : "Use the listed native OS/CPU package.",
    limitations: ["Educational use; portable checks are not clean-machine installation proof."],
  };
}
/** Return detached positive data for each negative boundary; no fixture can mutate another test. */
function fixture() {
  return {
    schemaVersion: 1,
    collectedAt: "2026-11-09T11:00:00Z",
    repositories: NAMES.map(project),
  };
}
type Fixture = ReturnType<typeof fixture>;
type Change = (value: Fixture) => void;
const invalid: [string, Change][] = [
  [
    "partial core payload inventory still covers all three operating systems",
    (v) => {
      required(v.repositories[0]).assets.splice(4, 1);
    },
  ],
  [
    "partial scope",
    (v) => {
      v.repositories.pop();
    },
  ],
  [
    "duplicate repository",
    (v) => {
      required(v.repositories[1]).name = required(v.repositories[0]).name;
    },
  ],
  [
    "unsupported new first release",
    (v) => {
      required(v.repositories[0]).name = "forge2d-engine";
    },
  ],
  [
    "impossible observation date",
    (v) => {
      v.collectedAt = "2026-02-30T11:00:00Z";
    },
  ],
  [
    "private path in text",
    (v) => {
      required(v.repositories[0]).requirements = "C:\\Users\\private\\profile";
    },
  ],
  [
    "markup in limits",
    (v) => {
      required(v.repositories[0]).limitations = ["<script>alert(1)</script>"];
    },
  ],
  [
    "credential in text",
    (v) => {
      required(v.repositories[0]).requirements = "ghp_" + "a".repeat(30);
    },
  ],
  [
    "leading-zero version",
    (v) => {
      required(v.repositories[0]).version = "01.1.0";
    },
  ],
  [
    "short source",
    (v) => {
      required(v.repositories[0]).sourceCommit = "short";
    },
  ],
  [
    "foreign release owner",
    (v) => {
      required(v.repositories[0]).releaseUrl = required(v.repositories[0]).releaseUrl.replace(
        "JasonStys",
        "Other",
      );
    },
  ],
  [
    "moving main source",
    (v) => {
      required(v.repositories[0]).sourceUrl = required(v.repositories[0]).sourceUrl.replace(
        SOURCE,
        "main",
      );
    },
  ],
  [
    "unbound report",
    (v) => {
      required(v.repositories[0]).validationReportUrl = required(
        v.repositories[0],
      ).validationReportUrl.replace(SOURCE, VERIFIER);
    },
  ],
  [
    "release after observation",
    (v) => {
      required(v.repositories[0]).publishedAt = "2026-11-10T10:00:00Z";
    },
  ],
  [
    "wrong package category",
    (v) => {
      required(v.repositories[5]).distribution = "desktop-app";
    },
  ],
  [
    "missing source checks",
    (v) => {
      required(v.repositories[0]).sourceChecks = [];
    },
  ],
  [
    "duplicate source workflow",
    (v) => {
      required(v.repositories[0]).sourceChecks.push(
        required(required(v.repositories[0]).sourceChecks[0]),
      );
    },
  ],
  [
    "nonpassing release",
    (v) => {
      required(v.repositories[0]).releaseCheck.conclusion = "failure";
    },
  ],
  [
    "foreign workflow",
    (v) => {
      required(v.repositories[0]).releaseCheck.url = "https://outside.invalid/check";
    },
  ],
  [
    "release check falsely attributed to verifier",
    (v) => {
      required(v.repositories[4]).releaseCheck.sourceCommit = VERIFIER;
    },
  ],
  [
    "missing AES verifier proof",
    (v) => {
      required(v.repositories[4]).acceptanceCheck = null;
    },
  ],
  [
    "wrong verified app source",
    (v) => {
      required(required(v.repositories[4]).acceptanceCheck).appSourceCommit = VERIFIER;
    },
  ],
  [
    "wrong verifier source URL",
    (v) => {
      required(required(v.repositories[4]).acceptanceCheck).verifierSourceUrl = required(
        v.repositories[4],
      ).sourceUrl;
    },
  ],
  [
    "missing payloads",
    (v) => {
      required(v.repositories[0]).assets = [];
    },
  ],
  [
    "filename traversal",
    (v) => {
      required(required(v.repositories[0]).assets[0]).assetName = "../outside.zip";
    },
  ],
  [
    "foreign checksum",
    (v) => {
      required(required(v.repositories[0]).assets[0]).checksumUrl =
        "https://outside.invalid/checksum";
    },
  ],
  [
    "download token query",
    (v) => {
      required(required(v.repositories[0]).assets[0]).assetUrl += "?token=secret";
    },
  ],
  [
    "short digest",
    (v) => {
      required(required(v.repositories[0]).assets[0]).sha256 = "bad";
    },
  ],
  [
    "fractional byte size",
    (v) => {
      required(required(v.repositories[0]).assets[0]).byteSize = 1.5;
    },
  ],
  [
    "wrong extension",
    (v) => {
      required(required(v.repositories[0]).assets[0]).format = "exe";
    },
  ],
  [
    "unknown format",
    (v) => {
      required(required(v.repositories[0]).assets[0]).format = "deb";
    },
  ],
  [
    "unknown platform",
    (v) => {
      required(required(v.repositories[0]).assets[0]).platform = "universal";
    },
  ],
  [
    "architecture path",
    (v) => {
      required(required(v.repositories[0]).assets[0]).architecture = "../x64";
    },
  ],
  [
    "unknown package kind",
    (v) => {
      required(required(v.repositories[0]).assets[0]).kind = "certified";
    },
  ],
  [
    "duplicate payload",
    (v) => {
      required(v.repositories[0]).assets.push(required(required(v.repositories[0]).assets[0]));
    },
  ],
  [
    "POSIX native ZIP loses links",
    (v) => {
      const p = required(required(v.repositories[5]).assets[1]);
      p.format = "zip";
      p.assetName = p.assetName.replace(".tar.gz", ".zip");
      p.assetUrl = p.assetUrl.replace(".tar.gz", ".zip");
    },
  ],
  [
    "portable ZIP relabelled installer",
    (v) => {
      required(required(v.repositories[0]).assets[0]).kind = "installer";
    },
  ],
  [
    "Windows DMG",
    (v) => {
      const p = required(required(v.repositories[0]).assets[0]);
      p.format = "dmg";
      p.kind = "installer";
      p.assetName = p.assetName.replace(".zip", ".dmg");
      p.assetUrl = p.assetUrl.replace(".zip", ".dmg");
    },
  ],
  [
    "unsupported DroneOps macOS",
    (v) => {
      required(v.repositories[19]).assets.push(
        payload(required(v.repositories[19]).name, "macos", "zip", "portable"),
      );
    },
  ],
  [
    "missing native OS",
    (v) => {
      required(v.repositories[5]).assets.pop();
    },
  ],
  [
    "extra native payload",
    (v) => {
      required(v.repositories[5]).assets.push(
        payload(required(v.repositories[5]).name, "windows", "exe", "installer"),
      );
    },
  ],
  [
    "zipapp has no Python requirement",
    (v) => {
      required(v.repositories[3]).requirements = "No runtime needed.";
    },
  ],
  [
    "zipapp called desktop app",
    (v) => {
      required(v.repositories[3]).distribution = "desktop-app";
    },
  ],
  [
    "empty limits",
    (v) => {
      required(v.repositories[0]).limitations = [];
    },
  ],
];
describe("existing downloadable project contracts", () => {
  it("contains exactly the20 independently enumerated existing projects and62 true payloads", () => {
    expect([...DOWNLOAD_NAMES]).toEqual(NAMES);
    const value = fixture();
    value.repositories.reverse();
    const parsed = validateDownloads(value);
    expect(parsed.repositories.map((p) => p.name)).toEqual(NAMES);
    expect(parsed.repositories.reduce((sum, p) => sum + p.assets.length, 0)).toBe(62);
    expect(
      required(parsed.repositories.find((p) => p.name === "drone-operations-console")).assets.map(
        (a) => a.platform,
      ),
    ).toEqual(["windows"]);
    expect(
      required(
        required(parsed.repositories.find((p) => p.name === "secure-delivery-pipeline-lab"))
          .assets[0],
      ).checksumAssetName,
    ).toBe("release.json");
  });
  it("keeps app/release source separate from the newer AES download verifier source", () => {
    const aes = required(
      validateDownloads(fixture()).repositories.find((p) => p.name === "applicant-evidence-studio"),
    );
    expect(aes.sourceCommit).toBe(SOURCE);
    expect(aes.releaseCheck.sourceCommit).toBe(SOURCE);
    expect(required(aes.acceptanceCheck).verifierSourceCommit).toBe(VERIFIER);
    expect(required(aes.acceptanceCheck).appSourceCommit).toBe(SOURCE);
  });
  it("returns immutable public records without retaining mutable input references", () => {
    const raw = fixture();
    const result = validateDownloads(raw);
    required(required(raw.repositories[0]).assets[0]).sha256 = "d".repeat(64);
    expect(required(required(result.repositories[0]).assets[0]).sha256).toBe("c".repeat(64));
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(required(result.repositories[0]).assets)).toBe(true);
  });
  it.each(invalid)("rejects %s", (_label, mutate) => {
    const value = fixture();
    mutate(value);
    expect(() => validateDownloads(value)).toThrow(TypeError);
  });
  it("rejects unknown private acquisition fields", () => {
    const raw = fixture();
    Object.assign(raw, { archivePath: "private" });
    expect(() => validateDownloads(raw)).toThrow(TypeError);
  });
  it("rejects malformed envelope rather than interpreting partial data", () => {
    for (const value of [
      null,
      [],
      { schemaVersion: 2, collectedAt: "2026-11-09T11:00:00Z", repositories: [] },
    ])
      expect(() => validateDownloads(value)).toThrow(TypeError);
  });
});
