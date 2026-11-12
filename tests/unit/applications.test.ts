/**
 * @file Tests the real66-app manifest and independent malformed source/asset/guide counterexamples.
 * Functions: fixture, application, firstAsset, edit and mutation cases; variables: published catalog.
 * Line locations: docs/CODE_INDEX.md after integration. Tests never acquire or execute a download.
 */
import { describe, expect, it } from "vitest";
import published from "../../src/data/current-applications.json";
import priority from "../../src/data/portfolio-priority.json";
import { APPLICATION_NAMES, validateApplications } from "../../src/lib/applications";

type Fixture = typeof published;
function fixture(): Fixture {
  return structuredClone(published);
}
function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Independent fixture entry is missing.");
  return value;
}
function application(data: Fixture, index = 0) {
  return required(data.applications[index]);
}
function firstAsset(data: Fixture) {
  return required(application(data).assets[0]);
}
function edit(target: object, key: string, value: unknown) {
  Object.assign(target, { [key]: value });
}

describe("the published current application catalog", () => {
  it("retains all66 ordered applications,108 actual payloads and separately bound source/guide identities", () => {
    const result = validateApplications(published);
    expect(result.applications.map((row) => row.name)).toEqual(
      priority.filter((name) => name !== "portfolio-case-study-site"),
    );
    expect(APPLICATION_NAMES).toHaveLength(66);
    expect(result.applications.flatMap((row) => row.assets)).toHaveLength(108);
    const cfs = required(result.applications[0]);
    expect(cfs.version).toBe("0.4.4");
    expect(cfs.runtimeSource).toBe("8a533a0b9838b994c18ec0475d91a4f8db1be6fa");
    expect(cfs.currentSource.commit).toBe("8c029ee5a441bc75b6a3c8d1766df02503ad3b69");
    expect(cfs.guide.publicationSource).toBe(cfs.currentSource.commit);
    expect(cfs.guide.documentSha256).toBe(
      "e48348e5b38561badb0a47d62d7772402c36dd8805a8d2673f376f282ca4c7dd",
    );
  });
  it("preserves the actual DroneOps shared checksum-set name without inventing a per-file sidecar", () => {
    const app = required(
      validateApplications(published).applications.find(
        (row) => row.name === "drone-operations-console",
      ),
    );
    const windows = required(app.assets[0]);
    expect(windows.checksumName).toBe("SHA256SUMS.txt");
    expect(windows.checksumURL).toBe(
      "https://github.com/JasonStys/drone-operations-console/releases/download/v0.3.2/SHA256SUMS.txt",
    );
    expect(windows.architecture).toBe("unspecified");
  });
  it("preserves unspecified architecture and the actual base-name sidecar convention", () => {
    const apps = validateApplications(published).applications;
    expect(
      required(required(apps[0]).assets.find((a) => a.format === "appimage")).architecture,
    ).toBe("unspecified");
    const pim = required(apps.find((row) => row.name === "personal-image-model-studio"));
    expect(
      pim.assets.some(
        (a) => a.checksumName === "PersonalImageModelStudio-0.3.1-windows-amd64.sha256",
      ),
    ).toBe(true);
  });
  it("freezes fresh projected objects without mutating its caller", () => {
    const data = fixture();
    const before = JSON.stringify(data);
    const out = validateApplications(data);
    expect(JSON.stringify(data)).toBe(before);
    expect(out).not.toBe(data);
    for (const value of [
      out,
      out.applications,
      application(out as unknown as Fixture),
      required(out.applications[0]).assets,
      required(out.applications[0]).guide,
      required(out.applications[0]).currentSource.workflows,
    ])
      expect(Object.isFrozen(value)).toBe(true);
  });
  it("allows a later current-main observation while keeping the older approved runtime/guide separate", () => {
    const data = fixture();
    const app = application(data);
    const commit = "1".repeat(40);
    app.currentSource.commit = commit;
    app.currentSource.url = `https://github.com/JasonStys/${app.name}/tree/${commit}`;
    app.currentSource.workflows.forEach((run) => {
      run.sourceCommit = commit;
    });
    const output = required(validateApplications(data).applications[0]);
    expect(output.currentSource.commit).toBe(commit);
    expect(output.guide.runtimeSource).not.toBe(commit);
  });
  it("compares UTC fractions without losing a future microsecond", () => {
    const data = fixture();
    data.collectedAt = "2026-11-12T23:00:00.000001Z";
    application(data).currentSource.observedAt = "2026-11-12T23:00:00.000001+00:00";
    expect(() => validateApplications(data)).not.toThrow();
    application(data).currentSource.observedAt = "2026-11-12T23:00:00.000002Z";
    expect(() => validateApplications(data)).toThrow();
  });
});

const mutations: [string, (data: Fixture) => void][] = [
  [
    "missing repository",
    (d) => {
      d.applications.pop();
    },
  ],
  [
    "duplicate repository",
    (d) => {
      d.applications[1] = structuredClone(application(d));
    },
  ],
  [
    "unknown repository",
    (d) => {
      application(d).name = "foreign-project";
    },
  ],
  [
    "self repository",
    (d) => {
      application(d).name = "portfolio-case-study-site";
    },
  ],
  [
    "changed priority order",
    (d) => {
      const a = required(d.applications[0]);
      d.applications[0] = required(d.applications[1]);
      d.applications[1] = a;
    },
  ],
  ["unknown envelope key", (d) => edit(d, "privatePath", "not-public")],
  ["unsupported schema", (d) => edit(d, "schemaVersion", 2)],
  ["unknown app key", (d) => edit(application(d), "receipt", {})],
  ["unknown asset key", (d) => edit(firstAsset(d), "localFile", "file")],
  ["unknown source key", (d) => edit(application(d).currentSource, "pending", false)],
  [
    "unknown workflow key",
    (d) => edit(required(application(d).currentSource.workflows[0]), "job", 1),
  ],
  ["unknown guide key", (d) => edit(application(d).guide, "backup", true)],
  [
    "empty assets",
    (d) => {
      application(d).assets = [];
    },
  ],
  [
    "too many assets",
    (d) => {
      application(d).assets = Array.from({ length: 7 }, () => structuredClone(firstAsset(d)));
    },
  ],
  [
    "no Windows asset",
    (d) => {
      application(d).assets = application(d).assets.filter((a) => a.platform !== "windows");
    },
  ],
  [
    "duplicate payload",
    (d) => {
      application(d).assets.push(structuredClone(firstAsset(d)));
    },
  ],
  [
    "global payload ID reuse",
    (d) => {
      required(application(d, 1).assets[0]).assetId = firstAsset(d).assetId;
    },
  ],
  [
    "global release ID reuse",
    (d) => {
      application(d, 1).releaseId = application(d).releaseId;
    },
  ],
  [
    "foreign asset host",
    (d) => {
      firstAsset(d).url = firstAsset(d).url.replace("github.com", "github.com.evil.example");
    },
  ],
  [
    "foreign asset owner",
    (d) => {
      firstAsset(d).url = firstAsset(d).url.replace("JasonStys", "another-owner");
    },
  ],
  [
    "asset query",
    (d) => {
      firstAsset(d).url += "?download=1";
    },
  ],
  [
    "asset credential",
    (d) => {
      firstAsset(d).url = firstAsset(d).url.replace("https://", "https://user:secret@");
    },
  ],
  [
    "asset stale version",
    (d) => {
      firstAsset(d).name = firstAsset(d).name.replace("0.4.4", "0.4.3");
    },
  ],
  [
    "unsafe asset path",
    (d) => {
      firstAsset(d).name = "../payload-0.4.4.zip";
    },
  ],
  [
    "unsafe checksum filename",
    (d) => {
      firstAsset(d).checksumName = "../checksums.txt";
    },
  ],
  [
    "foreign checksum link",
    (d) => {
      firstAsset(d).checksumURL = "https://example.com/check.sha256";
    },
  ],
  [
    "wrong checksum release",
    (d) => {
      firstAsset(d).checksumURL = firstAsset(d).checksumURL.replace("v0.4.4", "v0.4.3");
    },
  ],
  [
    "invented checksum for another payload",
    (d) => {
      firstAsset(d).checksumName = "different-0.4.4.sha256";
    },
  ],
  [
    "cross-platform asset",
    (d) => {
      firstAsset(d).platform = "cross-platform";
    },
  ],
  [
    "unrecognized architecture",
    (d) => {
      firstAsset(d).architecture = "any";
    },
  ],
  [
    "filename architecture contradiction",
    (d) => {
      firstAsset(d).architecture = "x64";
    },
  ],
  [
    "unsupported format",
    (d) => {
      firstAsset(d).format = "pyz";
    },
  ],
  [
    "unsupported kind",
    (d) => {
      firstAsset(d).kind = "zipapp";
    },
  ],
  [
    "disk image called installer",
    (d) => {
      firstAsset(d).kind = "installer";
    },
  ],
  [
    "disk image called Windows",
    (d) => {
      firstAsset(d).platform = "windows";
    },
  ],
  [
    "foreign runtime URL",
    (d) => {
      application(d).runtimeSourceUrl = "https://example.com/tree/" + application(d).runtimeSource;
    },
  ],
  [
    "mutable runtime branch",
    (d) => {
      application(d).runtimeSourceUrl =
        `https://github.com/JasonStys/${application(d).name}/tree/main`;
    },
  ],
  [
    "foreign release",
    (d) => {
      application(d).releaseUrl = "https://github.com/JasonStys/foreign/releases/tag/v0.4.4";
    },
  ],
  [
    "prerelease version",
    (d) => {
      application(d).version = "0.4.4-rc1";
    },
  ],
  [
    "leading-zero version",
    (d) => {
      application(d).version = "00.4.4";
    },
  ],
  [
    "short runtime identity",
    (d) => {
      application(d).runtimeSource = "8a533a0";
    },
  ],
  [
    "guide runtime mismatch",
    (d) => {
      application(d).guide.runtimeSource = "b".repeat(40);
    },
  ],
  [
    "guide version mismatch",
    (d) => {
      application(d).guide.version = "0.4.3";
    },
  ],
  [
    "guide repository mismatch",
    (d) => {
      application(d).guide.name = "business-knowledge-workbench";
    },
  ],
  [
    "guide moving publication",
    (d) => {
      application(d).guide.publicationSource = "main";
    },
  ],
  [
    "guide URL incorrectly bound to runtime",
    (d) => {
      application(d).guide.documentUrl = application(d).guide.documentUrl.replace(
        application(d).guide.publicationSource,
        application(d).runtimeSource,
      );
    },
  ],
  [
    "guide foreign host",
    (d) => {
      application(d).guide.documentUrl = application(d).guide.documentUrl.replace(
        "github.com",
        "evil.example",
      );
    },
  ],
  [
    "guide foreign repository URL",
    (d) => {
      application(d).guide.documentUrl = application(d).guide.documentUrl.replace(
        "/code-flow-studio/",
        "/business-knowledge-workbench/",
      );
    },
  ],
  [
    "guide different full publication commit",
    (d) => {
      application(d).guide.publicationSource = "f".repeat(40);
    },
  ],
  [
    "guide traversal",
    (d) => {
      application(d).guide.documentPath = "docs/reports/../private.docx";
    },
  ],
  [
    "guide old edition path",
    (d) => {
      application(d).guide.documentPath = "docs/reports/windows-application-guide-0.4.3.docx";
    },
  ],
  [
    "paired JSON mismatch",
    (d) => {
      application(d).guide.manifestPath = "docs/reports/another.json";
    },
  ],
  [
    "paired JSON URL foreign",
    (d) => {
      application(d).guide.manifestUrl = "https://evil.example/file.json";
    },
  ],
  [
    "guide SHA is a Git hash",
    (d) => {
      application(d).guide.documentSha256 = "a".repeat(40);
    },
  ],
  [
    "guide blob is an SHA256",
    (d) => {
      application(d).guide.documentGitBlob = "a".repeat(64);
    },
  ],
  [
    "manifest short SHA",
    (d) => {
      application(d).guide.manifestSha256 = "bad";
    },
  ],
  [
    "manifest bad Git blob",
    (d) => {
      application(d).guide.manifestGitBlob = "G".repeat(40);
    },
  ],
  [
    "no source workflows",
    (d) => {
      application(d).currentSource.workflows = [];
    },
  ],
  [
    "duplicate source workflow",
    (d) => {
      application(d).currentSource.workflows.push(
        structuredClone(required(application(d).currentSource.workflows[0])),
      );
    },
  ],
  [
    "workflow source mismatch",
    (d) => {
      required(application(d).currentSource.workflows[0]).sourceCommit =
        application(d).runtimeSource;
    },
  ],
  [
    "workflow not passed",
    (d) => {
      required(application(d).currentSource.workflows[0]).conclusion = "failure";
    },
  ],
  [
    "workflow foreign repository",
    (d) => {
      required(application(d).currentSource.workflows[0]).url =
        "https://github.com/JasonStys/foreign/actions/runs/123";
    },
  ],
  [
    "workflow URL query",
    (d) => {
      required(application(d).currentSource.workflows[0]).url += "?attempt=1";
    },
  ],
  [
    "current source URL mismatch",
    (d) => {
      application(d).currentSource.url = application(d).runtimeSourceUrl;
    },
  ],
  [
    "no limitations",
    (d) => {
      application(d).limitations = [];
    },
  ],
  [
    "too many limitations",
    (d) => {
      application(d).limitations = Array.from({ length: 5 }, (_, i) => `Limit ${i}`);
    },
  ],
  [
    "duplicate limitations",
    (d) => {
      const s = required(application(d).limitations[0]);
      application(d).limitations = [s, s];
    },
  ],
  [
    "overlong limitation",
    (d) => {
      application(d).limitations = ["x".repeat(401)];
    },
  ],
  [
    "overlong requirements",
    (d) => {
      application(d).requirements = "x".repeat(351);
    },
  ],
  [
    "overlong start",
    (d) => {
      application(d).start = "x".repeat(301);
    },
  ],
  [
    "overlong exit",
    (d) => {
      application(d).exit = "x".repeat(301);
    },
  ],
  [
    "future publication",
    (d) => {
      application(d).publishedAt = "2099-01-01T00:00:00Z";
    },
  ],
  [
    "future source observation",
    (d) => {
      application(d).currentSource.observedAt = "2099-01-01T00:00:00Z";
    },
  ],
  [
    "normalized impossible calendar date",
    (d) => {
      d.collectedAt = "2026-02-30T00:00:00Z";
    },
  ],
  [
    "local timezone",
    (d) => {
      d.collectedAt = "2026-11-12T00:00:00-08:00";
    },
  ],
  [
    "malformed date",
    (d) => {
      application(d).publishedAt = "yesterday";
    },
  ],
];
describe("independent metadata refusals", () => {
  it.each(mutations)("refuses %s", (_label, mutate) => {
    const data = fixture();
    mutate(data);
    expect(() => validateApplications(data)).toThrow(TypeError);
  });
  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, true, "42"])(
    "refuses malformed positive IDs/bytes %s",
    (value) => {
      for (const [where, key] of [
        [firstAsset, "assetId"],
        [firstAsset, "byteSize"],
        [application, "releaseId"],
        [(d: Fixture) => application(d).guide, "documentByteSize"],
        [(d: Fixture) => application(d).guide, "manifestByteSize"],
      ] as const) {
        const data = fixture();
        edit(where(data), key, value);
        expect(() => validateApplications(data)).toThrow(TypeError);
      }
    },
  );
  it.each([
    "<script>alert(1)</script>",
    "[link](https://example.com)",
    "`code`",
    "hidden\u202etext",
    "C:\\Users\\owner\\profile",
    "\\\\server\\share",
    "/home/person/profile",
    "%LOCALAPPDATA%/private",
    "ghp_" + "a".repeat(24),
    "password=pretend-secret",
    " leading",
    "trailing ",
    "line\nfeed",
    "",
  ])("refuses unsafe prose %s", (value) => {
    const data = fixture();
    application(data).summary = value;
    expect(() => validateApplications(data)).toThrow(TypeError);
  });
  it.each([null, [], 42, "manifest"])("refuses non-record input %s", (value) => {
    expect(() => validateApplications(value)).toThrow(TypeError);
  });
  it("refuses inherited, accessor and symbolic public fields without running their getter", () => {
    const data = fixture();
    const inherited = Object.create(application(data)) as unknown;
    edit(data.applications, "0", inherited);
    expect(() => validateApplications(data)).toThrow(TypeError);
    const second = fixture();
    let reads = 0;
    Object.defineProperty(application(second), "name", {
      enumerable: true,
      get() {
        reads++;
        return "code-flow-studio";
      },
    });
    expect(() => validateApplications(second)).toThrow(TypeError);
    expect(reads).toBe(0);
    const third = fixture();
    Object.assign(application(third), { [Symbol("private")]: true });
    expect(() => validateApplications(third)).toThrow(TypeError);
  });
  it("refuses sparse arrays and unknown attached array fields", () => {
    const data = fixture();
    Reflect.deleteProperty(data.applications, "0");
    expect(() => validateApplications(data)).toThrow(TypeError);
    const other = fixture();
    edit(other.applications, "extra", true);
    expect(() => validateApplications(other)).toThrow(TypeError);
    const limits = fixture();
    Reflect.deleteProperty(application(limits).limitations, "0");
    expect(() => validateApplications(limits)).toThrow(TypeError);
  });
  it("refuses an accessor array entry without evaluating it", () => {
    const data = fixture();
    let reads = 0;
    Object.defineProperty(data.applications, "0", {
      enumerable: true,
      get() {
        reads++;
        return application(fixture());
      },
    });
    expect(() => validateApplications(data)).toThrow(TypeError);
    expect(reads).toBe(0);
  });
});
