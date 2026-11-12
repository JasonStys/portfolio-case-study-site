/**
 * @file Tests the separate hub-delivery contract with entirely fictional, inert release evidence.
 * Functions: syntheticFixture, required, asset, workflow, edit and independent refusal cases.
 * Variables: fake version/IDs/digests/times; none are published metadata or acquisition instructions.
 * Line locations: see docs/CODE_INDEX.md. No network, downloads, real profiles or public-data writes.
 */
import { describe, expect, it } from "vitest";
import { validatePortfolioDelivery } from "../../src/lib/portfolio-delivery";

const SYNTHETIC_REPOSITORY = "https://github.com/JasonStys/portfolio-case-study-site";
const SYNTHETIC_RUNTIME = "a".repeat(40);
const SYNTHETIC_GUIDE = "b".repeat(40);

/** Every value is a fictional test identity; the fixture is independent of public release data. */
function syntheticFixture() {
  const version = "9.8.7";
  const names = [
    "Jason-Stys-Portfolio-9.8.7-windows-x64.zip",
    "Jason-Stys-Portfolio-9.8.7-windows-x64.zip.sha256",
    "package-integrity.json",
    "LICENSE.txt",
    "INSTALL.txt",
  ];
  const roles = [
    "windows-archive",
    "archive-checksum",
    "package-evidence",
    "license",
    "instructions",
  ];
  const documentPath = "docs/reports/windows-application-guide-9.8.7.docx";
  const manifestPath = "docs/reports/windows-application-guide-9.8.7.json";
  const validationReportPath = "docs/reports/portfolio-application-9.8.7-2001-02-03.md";
  const guideBase = `${SYNTHETIC_REPOSITORY}/blob/${SYNTHETIC_GUIDE}/`;
  return {
    schemaVersion: 1,
    delivery: {
      version,
      runtimeSource: SYNTHETIC_RUNTIME,
      runtimeSourceUrl: `${SYNTHETIC_REPOSITORY}/tree/${SYNTHETIC_RUNTIME}`,
      releaseId: 900_001,
      releaseUrl: `${SYNTHETIC_REPOSITORY}/releases/tag/v${version}`,
      publishedAt: "2001-02-01T00:00:00Z",
      collectedAt: "2001-02-03T04:05:06.000002Z",
      assets: names.map((name, index) => ({
        role: required(roles[index]),
        name,
        url: `${SYNTHETIC_REPOSITORY}/releases/download/v${version}/${name}`,
        assetId: 910_001 + index,
        byteSize: 4_096 + index,
        sha256: String(index + 1).repeat(64),
      })),
      sourceChecks: {
        observedAt: "2001-02-03T04:05:06.000001Z",
        workflows: [
          ["Synthetic source validation", ".github/workflows/ci.yml"],
          ["Synthetic source analysis", ".github/workflows/codeql.yml"],
          ["Synthetic portable acceptance", ".github/workflows/native-app.yml"],
        ].map(([name, path], index) => ({
          name: required(name),
          path: required(path),
          url: `${SYNTHETIC_REPOSITORY}/actions/runs/${920_001 + index}`,
          sourceCommit: SYNTHETIC_RUNTIME,
          conclusion: "success",
        })),
      },
      guide: {
        name: "portfolio-case-study-site",
        version,
        runtimeSource: SYNTHETIC_RUNTIME,
        publicationSource: SYNTHETIC_GUIDE,
        documentPath,
        documentSha256: "c".repeat(64),
        documentGitBlob: "d".repeat(40),
        documentByteSize: 12_345,
        documentUrl: guideBase + documentPath,
        manifestPath,
        manifestSha256: "e".repeat(64),
        manifestGitBlob: "f".repeat(40),
        manifestByteSize: 1_234,
        manifestUrl: guideBase + manifestPath,
        validationReportPath,
        validationReportUrl: guideBase + validationReportPath,
        validationReportSha256: "6".repeat(64),
        validationReportGitBlob: "7".repeat(40),
        validationReportByteSize: 5_678,
      },
    },
  };
}

type Fixture = ReturnType<typeof syntheticFixture>;

function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("An independent synthetic fixture entry is missing.");
  return value;
}
function asset(data: Fixture, index = 0) {
  return required(data.delivery.assets[index]);
}
function workflow(data: Fixture, index = 0) {
  return required(data.delivery.sourceChecks.workflows[index]);
}
function edit(target: object, key: PropertyKey, value: unknown) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
}

describe("the independent portfolio delivery record", () => {
  it("keeps null evidence explicit without inventing an application or guide", () => {
    const input = { schemaVersion: 1, delivery: null };
    const output = validatePortfolioDelivery(input);
    expect(output).toEqual(input);
    expect(output).not.toBe(input);
    expect(Object.isFrozen(output)).toBe(true);
  });

  it("binds exactly one Windows archive and four ordered supporting assets", () => {
    const input = syntheticFixture();
    const delivery = required(validatePortfolioDelivery(input).delivery ?? undefined);
    expect(delivery.assets.map((row) => [row.role, row.name])).toEqual([
      ["windows-archive", "Jason-Stys-Portfolio-9.8.7-windows-x64.zip"],
      ["archive-checksum", "Jason-Stys-Portfolio-9.8.7-windows-x64.zip.sha256"],
      ["package-evidence", "package-integrity.json"],
      ["license", "LICENSE.txt"],
      ["instructions", "INSTALL.txt"],
    ]);
    expect(delivery.assets.filter((row) => row.role === "windows-archive")).toHaveLength(1);
    expect(delivery.assets).toEqual(input.delivery.assets);
    expect(delivery.releaseId).toBe(900_001);
    expect(delivery.sourceChecks.workflows.map((row) => row.path)).toEqual([
      ".github/workflows/ci.yml",
      ".github/workflows/codeql.yml",
      ".github/workflows/native-app.yml",
    ]);
    expect(
      delivery.sourceChecks.workflows.every((row) => row.sourceCommit === SYNTHETIC_RUNTIME),
    ).toBe(true);
    expect(delivery.guide.runtimeSource).toBe(SYNTHETIC_RUNTIME);
    expect(delivery.guide.publicationSource).toBe(SYNTHETIC_GUIDE);
    expect(delivery.guide.publicationSource).not.toBe(delivery.runtimeSource);
    for (const url of [
      delivery.guide.documentUrl,
      delivery.guide.manifestUrl,
      delivery.guide.validationReportUrl,
    ])
      expect(url).toContain(`/blob/${SYNTHETIC_GUIDE}/`);
  });

  it("preserves a later guide revision and its matching Word/pair/report paths", () => {
    const data = syntheticFixture();
    const guide = data.delivery.guide;
    guide.documentPath = "docs/reports/windows-application-guide-9.8.7-r2.docx";
    guide.manifestPath = "docs/reports/windows-application-guide-9.8.7-r2.json";
    guide.documentUrl = `${SYNTHETIC_REPOSITORY}/blob/${SYNTHETIC_GUIDE}/${guide.documentPath}`;
    guide.manifestUrl = `${SYNTHETIC_REPOSITORY}/blob/${SYNTHETIC_GUIDE}/${guide.manifestPath}`;
    expect(validatePortfolioDelivery(data).delivery?.guide).toEqual(guide);
  });

  it("admits the explicitly supported unversioned current Word path without guessing a Markdown name", () => {
    const data = syntheticFixture();
    const guide = data.delivery.guide;
    guide.documentPath = "docs/reports/windows-application-guide.docx";
    guide.manifestPath = "docs/reports/windows-application-guide.json";
    guide.documentUrl = `${SYNTHETIC_REPOSITORY}/blob/${SYNTHETIC_GUIDE}/${guide.documentPath}`;
    guide.manifestUrl = `${SYNTHETIC_REPOSITORY}/blob/${SYNTHETIC_GUIDE}/${guide.manifestPath}`;
    expect(validatePortfolioDelivery(data).delivery?.guide.validationReportPath).toBe(
      "docs/reports/portfolio-application-9.8.7-2001-02-03.md",
    );
  });

  it("compares microseconds and equivalent UTC suffixes without losing a future observation", () => {
    const data = syntheticFixture();
    data.delivery.publishedAt = "2001-02-03T04:05:06.000002+00:00";
    data.delivery.sourceChecks.observedAt = "2001-02-03T04:05:06.000002Z";
    expect(() => validatePortfolioDelivery(data)).not.toThrow();
    data.delivery.sourceChecks.observedAt = "2001-02-03T04:05:06.000003Z";
    expect(() => validatePortfolioDelivery(data)).toThrow(/cannot follow collection/);
  });

  it("freezes fresh nested records and never mutates or retains mutable input objects", () => {
    const input = syntheticFixture();
    const before = structuredClone(input);
    const output = validatePortfolioDelivery(input);
    const delivery = required(output.delivery ?? undefined);
    expect(input).toEqual(before);
    expect(output).not.toBe(input);
    expect(delivery).not.toBe(input.delivery);
    expect(delivery.assets).not.toBe(input.delivery.assets);
    expect(delivery.guide).not.toBe(input.delivery.guide);
    for (const value of [
      output,
      delivery,
      delivery.assets,
      ...delivery.assets,
      delivery.sourceChecks,
      delivery.sourceChecks.workflows,
      ...delivery.sourceChecks.workflows,
      delivery.guide,
    ])
      expect(Object.isFrozen(value)).toBe(true);
    expect(Reflect.set(delivery, "version", "0.0.0")).toBe(false);
    asset(input).sha256 = "6".repeat(64);
    workflow(input).name = "Changed only the caller";
    input.delivery.guide.documentSha256 = "7".repeat(64);
    expect(required(delivery.assets[0]).sha256).toBe("1".repeat(64));
    expect(required(delivery.sourceChecks.workflows[0]).name).toBe("Synthetic source validation");
    expect(delivery.guide.documentSha256).toBe("c".repeat(64));
  });

  it("allows null-prototype own-data records while rejecting inherited data separately", () => {
    const data = syntheticFixture();
    for (const target of [
      data,
      data.delivery,
      ...data.delivery.assets,
      data.delivery.sourceChecks,
      ...data.delivery.sourceChecks.workflows,
      data.delivery.guide,
    ])
      Object.setPrototypeOf(target, null);
    expect(validatePortfolioDelivery(data).delivery?.version).toBe("9.8.7");
  });
});

const mutations: [string, (data: Fixture) => void][] = [
  ["unknown envelope field", (d) => edit(d, "privateReceipt", "synthetic")],
  ["missing delivery field", (d) => Reflect.deleteProperty(d, "delivery")],
  ["unsupported schema", (d) => edit(d, "schemaVersion", 2)],
  ["boolean schema", (d) => edit(d, "schemaVersion", true)],
  ["unknown delivery field", (d) => edit(d.delivery, "profilePath", "synthetic")],
  ["missing runtime identity", (d) => Reflect.deleteProperty(d.delivery, "runtimeSource")],
  ["short runtime hash", (d) => (d.delivery.runtimeSource = "a".repeat(12))],
  ["uppercase runtime hash", (d) => (d.delivery.runtimeSource = "A".repeat(40))],
  ["nonhex runtime hash", (d) => (d.delivery.runtimeSource = "z".repeat(40))],
  [
    "moving main runtime URL",
    (d) => (d.delivery.runtimeSourceUrl = `${SYNTHETIC_REPOSITORY}/tree/main`),
  ],
  [
    "foreign runtime repository",
    (d) =>
      (d.delivery.runtimeSourceUrl = `https://github.com/other/project/tree/${SYNTHETIC_RUNTIME}`),
  ],
  [
    "foreign release host",
    (d) => (d.delivery.releaseUrl = "https://example.org/releases/tag/v9.8.7"),
  ],
  [
    "release version alias",
    (d) => (d.delivery.releaseUrl = `${SYNTHETIC_REPOSITORY}/releases/latest`),
  ],
  ["prerelease version", (d) => (d.delivery.version = "9.8.7-rc.1")],
  ["leading zero version", (d) => (d.delivery.version = "09.8.7")],
  ["short version", (d) => (d.delivery.version = "9.8")],
  [
    "missing asset",
    (d) => {
      d.delivery.assets.pop();
    },
  ],
  [
    "extra asset",
    (d) => {
      d.delivery.assets.push(structuredClone(asset(d)));
    },
  ],
  ["unknown asset field", (d) => edit(asset(d), "downloadedFile", "synthetic")],
  ["missing asset digest", (d) => Reflect.deleteProperty(asset(d), "sha256")],
  ["duplicated provider asset ID", (d) => (asset(d, 1).assetId = asset(d).assetId)],
  ["duplicated role", (d) => (asset(d, 1).role = asset(d).role)],
  [
    "reordered asset roles",
    (d) => {
      d.delivery.assets.reverse();
    },
  ],
  ["renamed source archive as payload", (d) => (asset(d).name = "Source-9.8.7.zip")],
  ["wrong checksum companion", (d) => (asset(d, 1).name = "SHA256SUMS.txt")],
  ["duplicated asset URL", (d) => (asset(d, 1).url = asset(d).url)],
  [
    "asset moving source URL",
    (d) => (asset(d).url = `${SYNTHETIC_REPOSITORY}/archive/refs/heads/main.zip`),
  ],
  [
    "foreign asset repository",
    (d) => (asset(d).url = asset(d).url.replace("JasonStys", "OtherOwner")),
  ],
  ["asset URL query alias", (d) => (asset(d).url += "?download=1")],
  [
    "asset encoded path alias",
    (d) => (asset(d).url = asset(d).url.replace("windows", "%77indows")),
  ],
  ["asset short digest", (d) => (asset(d).sha256 = "1".repeat(12))],
  ["asset nonhex digest", (d) => (asset(d).sha256 = "q".repeat(64))],
  ["unknown source-check field", (d) => edit(d.delivery.sourceChecks, "privateLog", "synthetic")],
  [
    "missing workflow",
    (d) => {
      d.delivery.sourceChecks.workflows.pop();
    },
  ],
  [
    "extra workflow",
    (d) => {
      d.delivery.sourceChecks.workflows.push(structuredClone(workflow(d)));
    },
  ],
  ["unknown workflow field", (d) => edit(workflow(d), "jobToken", "synthetic")],
  ["missing workflow path", (d) => Reflect.deleteProperty(workflow(d), "path")],
  ["duplicate workflow path", (d) => (workflow(d, 1).path = workflow(d).path)],
  ["duplicate workflow URL", (d) => (workflow(d, 1).url = workflow(d).url)],
  ["unsupported workflow path", (d) => (workflow(d).path = ".github/workflows/unreviewed.yml")],
  [
    "foreign workflow repository",
    (d) => (workflow(d).url = "https://github.com/other/project/actions/runs/920001"),
  ],
  ["workflow zero ID", (d) => (workflow(d).url = `${SYNTHETIC_REPOSITORY}/actions/runs/0`)],
  ["workflow query alias", (d) => (workflow(d).url += "?attempt=2")],
  ["workflow wrong runtime commit", (d) => (workflow(d).sourceCommit = SYNTHETIC_GUIDE)],
  ["workflow nonpassing conclusion", (d) => (workflow(d).conclusion = "failure")],
  ["private workflow-name path", (d) => (workflow(d).name = "Z:" + "/private/example")],
  ["credential-shaped workflow name", (d) => (workflow(d).name = "ghp_" + "x".repeat(24))],
  ["markup in workflow name", (d) => (workflow(d).name = "<strong>Synthetic</strong>")],
  ["control in workflow name", (d) => (workflow(d).name = "Synthetic\u0000run")],
  ["empty workflow name", (d) => (workflow(d).name = "")],
  ["padded workflow name", (d) => (workflow(d).name = " Synthetic ")],
  ["oversize workflow name", (d) => (workflow(d).name = "x".repeat(121))],
  ["unknown guide field", (d) => edit(d.delivery.guide, "renderDirectory", "synthetic")],
  ["missing guide report", (d) => Reflect.deleteProperty(d.delivery.guide, "validationReportPath")],
  ["wrong guide repository", (d) => (d.delivery.guide.name = "another-project")],
  ["guide mismatched version", (d) => (d.delivery.guide.version = "9.8.6")],
  ["guide mismatched runtime", (d) => (d.delivery.guide.runtimeSource = SYNTHETIC_GUIDE)],
  [
    "guide publication equals runtime",
    (d) => (d.delivery.guide.publicationSource = SYNTHETIC_RUNTIME),
  ],
  ["guide moving publication", (d) => (d.delivery.guide.publicationSource = "main")],
  [
    "guide old Word version",
    (d) => (d.delivery.guide.documentPath = "docs/reports/windows-application-guide-9.8.6.docx"),
  ],
  [
    "guide traversal",
    (d) => (d.delivery.guide.documentPath = "docs/reports/../windows-application-guide.docx"),
  ],
  [
    "guide zero revision",
    (d) => (d.delivery.guide.documentPath = "docs/reports/windows-application-guide-9.8.7-r0.docx"),
  ],
  [
    "guide wrong file type",
    (d) => (d.delivery.guide.documentPath = "docs/reports/windows-application-guide-9.8.7.docm"),
  ],
  [
    "guide wrong paired JSON",
    (d) => (d.delivery.guide.manifestPath = "docs/reports/different.json"),
  ],
  [
    "guide foreign Word URL",
    (d) =>
      (d.delivery.guide.documentUrl = d.delivery.guide.documentUrl.replace(
        "github.com",
        "example.org",
      )),
  ],
  [
    "guide runtime used as Word publication",
    (d) =>
      (d.delivery.guide.documentUrl = d.delivery.guide.documentUrl.replace(
        SYNTHETIC_GUIDE,
        SYNTHETIC_RUNTIME,
      )),
  ],
  [
    "guide moving JSON URL",
    (d) =>
      (d.delivery.guide.manifestUrl = d.delivery.guide.manifestUrl.replace(
        SYNTHETIC_GUIDE,
        "main",
      )),
  ],
  [
    "guide report wrong source",
    (d) =>
      (d.delivery.guide.validationReportUrl = d.delivery.guide.validationReportUrl.replace(
        SYNTHETIC_GUIDE,
        SYNTHETIC_RUNTIME,
      )),
  ],
  ["guide report URL wrong path", (d) => (d.delivery.guide.validationReportUrl += "-other")],
  [
    "guide report traversal",
    (d) => (d.delivery.guide.validationReportPath = "docs/reports/../synthetic.md"),
  ],
  [
    "guide report wrong extension",
    (d) => (d.delivery.guide.validationReportPath = "docs/reports/synthetic.json"),
  ],
  [
    "guide report nested directory",
    (d) => (d.delivery.guide.validationReportPath = "docs/reports/nested/synthetic.md"),
  ],
  ["guide document digest short", (d) => (d.delivery.guide.documentSha256 = "c".repeat(12))],
  ["guide manifest digest uppercase", (d) => (d.delivery.guide.manifestSha256 = "E".repeat(64))],
  ["guide document Git blob short", (d) => (d.delivery.guide.documentGitBlob = "d".repeat(12))],
  ["guide manifest Git blob nonhex", (d) => (d.delivery.guide.manifestGitBlob = "z".repeat(40))],
  ["guide report digest short", (d) => (d.delivery.guide.validationReportSha256 = "6".repeat(12))],
  [
    "guide report Git blob nonhex",
    (d) => (d.delivery.guide.validationReportGitBlob = "z".repeat(40)),
  ],
];

describe("independent malformed delivery evidence", () => {
  it.each(mutations)("refuses %s", (_name, mutate) => {
    const data = syntheticFixture();
    mutate(data);
    expect(() => validatePortfolioDelivery(data)).toThrow(TypeError);
  });

  const integerFields: [string, (data: Fixture) => object, string][] = [
    ["release ID", (d) => d.delivery, "releaseId"],
    ["asset ID", (d) => asset(d), "assetId"],
    ["asset bytes", (d) => asset(d), "byteSize"],
    ["Word bytes", (d) => d.delivery.guide, "documentByteSize"],
    ["JSON bytes", (d) => d.delivery.guide, "manifestByteSize"],
    ["report bytes", (d) => d.delivery.guide, "validationReportByteSize"],
  ];
  for (const [name, target, key] of integerFields)
    it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, true, "1", null])(
      `refuses invalid ${name}: %s`,
      (value) => {
        const data = syntheticFixture();
        edit(target(data), key, value);
        expect(() => validatePortfolioDelivery(data)).toThrow(TypeError);
      },
    );

  for (const key of ["publishedAt", "collectedAt", "observedAt"])
    it.each([
      "2001-02-30T00:00:00Z",
      "2001-02-03T25:00:00Z",
      "2001-02-03T04:05:06",
      "2001-02-03T04:05:06+01:00",
      "2001-02-03T04:05:06.1234567Z",
      "not-a-time",
      true,
    ])(`refuses malformed ${key}: %s`, (value) => {
      const data = syntheticFixture();
      edit(key === "observedAt" ? data.delivery.sourceChecks : data.delivery, key, value);
      expect(() => validatePortfolioDelivery(data)).toThrow(TypeError);
    });

  it("refuses publication after the collection even by one microsecond", () => {
    const data = syntheticFixture();
    data.delivery.publishedAt = "2001-02-03T04:05:06.000003Z";
    expect(() => validatePortfolioDelivery(data)).toThrow(/cannot follow collection/);
  });

  it.each([null, [], true, 42, "unknown"])("refuses non-record envelope %s", (input) => {
    expect(() => validatePortfolioDelivery(input)).toThrow(TypeError);
  });

  it.each([undefined, [], true, 42, "unknown"])("refuses unknown delivery value %s", (input) => {
    expect(() => validatePortfolioDelivery({ schemaVersion: 1, delivery: input })).toThrow(
      TypeError,
    );
  });

  it("does not accept unknown fields even for explicitly null evidence", () => {
    expect(() =>
      validatePortfolioDelivery({ schemaVersion: 1, delivery: null, inventedRelease: true }),
    ).toThrow(TypeError);
  });
});

describe("own-data and dense collection boundaries", () => {
  for (const name of ["assets", "workflows"])
    it(`refuses a genuine ${name} array with an inherited method getter before invoking it`, () => {
      const data = syntheticFixture();
      const collection =
        name === "assets" ? data.delivery.assets : data.delivery.sourceChecks.workflows;
      const prototype = Object.create(Array.prototype) as object;
      let reads = 0;
      Object.defineProperty(prototype, "map", {
        get() {
          reads++;
          return Array.prototype.map;
        },
      });
      Object.setPrototypeOf(collection, prototype);
      let refusal: unknown;
      try {
        validatePortfolioDelivery(data);
      } catch (error) {
        refusal = error;
      }
      expect(reads).toBe(0);
      expect(refusal).toBeInstanceOf(TypeError);
    });

  it("refuses inherited records at every nested public record boundary", () => {
    for (const name of ["envelope", "delivery", "asset", "source", "workflow", "guide"]) {
      const data = syntheticFixture();
      const inherit = (value: object) => Object.create(value) as object;
      let input: unknown = data;
      if (name === "envelope") input = inherit(data);
      if (name === "delivery") edit(data, "delivery", inherit(data.delivery));
      if (name === "asset") edit(data.delivery.assets, "0", inherit(asset(data)));
      if (name === "source")
        edit(data.delivery, "sourceChecks", inherit(data.delivery.sourceChecks));
      if (name === "workflow")
        edit(data.delivery.sourceChecks.workflows, "0", inherit(workflow(data)));
      if (name === "guide") edit(data.delivery, "guide", inherit(data.delivery.guide));
      expect(() => validatePortfolioDelivery(input), name).toThrow(TypeError);
    }
  });

  it("refuses symbol fields and accessors without evaluating their values", () => {
    const symbolic = syntheticFixture();
    edit(symbolic.delivery, Symbol("private"), "inert");
    expect(() => validatePortfolioDelivery(symbolic)).toThrow(TypeError);
    for (const where of [
      (d: Fixture) => ({ target: d as object, key: "delivery" }),
      (d: Fixture) => ({ target: d.delivery as object, key: "version" }),
      (d: Fixture) => ({ target: asset(d) as object, key: "name" }),
      (d: Fixture) => ({ target: d.delivery.guide as object, key: "documentPath" }),
    ]) {
      const data = syntheticFixture();
      const { target, key } = where(data);
      let reads = 0;
      Object.defineProperty(target, key, {
        enumerable: true,
        get() {
          reads++;
          throw new Error("An untrusted field getter must not run.");
        },
      });
      expect(() => validatePortfolioDelivery(data)).toThrow(TypeError);
      expect(reads).toBe(0);
    }
  });

  for (const name of ["assets", "workflows"])
    it(`refuses sparse, extra-field, inherited and accessor ${name} arrays`, () => {
      const collection = (data: Fixture) =>
        name === "assets" ? data.delivery.assets : data.delivery.sourceChecks.workflows;
      const sparse = syntheticFixture();
      Reflect.deleteProperty(collection(sparse), "1");
      expect(() => validatePortfolioDelivery(sparse)).toThrow(TypeError);
      const extra = syntheticFixture();
      edit(collection(extra), "extra", "inert");
      expect(() => validatePortfolioDelivery(extra)).toThrow(TypeError);
      const inherited = syntheticFixture();
      const original = collection(inherited);
      const target = name === "assets" ? inherited.delivery : inherited.delivery.sourceChecks;
      edit(target, name, Object.create(original));
      expect(() => validatePortfolioDelivery(inherited)).toThrow(TypeError);
      const accessor = syntheticFixture();
      let reads = 0;
      Object.defineProperty(collection(accessor), "0", {
        enumerable: true,
        get() {
          reads++;
          throw new Error("An array element getter must not run.");
        },
      });
      expect(() => validatePortfolioDelivery(accessor)).toThrow(TypeError);
      expect(reads).toBe(0);
    });
});
