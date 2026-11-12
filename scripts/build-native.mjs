/**
 * @file Build the actual Astro portfolio and isolated browser owner into a fresh unsigned Windows x64 application directory.
 * Functions: checked, git, fingerprint and icon bind actual source/build/runtime bytes without installation.
 * Variables: fixed tool entry points and fresh generated paths; no normal user profile is opened.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { copySnapshot } from "./native-snapshot.mjs";
import { archiveEvidence } from "./native-archive.mjs";
import { build, Platform, Arch } from "../desktop/node_modules/electron-builder/out/index.js";
const { readRegular } = createRequire(import.meta.url)("../desktop/files.cjs");
const { verifiedSnapshot } = createRequire(import.meta.url)("../desktop/resources.cjs");
const root = path.resolve(import.meta.dirname, "..");
const output = path.resolve(process.argv[2] ?? "");
const allowDirty = process.argv[3] === "--allow-dirty";
const staging = path.join(root, ".runtime", "native-stage-" + randomBytes(8).toString("hex"));
const version = "1.1.0";

/** @param {string} executable Fixed build executable. @param {string[]} args Literal arguments. @returns {string} Bounded output. */
function checked(executable, args) {
  return execFileSync(executable, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 300000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
    env: { ...process.env, CSC_IDENTITY_AUTO_DISCOVERY: "false" },
  });
}
/** @param {...string} args Read-only source arguments. @returns {string} Source metadata. */
function git(...args) {
  return checked("git", ["-c", `safe.directory=${root.replaceAll("\\", "/")}`, ...args]).trim();
}
/** @returns {Record<string,string>} Exact authored file hashes; ignored profiles/builds are never scanned. */
function fingerprint() {
  const names = checked("git", [
    "-c",
    `safe.directory=${root.replaceAll("\\", "/")}`,
    "ls-files",
    "-z",
    "--cached",
    "--others",
    "--exclude-standard",
  ])
    .split("\0")
    .filter(Boolean)
    .sort();
  if (names.length > 5000) throw new Error("Authored source inventory exceeds its bound.");
  return Object.fromEntries(
    names.map((name) => {
      const file = path.resolve(root, name);
      if (!file.startsWith(root + path.sep)) throw new Error("Authored source path escaped.");
      return [
        name,
        createHash("sha256")
          .update(readRegular(file, 32 * 1024 * 1024))
          .digest("hex"),
      ];
    }),
  );
}
/** @param {string} file Fresh icon destination. @returns {void} A high-contrast JS monogram in the existing portfolio palette. */
function icon(file) {
  const side = 256,
    pixels = Buffer.alloc(side * side * 4),
    mask = Buffer.alloc((side * side) / 8),
    bitmap = Buffer.alloc(40);
  for (let y = 0; y < side; y++)
    for (let x = 0; x < side; x++) {
      const glyphs = [
        "00111",
        "00010",
        "00010",
        "00010",
        "10010",
        "10010",
        "01100",
        "01111",
        "10000",
        "10000",
        "01110",
        "00001",
        "00001",
        "11110",
      ];
      const column = Math.floor((x - 26) / 18),
        row = Math.floor((y - 58) / 20);
      const left = column >= 0 && column < 5 && row >= 0 && row < 7 && glyphs[row][column] === "1";
      const right =
        column >= 7 && column < 12 && row >= 0 && row < 7 && glyphs[row + 7][column - 7] === "1";
      const color = left || right ? [245, 242, 233] : [7, 21, 29];
      const offset = ((side - 1 - y) * side + x) * 4;
      pixels[offset] = color[2] ?? 0;
      pixels[offset + 1] = color[1] ?? 0;
      pixels[offset + 2] = color[0] ?? 0;
      pixels[offset + 3] = 255;
    }
  bitmap.writeUInt32LE(40, 0);
  bitmap.writeInt32LE(side, 4);
  bitmap.writeInt32LE(side * 2, 8);
  bitmap.writeUInt16LE(1, 12);
  bitmap.writeUInt16LE(32, 14);
  bitmap.writeUInt32LE(pixels.length, 20);
  const image = Buffer.concat([bitmap, pixels, mask]),
    header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(image.length, 14);
  header.writeUInt32LE(22, 18);
  fs.writeFileSync(file, Buffer.concat([header, image]), { flag: "wx" });
}

if (
  process.platform !== "win32" ||
  process.arch !== "x64" ||
  !process.argv[2] ||
  !output.startsWith(path.join(root, "release") + path.sep) ||
  fs.existsSync(output) ||
  process.argv.length > 4 ||
  (!allowDirty && process.argv[3])
)
  throw new Error("Use a fresh explicit release/ Windows x64 build output.");
if (allowDirty && process.env.GITHUB_ACTIONS === "true")
  throw new Error("Hosted source must be clean.");
const source = git("rev-parse", "HEAD"),
  sourceDirty = Boolean(git("status", "--porcelain"));
if (
  !/^[a-f0-9]{40}$/.test(source) ||
  (sourceDirty && !allowDirty) ||
  (process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_SHA !== source)
)
  throw new Error("Exact clean source required; dirty local candidates must be explicit.");
for (const file of ["package.json", "desktop/package.json"])
  if (JSON.parse(readRegular(path.join(root, file), 1000000)).version !== version)
    throw new Error("Application metadata versions differ.");
const before = fingerprint();
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(staging, { recursive: true });
checked(process.execPath, [
  "scripts/stage-native.mjs",
  path.join(staging, "site"),
  ...(allowDirty ? ["--allow-dirty"] : []),
]);
icon(path.join(staging, "portfolio.ico"));
const configuration = {
  appId: "com.jasonstys.portfolio",
  productName: "Jason Stys Portfolio",
  directories: { output },
  files: ["*.mjs", "*.cjs", "package.json"],
  extraResources: [
    { from: path.join(root, "LICENSE"), to: "notices/PROJECT-LICENSE.txt" },
    { from: path.join(root, "node_modules/astro/LICENSE"), to: "notices/ASTRO-LICENSE.txt" },
  ],
  artifactName: "Jason-Stys-Portfolio-${version}-windows-${arch}.${ext}",
  afterPack: async (context) => {
    const app = path.join(context.appOutDir, "resources/app");
    const snapshot = path.join(context.appOutDir, "resources/portfolio-site");
    copySnapshot(path.join(staging, "site"), snapshot, app);
    verifiedSnapshot(snapshot, app);
  },
  win: {
    target: "zip",
    executableName: "JasonStysPortfolio",
    icon: path.join(staging, "portfolio.ico"),
    signExecutable: false,
  },
  // The same-descriptor admission contract requires ordinary installed files.
  // ASAR exposes synthetic stat identities that differ from its extracted read FD.
  asar: false,
};
const artifacts = await build({
  projectDir: path.join(root, "desktop"),
  targets: Platform.WINDOWS.createTarget("zip", Arch.x64),
  config: configuration,
  publish: "never",
});
const directory = path.join(output, "win-unpacked");
const metadata = verifiedSnapshot(
  path.join(directory, "resources/portfolio-site"),
  path.join(directory, "resources/app"),
).metadata;
for (const file of [
  "JasonStysPortfolio.exe",
  "LICENSE.electron.txt",
  "LICENSES.chromium.html",
  "resources/notices/PROJECT-LICENSE.txt",
  "resources/notices/ASTRO-LICENSE.txt",
])
  readRegular(path.join(directory, file), 512 * 1024 * 1024);
if (artifacts.length !== 1 || !artifacts[0].endsWith(".zip"))
  throw new Error("One actual portable ZIP is required.");
const evidence = archiveEvidence(
  artifacts[0],
  directory,
  path.join(output, "package-integrity.json"),
  metadata,
);
if (JSON.stringify(fingerprint()) !== JSON.stringify(before))
  throw new Error("Authored source changed during native build.");
console.log(
  JSON.stringify({
    built: true,
    version,
    source,
    sourceDirty,
    archive: evidence.archive,
    files: Object.keys(evidence.files).length,
  }),
);
