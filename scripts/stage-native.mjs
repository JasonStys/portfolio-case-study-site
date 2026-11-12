/**
 * @file Builds the same Astro site and creates one fresh source-bound offline snapshot without installing software.
 * Functions: checked child build and createSnapshot invocation.
 * Variables: explicit local dirty flag, immutable source identity and owned .runtime output.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createSnapshot } from "./native-snapshot.mjs";
const root = path.resolve(import.meta.dirname, ".."),
  output = path.resolve(process.argv[2] ?? path.join(root, ".runtime/native-snapshot"));
const allowDirty = process.argv[3] === "--allow-dirty";
if (
  !output.startsWith(path.join(root, ".runtime") + path.sep) ||
  fs.existsSync(output) ||
  process.argv.length > 4 ||
  (process.argv[3] && !allowDirty) ||
  (allowDirty && process.env.GITHUB_ACTIONS === "true")
)
  throw new Error("Choose a fresh owned .runtime snapshot path.");
const checked = (executable, args) =>
  execFileSync(executable, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 180000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
  });
const git = (...args) =>
  checked("git", ["-c", `safe.directory=${root.replaceAll("\\", "/")}`, ...args]).trim();
const source = git("rev-parse", "HEAD"),
  sourceDirty = Boolean(git("status", "--porcelain"));
if (sourceDirty && !allowDirty)
  throw new Error("Use clean source or an explicitly marked local candidate.");
checked(process.execPath, [path.join(root, "node_modules/astro/bin/astro.mjs"), "build"]);
checked(process.execPath, [path.join(root, "scripts/validate-dist.mjs")]);
const metadata = createSnapshot({
  directory: path.join(root, "dist"),
  ownerRoot: path.join(root, "desktop"),
  output,
  source,
  sourceDirty,
});
console.log(
  JSON.stringify({
    staged: true,
    version: metadata.version,
    source,
    sourceDirty,
    files: Object.keys(metadata.files).length,
    exactPublicLinks: metadata.externalLinks.length,
  }),
);
