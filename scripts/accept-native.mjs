/**
 * @file Relocates the actual portable ZIP and executes the unchanged full native consumer before verifying every body again.
 * Functions: extractVerified, checked journey and final full-inventory comparison.
 * Variables: exact fresh output, source-bound release evidence and normal two-launch proof; no installation.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { extractVerified, inventory } from "./native-archive.mjs";
const root = path.resolve(import.meta.dirname, ".."),
  archive = path.resolve(process.argv[2] ?? ""),
  evidencePath = path.resolve(process.argv[3] ?? ""),
  output = path.resolve(process.argv[4] ?? "");
if (
  process.platform !== "win32" ||
  process.argv.length !== 5 ||
  !output.startsWith(path.join(root, ".runtime") + path.sep) ||
  fs.existsSync(output)
)
  throw new Error(
    "Choose the actual ZIP, integrity evidence and a fresh owned .runtime acceptance directory.",
  );
fs.mkdirSync(output, { recursive: true });
const directory = path.join(output, "relocated"),
  evidence = await extractVerified(archive, evidencePath, directory);
if (
  process.env.GITHUB_ACTIONS === "true" &&
  (evidence.sourceDirty || evidence.source !== process.env.GITHUB_SHA)
)
  throw new Error("Hosted native source must be the exact clean checkout.");
const stdout = execFileSync(
  process.execPath,
  [
    path.join(root, "desktop/tests/native-journey.mjs"),
    path.join(directory, "JasonStysPortfolio.exe"),
    path.join(output, "acceptance"),
  ],
  {
    cwd: root,
    encoding: "utf8",
    timeout: 180000,
    maxBuffer: 1024 * 1024,
    windowsHide: true,
    env: { ...process.env },
  },
);
const after = inventory(directory);
if (JSON.stringify(after) !== JSON.stringify(evidence.files))
  throw new Error("Packaged application bytes changed during actual use.");
const receipt = {
  success: true,
  version: evidence.version,
  source: evidence.source,
  sourceDirty: evidence.sourceDirty,
  archive: evidence.archive,
  packagedFilesUnchanged: Object.keys(after).length,
  actualConsumer: JSON.parse(stdout.trim()),
};
fs.writeFileSync(path.join(output, "receipt.json"), JSON.stringify(receipt, null, 2) + "\n", {
  flag: "wx",
});
console.log(JSON.stringify(receipt));
