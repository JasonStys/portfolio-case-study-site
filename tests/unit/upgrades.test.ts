/**
 * @file Tests exact catalog coverage, immutable source identity and public-only evidence schema.
 * Functions: changed, validateUpgrades cases and projectUpgrade lookup assertions.
 * Variables: independent invalid mutations of the reviewed manifest, including hostile URL boundaries.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import raw from "@/data/project-upgrades.json";
import { projects } from "@/lib/catalog";
import { projectUpgrade, upgradeManifest, validateUpgrades } from "@/lib/upgrades";

type Mutation = (record: Record<string, unknown>, envelope: Record<string, unknown>) => void;
function changed(mutate: Mutation): unknown {
  const copy = structuredClone(raw);
  const first = copy.repositories[0];
  if (!first) throw new Error("Independent fixture requires an evidence record.");
  mutate(first, copy);
  return copy;
}

const invalid: [string, Mutation][] = [
  [
    "unknown envelope fields",
    (_r, e) => {
      e.privateArchive = "not public";
    },
  ],
  [
    "missing envelope fields",
    (_r, e) => {
      delete e.scope;
    },
  ],
  [
    "schema version",
    (_r, e) => {
      e.schemaVersion = 2;
    },
  ],
  [
    "invalid timestamp",
    (_r, e) => {
      e.collectedAt = "not a timestamp";
    },
  ],
  [
    "impossible calendar date",
    (_r, e) => {
      e.collectedAt = "2026-02-30T01:00:00Z";
    },
  ],
  [
    "non-UTC timestamp",
    (_r, e) => {
      e.collectedAt = "2026-11-09T01:00:00-08:00";
    },
  ],
  [
    "non-string timestamp",
    (_r, e) => {
      e.collectedAt = 0;
    },
  ],
  [
    "unexpected scope",
    (_r, e) => {
      e.scope = "All repositories are production certified";
    },
  ],
  [
    "missing project",
    (_r, e) => {
      e.repositories = raw.repositories.slice(1);
    },
  ],
  [
    "non-array records",
    (_r, e) => {
      e.repositories = {};
    },
  ],
  [
    "extra project",
    (_r, e) => {
      e.repositories = [...raw.repositories, raw.repositories[0]];
    },
  ],
  [
    "null project",
    (_r, e) => {
      e.repositories = [null, ...raw.repositories.slice(1)];
    },
  ],
  [
    "duplicate project",
    (r, e) => {
      e.repositories = [r, r, ...raw.repositories.slice(2)];
    },
  ],
  [
    "unknown project",
    (r) => {
      r.name = "foreign-project";
    },
  ],
  [
    "hub self-verification",
    (r) => {
      r.name = "portfolio-case-study-site";
    },
  ],
  [
    "unknown private record",
    (r) => {
      r.localPath = "private";
    },
  ],
  [
    "missing required field",
    (r) => {
      delete r.summary;
    },
  ],
  [
    "short source SHA",
    (r) => {
      r.sourceCommit = "a".repeat(39);
    },
  ],
  [
    "nonhex source SHA",
    (r) => {
      r.sourceCommit = "z".repeat(40);
    },
  ],
  [
    "floating source tree",
    (r) => {
      r.sourceUrl = `https://github.com/JasonStys/${String(r.name)}/tree/main`;
    },
  ],
  [
    "foreign source repo",
    (r) => {
      r.sourceUrl = `https://github.com/JasonStys/other/tree/${String(r.sourceCommit)}`;
    },
  ],
  [
    "source query",
    (r) => {
      r.sourceUrl = String(r.sourceUrl) + "?private=true";
    },
  ],
  [
    "review host wildcard",
    (r) => {
      r.reviewUrl = String(r.reviewUrl).replace("github.com", "githubXcom");
    },
  ],
  [
    "foreign review",
    (r) => {
      r.reviewUrl = "https://github.com/Other/private/pull/2";
    },
  ],
  [
    "review fragment",
    (r) => {
      r.reviewUrl = String(r.reviewUrl) + "#comment";
    },
  ],
  [
    "floating report",
    (r) => {
      r.validationReportUrl = String(r.validationReportUrl).replace(String(r.sourceCommit), "main");
    },
  ],
  [
    "foreign report",
    (r) => {
      r.validationReportUrl = String(r.validationReportUrl).replace(String(r.name), "other");
    },
  ],
  [
    "report traversal",
    (r) => {
      r.validationReportUrl = `https://github.com/JasonStys/${String(r.name)}/blob/${String(r.sourceCommit)}/docs/reports/../private.md`;
    },
  ],
  [
    "encoded report path",
    (r) => {
      r.validationReportUrl = String(r.validationReportUrl).replace(
        "/reports/",
        "/reports/%2e%2e/",
      );
    },
  ],
  [
    "report query",
    (r) => {
      r.validationReportUrl = String(r.validationReportUrl) + "?raw=true";
    },
  ],
  [
    "no limits",
    (r) => {
      r.limitations = [];
    },
  ],
  [
    "nonarray limits",
    (r) => {
      r.limitations = "limits";
    },
  ],
  [
    "too many limits",
    (r) => {
      r.limitations = ["one", "two", "three", "four", "five"];
    },
  ],
  [
    "duplicate limits",
    (r) => {
      r.limitations = ["Same limit", "Same limit"];
    },
  ],
  [
    "oversized limit",
    (r) => {
      r.limitations = ["x".repeat(401)];
    },
  ],
  [
    "nontext limit",
    (r) => {
      r.limitations = [null];
    },
  ],
  [
    "no workflows",
    (r) => {
      r.workflows = [];
    },
  ],
  [
    "nonarray workflows",
    (r) => {
      r.workflows = {};
    },
  ],
  [
    "too many workflows",
    (r) => {
      r.workflows = Array.from({ length: 9 }, () => ({
        name: "CI",
        url: "https://github.com/JasonStys/example/actions/runs/1",
      }));
    },
  ],
  [
    "null workflow",
    (r) => {
      r.workflows = [null];
    },
  ],
  [
    "private workflow metadata",
    (r) => {
      r.workflows = [
        {
          name: "CI",
          url: `https://github.com/JasonStys/${String(r.name)}/actions/runs/1`,
          token: "private",
        },
      ];
    },
  ],
  [
    "missing workflow URL",
    (r) => {
      r.workflows = [{ name: "CI" }];
    },
  ],
  [
    "foreign workflow",
    (r) => {
      r.workflows = [{ name: "CI", url: "https://github.com/JasonStys/other/actions/runs/1" }];
    },
  ],
  [
    "workflow host wildcard",
    (r) => {
      r.workflows = [
        { name: "CI", url: `https://githubXcom/JasonStys/${String(r.name)}/actions/runs/1` },
      ];
    },
  ],
  [
    "workflow query",
    (r) => {
      r.workflows = [
        { name: "CI", url: `https://github.com/JasonStys/${String(r.name)}/actions/runs/1?test=1` },
      ];
    },
  ],
  [
    "workflow URL ambiguity",
    (r) => {
      const url = `https://github.com/JasonStys/${String(r.name)}/actions/runs/1`;
      r.workflows = [
        { name: "CI", url },
        { name: "Other", url },
      ];
    },
  ],
  [
    "workflow name ambiguity",
    (r) => {
      const base = `https://github.com/JasonStys/${String(r.name)}/actions/runs/`;
      r.workflows = [
        { name: "CI", url: base + "1" },
        { name: "CI", url: base + "2" },
      ];
    },
  ],
  [
    "empty text",
    (r) => {
      r.summary = "";
    },
  ],
  [
    "oversized text",
    (r) => {
      r.rationale = "x".repeat(701);
    },
  ],
  [
    "control text",
    (r) => {
      r.summary = "hidden\u0000text";
    },
  ],
  [
    "HTML text",
    (r) => {
      r.summary = "<img src=x>";
    },
  ],
  [
    "private Windows path",
    (r) => {
      r.rationale = "See C:\\private\\report.json";
    },
  ],
  [
    "private Unix path",
    (r) => {
      r.rationale = "See /home/person/report.json";
    },
  ],
  [
    "credential-shaped text",
    (r) => {
      r.summary = ["ghp", "_", "x".repeat(25)].join("");
    },
  ],
  [
    "surrounding whitespace",
    (r) => {
      r.summary = " hidden whitespace ";
    },
  ],
];

describe("public exact-source upgrade manifest", () => {
  it("covers exactly the 66 domain projects, with public evidence and frozen nested records", () => {
    expect(upgradeManifest.repositories.map((entry) => entry.name).sort()).toEqual(
      projects
        .filter((project) => project.name !== "portfolio-case-study-site")
        .map((project) => project.name)
        .sort(),
    );
    expect(upgradeManifest.repositories).toHaveLength(66);
    expect(Object.isFrozen(upgradeManifest)).toBe(true);
    for (const record of upgradeManifest.repositories) {
      expect(Object.isFrozen(record)).toBe(true);
      expect(Object.isFrozen(record.limitations)).toBe(true);
      expect(Object.isFrozen(record.workflows)).toBe(true);
      expect(record.workflows.every(Object.isFrozen)).toBe(true);
      expect(projectUpgrade(record.name)).toBe(record);
    }
    expect(projectUpgrade("portfolio-case-study-site")).toBeUndefined();
    expect(projectUpgrade("unknown")).toBeUndefined();
  });

  it("is deterministic, accepts record order changes and preserves literal editorial units", () => {
    expect(validateUpgrades(structuredClone(raw))).toEqual(upgradeManifest);
    expect(
      validateUpgrades({ ...raw, repositories: [...raw.repositories].reverse() }).repositories[0]
        ?.name,
    ).toBe(raw.repositories.at(-1)?.name);
    expect(
      validateUpgrades(
        changed((r) => {
          r.summary = "A <= 1 mm comparison with Unicode α and units.";
        }),
      ).repositories[0]?.summary,
    ).toContain("<= 1 mm");
  });

  for (const [name, mutate] of invalid)
    it(`rejects ${name}`, () => {
      expect(() => validateUpgrades(changed(mutate))).toThrow(TypeError);
    });

  it.each([null, [], "private", 0])("rejects a nonobject manifest: %j", (value) => {
    expect(() => validateUpgrades(value)).toThrow(TypeError);
  });
});
