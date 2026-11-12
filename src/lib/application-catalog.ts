/**
 * @file Exposes the validated current application catalog without live requests or private evidence.
 * Functions: applicationFor and applicationDownloadPath; variables: applicationManifest.
 * Line locations: see docs/CODE_INDEX.md for generated declarations.
 */
import raw from "@/data/current-applications.json";
import { validateApplications } from "@/lib/applications";
import { downloadPagePath, DOWNLOAD_PAGE_SIZE } from "@/lib/download-pages";

export const applicationManifest = validateApplications(raw);
/** Find the current released application, leaving unknown names and the independent hub undefined. */
export function applicationFor(name: string) {
  return applicationManifest.applications.find((item) => item.name === name);
}
/** Return the exact static page and anchor from canonical order; refuse an unreleased name. */
export function applicationDownloadPath(name: string): string {
  const index = applicationManifest.applications.findIndex((item) => item.name === name);
  if (index < 0) throw new Error("No released application for this project.");
  return `${downloadPagePath(Math.floor(index / DOWNLOAD_PAGE_SIZE) + 1)}#${name}`;
}
