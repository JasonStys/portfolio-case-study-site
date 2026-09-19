/**
 * @file Verifies repository-base URL construction and XML escaping boundaries.
 * Functions: Vitest URL and XML utility cases.
 * Variables: configured test site and base path.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import { absoluteUrl, withBase } from "@/lib/url";
import { escapeXml } from "@/lib/xml";

describe("output utilities", () => {
  it("builds base-aware internal and absolute URLs", () => {
    expect(withBase("")).toBe("/portfolio-case-study-site/");
    expect(withBase("projects/")).toBe("/portfolio-case-study-site/projects/");
    expect(withBase("/about/")).toBe("/portfolio-case-study-site/about/");
    expect(absoluteUrl("feed.xml")).toBe(
      "https://jasonstys.github.io/portfolio-case-study-site/feed.xml",
    );
  });

  it("escapes all XML delimiter characters", () => {
    expect(escapeXml(`<tag a="x">Tom & 'Ada'</tag>`)).toBe(
      "&lt;tag a=&quot;x&quot;&gt;Tom &amp; &apos;Ada&apos;&lt;/tag&gt;",
    );
  });
});
