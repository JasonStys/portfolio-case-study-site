/**
 * @file Bounds and independently verifies every portable ZIP body before writing a fresh relocated application.
 * Functions: inventory, archiveEvidence, extractVerified and descriptor/ZIP admission helpers.
 * Variables: fixed Windows package limits, SHA-256 identities and ordinary single-link descriptors; no installer.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { Readable } from "node:stream";
import { crc32 } from "node:zlib";
const require = createRequire(import.meta.url);
const { ancestors, readUtf8, newFile } = require("../desktop/files.cjs");
const { safeName, VERSION } = require("../desktop/policy.cjs");
const unzipper = require("../desktop/node_modules/unzipper");
const MAX_FILE = 512 * 1024 * 1024,
  MAX_TOTAL = 768 * 1024 * 1024,
  MAX_COUNT = 4096;
function opened(file, maximum) {
  ancestors(path.dirname(file));
  const fd = fs.openSync(
    file,
    fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0),
  );
  try {
    const actual = fs.fstatSync(fd),
      named = fs.lstatSync(file);
    if (
      !actual.isFile() ||
      !named.isFile() ||
      named.isSymbolicLink() ||
      actual.nlink !== 1 ||
      named.nlink !== 1 ||
      actual.dev !== named.dev ||
      actual.ino !== named.ino ||
      actual.size !== named.size ||
      actual.size > maximum
    )
      throw new Error("Portable input must be an ordinary bounded single-link file.");
    return {
      fd,
      size: actual.size,
      check() {
        const held = fs.fstatSync(fd),
          current = fs.lstatSync(file);
        if (
          !held.isFile() ||
          !current.isFile() ||
          current.isSymbolicLink() ||
          held.nlink !== 1 ||
          current.nlink !== 1 ||
          held.dev !== actual.dev ||
          held.ino !== actual.ino ||
          held.size !== actual.size ||
          current.dev !== held.dev ||
          current.ino !== held.ino ||
          current.size !== held.size
        )
          throw new Error("Portable input identity changed.");
      },
    };
  } catch (error) {
    fs.closeSync(fd);
    throw error;
  }
}
function hashDescriptor(fd, size) {
  const hash = createHash("sha256"),
    buffer = Buffer.alloc(65536);
  let count = 0;
  while (count < size) {
    const read = fs.readSync(fd, buffer, 0, Math.min(buffer.length, size - count), count);
    if (!read) throw new Error("Portable input was truncated.");
    hash.update(buffer.subarray(0, read));
    count += read;
  }
  if (fs.readSync(fd, buffer, 0, 1, size) !== 0 || fs.fstatSync(fd).size !== size)
    throw new Error("Portable input grew.");
  return hash.digest("hex");
}
function checkedHash(input) {
  input.check();
  const digest = hashDescriptor(input.fd, input.size);
  input.check();
  return digest;
}
function writeAll(fd, chunk) {
  let offset = 0;
  while (offset < chunk.length) {
    const written = fs.writeSync(fd, chunk, offset, chunk.length - offset);
    if (!Number.isSafeInteger(written) || written <= 0 || written > chunk.length - offset)
      throw new Error("Portable output write made no valid progress.");
    offset += written;
  }
}
export function inventory(root) {
  ancestors(root);
  const result = {},
    pending = [[root, "", 0]];
  let entries = 0,
    total = 0;
  while (pending.length) {
    const [directory, prefix, depth] = pending.pop();
    if (depth > 16) throw new Error("Portable tree is too deep.");
    const handle = fs.opendirSync(directory);
    try {
      let entry;
      while ((entry = handle.readSync())) {
        if (++entries > MAX_COUNT * 2) throw new Error("Portable tree entry budget exceeded.");
        const name = prefix + entry.name,
          file = path.join(directory, entry.name),
          info = fs.lstatSync(file);
        if (!safeName(name) || info.isSymbolicLink()) throw new Error("Unsafe portable member.");
        if (info.isDirectory()) {
          pending.push([file, name + "/", depth + 1]);
          continue;
        }
        if (Object.keys(result).length >= MAX_COUNT || Object.hasOwn(result, name))
          throw new Error("Portable inventory exceeds its bound.");
        const input = opened(file, MAX_FILE);
        try {
          total += input.size;
          if (total > MAX_TOTAL) throw new Error("Portable byte budget exceeded.");
          result[name] = { bytes: input.size, sha256: checkedHash(input) };
        } finally {
          fs.closeSync(input.fd);
        }
      }
    } finally {
      handle.closeSync();
    }
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b, "en")));
}
export function archiveEvidence(archive, directory, destination, sourceMetadata) {
  const input = opened(archive, MAX_FILE);
  try {
    const evidence = {
      schema: 1,
      product: "portfolio-case-study-site",
      version: VERSION,
      source: sourceMetadata.source,
      sourceDirty: sourceMetadata.sourceDirty,
      archive: {
        name: path.basename(archive),
        bytes: input.size,
        sha256: checkedHash(input),
      },
      files: inventory(directory),
    };
    newFile(destination, JSON.stringify(evidence, null, 2) + "\n");
    return evidence;
  } finally {
    fs.closeSync(input.fd);
  }
}
function admittedEvidence(evidence) {
  if (
    !evidence ||
    Object.keys(evidence).sort().join("|") !==
      "archive|files|product|schema|source|sourceDirty|version" ||
    evidence.schema !== 1 ||
    evidence.product !== "portfolio-case-study-site" ||
    evidence.version !== VERSION ||
    !/^[a-f0-9]{40}$/u.test(evidence.source) ||
    typeof evidence.sourceDirty !== "boolean" ||
    !evidence.archive ||
    Object.keys(evidence.archive).sort().join("|") !== "bytes|name|sha256" ||
    !safeName(evidence.archive.name) ||
    evidence.archive.name.includes("/") ||
    !Number.isSafeInteger(evidence.archive.bytes) ||
    evidence.archive.bytes < 22 ||
    evidence.archive.bytes > MAX_FILE ||
    !/^[a-f0-9]{64}$/u.test(evidence.archive.sha256) ||
    !evidence.files ||
    Array.isArray(evidence.files)
  )
    throw new Error("Portable evidence identity differs.");
  const names = Object.keys(evidence.files),
    folded = new Set();
  let total = 0;
  if (!names.length || names.length > MAX_COUNT)
    throw new Error("Portable evidence inventory differs.");
  for (const name of names) {
    const item = evidence.files[name];
    if (
      !safeName(name) ||
      folded.has(name.toLowerCase()) ||
      !item ||
      Object.keys(item).sort().join("|") !== "bytes|sha256" ||
      !Number.isSafeInteger(item.bytes) ||
      item.bytes < 0 ||
      item.bytes > MAX_FILE ||
      !/^[a-f0-9]{64}$/u.test(item.sha256)
    )
      throw new Error("Unsafe portable evidence member.");
    folded.add(name.toLowerCase());
    total += item.bytes;
  }
  if (total > MAX_TOTAL) throw new Error("Portable expanded byte budget exceeded.");
}
export async function extractVerified(archive, evidencePath, output) {
  const evidence = JSON.parse(readUtf8(evidencePath, 4 * 1024 * 1024));
  admittedEvidence(evidence);
  ancestors(path.dirname(output));
  if (fs.existsSync(output)) throw new Error("Choose a fresh relocated output.");
  const input = opened(archive, MAX_FILE),
    streams = new Set();
  try {
    if (
      input.size !== evidence.archive.bytes ||
      checkedHash(input) !== evidence.archive.sha256 ||
      path.basename(archive) !== evidence.archive.name
    )
      throw new Error("Portable archive digest differs.");
    const end = Buffer.alloc(22);
    fs.readSync(input.fd, end, 0, 22, input.size - 22);
    const count = end.readUInt16LE(10),
      centralBytes = end.readUInt32LE(12),
      offset = end.readUInt32LE(16);
    if (
      end.readUInt32LE(0) !== 0x06054b50 ||
      end.readUInt16LE(4) !== 0 ||
      end.readUInt16LE(6) !== 0 ||
      end.readUInt16LE(8) !== count ||
      !count ||
      count > MAX_COUNT * 2 ||
      centralBytes > 4 * 1024 * 1024 ||
      offset + centralBytes !== input.size - 22 ||
      end.readUInt16LE(20) !== 0
    )
      throw new Error("Unsupported or unbounded portable ZIP directory.");
    const zip = await unzipper.Open.custom({
      size: async () => input.size,
      stream(start, length) {
        if (
          !Number.isSafeInteger(start) ||
          start < 0 ||
          start >= input.size ||
          (length !== undefined && (!Number.isSafeInteger(length) || length <= 0))
        )
          throw new Error("Invalid portable ZIP range.");
        let position = start;
        const end = length ? Math.min(input.size, start + length) : input.size;
        // A range stream does not own/close the shared verified descriptor, even when a parser cancels it.
        const stream = new Readable({
          read(requested) {
            try {
              if (position >= end) {
                this.push(null);
                return;
              }
              const buffer = Buffer.alloc(Math.min(requested, 65536, end - position));
              const count = fs.readSync(input.fd, buffer, 0, buffer.length, position);
              if (!count) throw new Error("Portable ZIP range was truncated.");
              position += count;
              this.push(buffer.subarray(0, count));
            } catch (error) {
              this.destroy(error);
            }
          },
        });
        streams.add(stream);
        stream.once("close", () => streams.delete(stream));
        return stream;
      },
    });
    if (zip.files.length !== count) throw new Error("Portable ZIP count differs.");
    const expectedDirectories = new Set(),
      seen = new Set(),
      folded = new Set();
    for (const name of Object.keys(evidence.files)) {
      let parent = path.posix.dirname(name);
      while (parent !== ".") {
        expectedDirectories.add(parent);
        parent = path.posix.dirname(parent);
      }
    }
    for (const entry of zip.files) {
      const name = entry.type === "Directory" ? entry.path.slice(0, -1) : entry.path;
      if (
        !safeName(name) ||
        folded.has(name.toLowerCase()) ||
        new TextDecoder("utf-8", { fatal: true }).decode(entry.pathBuffer) !== entry.path ||
        entry.flags & 1 ||
        ![0, 8].includes(entry.compressionMethod) ||
        ((entry.externalFileAttributes >>> 16) & 0xf000) === 0xa000 ||
        entry.offsetToLocalFileHeader >= offset ||
        entry.compressedSize > input.size
      )
        throw new Error("Unsafe portable ZIP member.");
      folded.add(name.toLowerCase());
      if (entry.type === "Directory") {
        if (!expectedDirectories.has(name)) throw new Error("Unknown portable ZIP directory.");
      } else if (
        !Object.hasOwn(evidence.files, name) ||
        evidence.files[name].bytes !== entry.uncompressedSize
      )
        throw new Error("Portable ZIP inventory differs.");
    }
    fs.mkdirSync(output);
    for (const entry of zip.files) {
      if (entry.type === "Directory") continue;
      const name = entry.path,
        expected = evidence.files[name],
        destination = path.join(output, name);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      const fd = fs.openSync(destination, "wx", 0o600),
        hash = createHash("sha256");
      let size = 0,
        crc = 0;
      try {
        for await (const chunk of entry.stream()) {
          size += chunk.length;
          if (size > expected.bytes || size > MAX_FILE)
            throw new Error("Actual portable ZIP expansion exceeded its bound.");
          writeAll(fd, chunk);
          hash.update(chunk);
          crc = crc32(chunk, crc);
        }
        fs.fsyncSync(fd);
      } finally {
        fs.closeSync(fd);
      }
      if (size !== expected.bytes || hash.digest("hex") !== expected.sha256)
        throw new Error("Actual portable ZIP body differs.");
      if (crc !== entry.crc32) throw new Error("Actual portable ZIP CRC differs.");
      seen.add(name);
    }
    if (seen.size !== Object.keys(evidence.files).length)
      throw new Error("Portable ZIP member missing.");
    input.check();
    return evidence;
  } finally {
    for (const stream of streams) stream.destroy();
    fs.closeSync(input.fd);
  }
}
