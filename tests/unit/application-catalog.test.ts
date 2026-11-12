/**
 * @file Proves every current project deep link reaches its actual static ordinal page and excludes the unreleased hub.
 * Functions: canonical link and missing-name tests; variables: complete actual manifest.
 * Line locations: see docs/CODE_INDEX.md for generated declarations.
 */
import { describe, expect, it } from "vitest";
import {
  applicationManifest,
  applicationFor,
  applicationDownloadPath,
} from "../../src/lib/application-catalog";
describe("current application discovery", () => {
  it("maps all66 names once to the correct twelve-item page and anchor", () => {
    expect(applicationManifest.applications).toHaveLength(66);
    for (const [index, application] of applicationManifest.applications.entries()) {
      const page = Math.floor(index / 12) + 1;
      expect(applicationFor(application.name)).toBe(application);
      expect(applicationDownloadPath(application.name)).toBe(
        `${page === 1 ? "downloads/" : `downloads/page/${page}/`}#${application.name}`,
      );
    }
  });
  it("does not invent a released application or future hub identity", () => {
    for (const name of ["portfolio-case-study-site", "not-a-project", "../code-flow-studio"]) {
      expect(applicationFor(name)).toBeUndefined();
      expect(() => applicationDownloadPath(name)).toThrow(/No released application/);
    }
  });
});
