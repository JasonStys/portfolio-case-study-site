/**
 * @file Independently verifies exact twelve-item partitions, complete curated-range coverage and invalid page admission.
 * Functions: ordered partition and boundary cases; variables: inert ordinal arrays, not invented release metadata.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { describe, expect, it } from "vitest";
import {
  downloadPageCount,
  downloadPagePath,
  selectDownloadPage,
} from "../../src/lib/download-pages";
describe("static download pagination", () => {
  it("preserves all twenty current entries in independent 12/8 pages without mutation or duplicate identity", () => {
    const source = Object.freeze(
      Array.from({ length: 20 }, (_, index) => Object.freeze({ id: index + 1 })),
    );
    const first = selectDownloadPage(source, 1),
      second = selectDownloadPage(source, 2);
    expect(first.items.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(second.items.map((item) => item.id)).toEqual([13, 14, 15, 16, 17, 18, 19, 20]);
    expect([first.first, first.last, second.first, second.last]).toEqual([1, 12, 13, 20]);
    expect(first.path).toBe("downloads/");
    expect(second.path).toBe("downloads/page/2/");
    expect([...first.items, ...second.items]).toEqual(source);
    expect(first.items[0]).toBe(source[0]);
  });
  it("covers all67 curated ordinals with six pages of12/12/12/12/12/7 and no phantom seventh page", () => {
    const source = Array.from({ length: 67 }, (_, index) => index);
    const pages = Array.from({ length: downloadPageCount(source.length) }, (_, index) =>
      selectDownloadPage(source, index + 1),
    );
    expect(pages.map((page) => page.items.length)).toEqual([12, 12, 12, 12, 12, 7]);
    expect(pages.flatMap((page) => page.items)).toEqual(source);
    expect(new Set(pages.flatMap((page) => page.items)).size).toBe(67);
    expect(pages.at(-1)?.path).toBe("downloads/page/6/");
    expect(() => selectDownloadPage(source, 7)).toThrow();
  });
  it("keeps a one-entry or exact-twelve catalog on only the original first route", () => {
    expect(selectDownloadPage(["one"], 1)).toMatchObject({
      first: 1,
      last: 1,
      totalPages: 1,
      path: "downloads/",
      items: ["one"],
    });
    expect(downloadPageCount(12)).toBe(1);
    expect(downloadPageCount(13)).toBe(2);
    expect(() => selectDownloadPage(["one"], 2)).toThrow();
  });
  for (const invalid of [0, -1, 68, 1.5, Number.NaN, Number.POSITIVE_INFINITY])
    it(`refuses invalid catalog count ${invalid}`, () => {
      expect(() => downloadPageCount(invalid)).toThrow();
    });
  for (const invalid of [0, -1, 7, 1.5, Number.NaN, Number.POSITIVE_INFINITY])
    it(`refuses invalid or out-of-catalog page ${invalid}`, () => {
      expect(() => downloadPagePath(invalid)).toThrow();
      expect(() => selectDownloadPage([1], invalid)).toThrow();
    });
  it("refuses a nonarray rather than paginating text as a catalog", () => {
    expect(() => selectDownloadPage("text" as unknown as readonly string[], 1)).toThrow();
  });
});
