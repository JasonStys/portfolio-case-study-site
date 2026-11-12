/**
 * @file Creates a complete bounded offline snapshot of the actual Astro output and its exact public anchor registry.
 * Functions: collectStatic, anchorLinks, createSnapshot and copySnapshot.
 * Variables: fixed media types/budgets, original byte buffers and ordinary exclusive output paths.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { parse, ELEMENT_NODE } from "ultrahtml";
import { decodeHTMLAttribute } from "entities";
const require = createRequire(import.meta.url);
const { ancestors, readRegular, newFile } = require("../desktop/files.cjs");
const {
  OWNER,
  MAX_FILE,
  MAX_TOTAL,
  mediaType,
  verifiedSnapshot,
} = require("../desktop/resources.cjs");
const { VERSION, BASE, HOME, safeName, publicUrl } = require("../desktop/policy.cjs");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function collectStatic(directory) {
  ancestors(directory);
  const pending = [{ directory, prefix: "" }],
    result = new Map(),
    caseNames = new Set();
  let count = 0,
    total = 0;
  while (pending.length) {
    const current = pending.pop(),
      handle = fs.opendirSync(current.directory);
    try {
      let entry;
      while ((entry = handle.readSync()) !== null) {
        if (++count > 8192) throw new Error("Static tree count exceeded.");
        const name = current.prefix + entry.name,
          file = path.join(current.directory, entry.name),
          info = fs.lstatSync(file);
        if (!safeName(name) || info.isSymbolicLink()) throw new Error("Unsafe static path.");
        if (info.isDirectory()) {
          pending.push({ directory: file, prefix: name + "/" });
          continue;
        }
        if (
          result.size >= 4096 ||
          caseNames.has(name.toLowerCase()) ||
          name.toLowerCase() === "source.json"
        )
          throw new Error("Static inventory collision.");
        const bytes = readRegular(file, MAX_FILE);
        total += bytes.length;
        if (total > MAX_TOTAL) throw new Error("Static byte budget exceeded.");
        mediaType(name);
        caseNames.add(name.toLowerCase());
        result.set(name, bytes);
      }
    } finally {
      handle.closeSync();
    }
  }
  if (!result.has("index.html") || !result.has("404.html"))
    throw new Error("Build the complete portfolio first.");
  return result;
}

export function anchorLinks(buffers) {
  const result = new Set();
  for (const [name, bytes] of buffers) {
    if (!name.endsWith(".html")) continue;
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const pending = [parse(text)];
    let count = 0;
    while (pending.length) {
      if (++count > 100000) throw new Error("Static HTML structure exceeded.");
      const node = pending.pop();
      if (
        node.type === ELEMENT_NODE &&
        node.name === "a" &&
        typeof node.attributes.href === "string"
      ) {
        const href = decodeHTMLAttribute(node.attributes.href);
        let url;
        try {
          url = href.startsWith("//")
            ? new URL("https:" + href)
            : new URL(href, new URL(BASE + name, HOME));
        } catch {
          continue;
        }
        const target = publicUrl(url.href);
        if (target) result.add(target);
      }
      if (Array.isArray(node.children)) for (const child of node.children) pending.push(child);
    }
  }
  if (result.size > 5000) throw new Error("Public anchor count exceeded.");
  return [...result].sort();
}

export function createSnapshot({ directory, ownerRoot, output, source, sourceDirty }) {
  if (!/^[a-f0-9]{40}$/u.test(source) || typeof sourceDirty !== "boolean")
    throw new Error("Exact source identity required.");
  const input = path.resolve(directory),
    destination = path.resolve(output),
    owners = path.resolve(ownerRoot);
  for (const boundary of [input, owners]) {
    const relative = path.relative(boundary, destination);
    if (
      !relative ||
      (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(".." + path.sep))
    )
      throw new Error("Snapshot output must stay outside input trees.");
  }
  ancestors(path.dirname(destination));
  if (fs.existsSync(destination)) throw new Error("A fresh snapshot directory is required.");
  const buffers = collectStatic(input);
  const metadata = {
    schema: 1,
    product: "portfolio-case-study-site",
    version: VERSION,
    source,
    sourceDirty,
    base: BASE,
    files: Object.fromEntries(
      [...buffers]
        .sort(([a], [b]) => a.localeCompare(b, "en"))
        .map(([name, bytes]) => [
          name,
          { sha256: digest(bytes), bytes: bytes.length, mediaType: mediaType(name) },
        ]),
    ),
    externalLinks: anchorLinks(buffers),
    owner: Object.fromEntries(
      OWNER.map((name) => [name, digest(readRegular(path.join(owners, name), 1024 * 1024))]),
    ),
  };
  const encoded = Buffer.from(JSON.stringify(metadata, null, 2) + "\n");
  if (encoded.length > 4 * 1024 * 1024) throw new Error("Snapshot metadata exceeded.");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.mkdirSync(destination);
  for (const [name, bytes] of buffers) {
    const file = path.join(destination, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    newFile(file, bytes);
  }
  newFile(path.join(destination, "SOURCE.json"), encoded);
  verifiedSnapshot(destination, owners);
  return metadata;
}

export function copySnapshot(directory, output, ownerRoot) {
  const snapshot = verifiedSnapshot(directory, ownerRoot);
  ancestors(path.dirname(output));
  fs.mkdirSync(output);
  for (const [name, bytes] of snapshot.buffers) {
    const file = path.join(output, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    newFile(file, bytes);
  }
  newFile(
    path.join(output, "SOURCE.json"),
    readRegular(path.join(directory, "SOURCE.json"), 4 * 1024 * 1024),
  );
}
