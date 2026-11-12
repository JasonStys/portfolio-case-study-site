/**
 * @file Exercises real tiny ZIP bytes, expansion budgets and exclusive portable relocation independently of the builder.
 * Functions: actual ZIP fixture writer, proof creation and archive mutation controls.
 * Variables: inert prepared files and zlib/CRC fixtures; never an installed executable or personal directory.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { crc32, deflateRawSync } = require("node:zlib"),
  { createHash } = require("node:crypto");
const { readUtf8, readRegular } = require("../files.cjs");
function fixture(
  t,
  entries = [{ name: "resources/app/main.mjs", body: "// actual inert fixture\n" }],
) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-zip-"));
  t.after(() => fs.rmSync(root, { recursive: true }));
  const file = path.join(root, "portable.zip"),
    proof = path.join(root, "package-integrity.json"),
    output = path.join(root, "relocated");
  let offset = 0;
  const local = [],
    central = [],
    files = {};
  for (const entry of entries) {
    const name = Buffer.from(entry.name),
      body = Buffer.from(entry.body),
      compressed = deflateRawSync(body),
      declared = entry.declared ?? body.length,
      crc = crc32(body);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x800, 6);
    header.writeUInt16LE(8, 8);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(declared, 22);
    header.writeUInt16LE(name.length, 26);
    local.push(header, name, compressed);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50);
    directory.writeUInt16LE(0x314, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(0x800, 8);
    directory.writeUInt16LE(8, 10);
    directory.writeUInt32LE(crc, 16);
    directory.writeUInt32LE(compressed.length, 20);
    directory.writeUInt32LE(declared, 24);
    directory.writeUInt16LE(name.length, 28);
    directory.writeUInt32LE(entry.mode ?? 0x81a40000, 38);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, name);
    offset += header.length + name.length + compressed.length;
    files[entry.name] = {
      bytes: declared,
      sha256: createHash("sha256").update(body).digest("hex"),
    };
  }
  const centralBytes = Buffer.concat(central),
    end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBytes.length, 12);
  end.writeUInt32LE(offset, 16);
  const bytes = Buffer.concat([...local, centralBytes, end]);
  fs.writeFileSync(file, bytes);
  const evidence = {
    schema: 1,
    product: "portfolio-case-study-site",
    version: "1.1.0",
    source: "a".repeat(40),
    sourceDirty: true,
    archive: {
      name: "portable.zip",
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    },
    files,
  };
  const save = () => fs.writeFileSync(proof, JSON.stringify(evidence));
  save();
  return { root, file, proof, output, evidence, save, bytes };
}
test("actual compressed ZIP bodies relocate exactly once and source fixture bytes remain unchanged", async (t) => {
  const { extractVerified, inventory } = await import("../../scripts/native-archive.mjs"),
    f = fixture(t);
  const evidence = await extractVerified(f.file, f.proof, f.output);
  assert.equal(
    fs.readFileSync(path.join(f.output, "resources/app/main.mjs"), "utf8"),
    "// actual inert fixture\n",
  );
  assert.deepEqual(inventory(f.output), evidence.files);
  assert.deepEqual(fs.readFileSync(f.file), f.bytes);
  await assert.rejects(extractVerified(f.file, f.proof, f.output), /fresh relocated/);
});
for (const entry of [
  { name: "../outside.txt", body: "escape" },
  { name: "resources/link", body: "../outside", mode: 0xa1ff0000 },
])
  test("unsafe real ZIP member is refused before any relocation: " + entry.name, async (t) => {
    const { extractVerified } = await import("../../scripts/native-archive.mjs"),
      f = fixture(t, [entry]);
    await assert.rejects(extractVerified(f.file, f.proof, f.output), /Unsafe portable/);
    assert.equal(fs.existsSync(f.output), false);
  });
test("actual dishonest-size DEFLATE is stopped at the expected expanded bound", async (t) => {
  const { extractVerified } = await import("../../scripts/native-archive.mjs"),
    f = fixture(t, [{ name: "large.txt", body: "x".repeat(65536), declared: 1 }]);
  await assert.rejects(extractVerified(f.file, f.proof, f.output), /expansion exceeded/);
  assert.equal(fs.statSync(path.join(f.output, "large.txt")).size, 0);
});
test("digest, directory-count, unknown member and body-hash faults independently fail", async (t) => {
  const { extractVerified } = await import("../../scripts/native-archive.mjs"),
    f = fixture(t);
  const original = JSON.stringify(f.evidence);
  f.evidence.archive.sha256 = "0".repeat(64);
  f.save();
  await assert.rejects(extractVerified(f.file, f.proof, f.output), /digest differs/);
  Object.assign(f.evidence, JSON.parse(original));
  f.evidence.files = { "other.txt": { bytes: 1, sha256: "a".repeat(64) } };
  f.save();
  await assert.rejects(extractVerified(f.file, f.proof, f.output), /inventory differs/);
  assert.equal(fs.existsSync(f.output), false);
  Object.assign(f.evidence, JSON.parse(original));
  f.evidence.files["resources/app/main.mjs"].sha256 = "0".repeat(64);
  f.save();
  await assert.rejects(extractVerified(f.file, f.proof, f.output), /body differs/);
  const g = fixture(t);
  g.bytes.writeUInt16LE(65535, g.bytes.length - 12);
  fs.writeFileSync(g.file, g.bytes);
  g.evidence.archive.sha256 = createHash("sha256").update(g.bytes).digest("hex");
  g.save();
  await assert.rejects(extractVerified(g.file, g.proof, g.output), /unbounded portable ZIP/);
  assert.equal(fs.existsSync(g.output), false);
});
test("an actual hardlinked archive is refused without touching the outside sentinel", async (t) => {
  const { extractVerified } = await import("../../scripts/native-archive.mjs"),
    f = fixture(t),
    alias = path.join(f.root, "archive-alias.zip");
  fs.linkSync(f.file, alias);
  await assert.rejects(extractVerified(f.file, f.proof, f.output), /single-link/);
  assert.deepEqual(fs.readFileSync(alias), f.bytes);
  assert.equal(fs.existsSync(f.output), false);
});
test("a self-consistent body hash does not excuse an invalid ordinary ZIP CRC", async (t) => {
  const { extractVerified } = await import("../../scripts/native-archive.mjs"),
    f = fixture(t);
  const central = f.bytes.readUInt32LE(f.bytes.length - 6);
  f.bytes.writeUInt32LE(0, 14);
  f.bytes.writeUInt32LE(0, central + 16);
  fs.writeFileSync(f.file, f.bytes);
  f.evidence.archive.sha256 = createHash("sha256").update(f.bytes).digest("hex");
  f.save();
  await assert.rejects(extractVerified(f.file, f.proof, f.output), /CRC differs/);
});
test("actual short writes finish every body and a zero-progress destination fails closed", async (t) => {
  const { extractVerified } = await import("../../scripts/native-archive.mjs"),
    f = fixture(t),
    original = fs.writeSync;
  let calls = 0;
  try {
    fs.writeSync = (fd, buffer, offset = 0, length = buffer.length, position = null) => {
      calls++;
      return original(fd, buffer, offset, Math.min(3, length), position);
    };
    await extractVerified(f.file, f.proof, f.output);
  } finally {
    fs.writeSync = original;
  }
  assert.ok(calls > 1);
  assert.equal(
    fs.readFileSync(path.join(f.output, "resources/app/main.mjs"), "utf8"),
    "// actual inert fixture\n",
  );
  const g = fixture(t);
  try {
    fs.writeSync = () => 0;
    await assert.rejects(extractVerified(g.file, g.proof, g.output), /no valid progress/);
  } finally {
    fs.writeSync = original;
  }
  assert.equal(fs.statSync(path.join(g.output, "resources/app/main.mjs")).size, 0);
});
test("replacement of the named archive during a held descriptor read is detected and preserves the replacement", async (t) => {
  const { extractVerified } = await import("../../scripts/native-archive.mjs"),
    f = fixture(t),
    original = fs.readSync;
  const replacement = path.join(f.root, "replacement.zip"),
    retained = path.join(f.root, "retained-original.zip");
  fs.writeFileSync(replacement, "outside replacement sentinel");
  let changed = false;
  const originalIdentity = fs.statSync(f.file);
  try {
    fs.readSync = (...args) => {
      const count = original(...args);
      const reading = fs.fstatSync(args[0]);
      if (
        !changed &&
        reading.dev === originalIdentity.dev &&
        reading.ino === originalIdentity.ino
      ) {
        changed = true;
        fs.renameSync(f.file, retained);
        fs.renameSync(replacement, f.file);
      }
      return count;
    };
    await assert.rejects(extractVerified(f.file, f.proof, f.output), /identity changed/);
  } finally {
    fs.readSync = original;
  }
  assert.equal(readUtf8(f.file, 100), "outside replacement sentinel");
  assert.deepEqual(readRegular(retained, f.bytes.length), f.bytes);
  assert.equal(fs.existsSync(f.output), false);
});
