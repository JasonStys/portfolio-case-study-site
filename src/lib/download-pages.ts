/**
 * @file Bounds static download pagination while preserving authoritative catalog order and one canonical first page.
 * Functions: downloadPageCount, downloadPagePath and selectDownloadPage.
 * Variables: twelve-item page size and the curated 67-project maximum; no data/source facts are rewritten.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
export const DOWNLOAD_PAGE_SIZE = 12;
const MAX_PROJECTS = 67;
export function downloadPageCount(count: number): number {
  if (!Number.isSafeInteger(count) || count < 1 || count > MAX_PROJECTS)
    throw new Error("Download pagination requires one to 67 catalog entries.");
  return Math.ceil(count / DOWNLOAD_PAGE_SIZE);
}
export function downloadPagePath(page: number): string {
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > Math.ceil(MAX_PROJECTS / DOWNLOAD_PAGE_SIZE)
  )
    throw new Error("Invalid download page.");
  return page === 1 ? "downloads/" : `downloads/page/${page}/`;
}
export type DownloadPageSelection<T> = Readonly<{
  page: number;
  totalPages: number;
  totalEntries: number;
  path: string;
  first: number;
  last: number;
  items: readonly T[];
}>;
export function selectDownloadPage<T>(
  entries: readonly T[],
  page: number,
): DownloadPageSelection<T> {
  const candidate: unknown = entries;
  if (!Array.isArray(candidate)) throw new Error("An actual download catalog array is required.");
  const totalPages = downloadPageCount(entries.length);
  const pathname = downloadPagePath(page);
  if (page > totalPages) throw new Error("Download page is outside the catalog.");
  const start = (page - 1) * DOWNLOAD_PAGE_SIZE;
  return {
    page,
    totalPages,
    totalEntries: entries.length,
    path: pathname,
    first: start + 1,
    last: Math.min(start + DOWNLOAD_PAGE_SIZE, entries.length),
    items: entries.slice(start, start + DOWNLOAD_PAGE_SIZE),
  };
}
