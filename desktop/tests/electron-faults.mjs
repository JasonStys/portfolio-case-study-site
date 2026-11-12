/**
 * @file Proves real Electron startup failures exit one after releasing only acquired synthetic profile ownership.
 * Functions: checked actual child controls and negative result receipts; variables: missing snapshot, owned and unknown profiles.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
const require = createRequire(import.meta.url),
  { openProfile } = require("../profile.cjs");
const root = path.resolve(import.meta.dirname, "../.."),
  output = path.resolve(process.argv[2] ?? "");
if (
  process.argv.length !== 3 ||
  !output.startsWith(path.join(root, ".runtime") + path.sep) ||
  fs.existsSync(output)
)
  throw new Error("Choose a fresh owned .runtime fault output.");
fs.mkdirSync(output, { recursive: true });
const results = [];
for (const mode of ["missing-snapshot", "occupied-profile", "unknown-profile"]) {
  const profile = path.join(output, mode),
    env = {
      ...process.env,
      PORTFOLIO_NATIVE_RESOURCES: path.join(output, "intentionally-missing-snapshot"),
    };
  delete env.NODE_OPTIONS;
  delete env.NODE_PATH;
  delete env.ELECTRON_RUN_AS_NODE;
  let owner, token;
  if (mode === "occupied-profile") {
    owner = openProfile(profile);
    token = fs.readFileSync(path.join(profile, "owner.lock"), "utf8");
  }
  if (mode === "unknown-profile") {
    fs.mkdirSync(profile);
    fs.writeFileSync(path.join(profile, "outside-owned-sentinel.txt"), "untouched");
  }
  try {
    const result = spawnSync(
      require("../node_modules/electron"),
      [path.join(root, "desktop/tests/electron-failure-entry.mjs"), "--profile", profile],
      { cwd: output, env, encoding: "utf8", timeout: 30000, maxBuffer: 65536, windowsHide: true },
    );
    if (
      result.error ||
      result.status !== 1 ||
      result.signal !== null ||
      !result.stdout.includes("PORTFOLIO_EXPECTED_ERROR_DISPLAY")
    )
      throw new Error("Actual Electron failed-startup status was not one: " + mode);
    const lock = path.join(profile, "owner.lock");
    if (owner ? fs.readFileSync(lock, "utf8") !== token : fs.existsSync(lock))
      throw new Error("Actual failed-startup profile ownership differs: " + mode);
    if (
      mode === "unknown-profile" &&
      (fs.readFileSync(path.join(profile, "outside-owned-sentinel.txt"), "utf8") !== "untouched" ||
        fs.existsSync(path.join(profile, "owner.json")))
    )
      throw new Error("Unknown profile content was modified.");
    results.push({
      mode,
      exitCode: result.status,
      signal: result.signal,
      errorDisplayObserved: true,
      acquiredLockReleasedOrExistingLockPreserved: true,
    });
  } finally {
    owner?.close();
  }
}
fs.writeFileSync(
  path.join(output, "receipt.json"),
  JSON.stringify(
    { success: true, sourceElectron: true, errorDisplayOnlySubstitution: true, results },
    null,
    2,
  ) + "\n",
  { flag: "wx" },
);
console.log(
  JSON.stringify({
    success: true,
    actualFailureStatuses: results.map((result) => result.exitCode),
  }),
);
