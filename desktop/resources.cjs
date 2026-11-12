/**
 * @file Verifies the complete fixed offline site and owner before serving any page or browser bridge.
 * Functions: mediaType, verifiedSnapshot, responseFor and canNavigate.
 * Variables: bounded immutable buffers, file/name budgets and fixed owner hashes; no request-derived filesystem path.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { readRegular, readUtf8, createAncestorAdmission } = require("./files.cjs");
const { VERSION, BASE, ownUrl, safeName, publicUrl, documentRoutes } = require("./policy.cjs");
const OWNER = [
  "files.cjs",
  "profile.cjs",
  "policy.cjs",
  "resources.cjs",
  "operations.cjs",
  "preload.cjs",
  "main.mjs",
];
const MAX_TOTAL = 64 * 1024 * 1024;
const MAX_FILE = 8 * 1024 * 1024;
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
const CSP =
  "default-src 'none'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-src 'none'; form-action 'none'; worker-src 'none'";

function mediaType(name) {
  const value = TYPES[path.posix.extname(name)];
  if (!value) throw new Error("Unsupported static resource type.");
  return value;
}

function verifiedSnapshot(root, ownerRoot) {
  const metadata = JSON.parse(readUtf8(path.join(root, "SOURCE.json"), 4 * 1024 * 1024));
  if (
    !metadata ||
    Object.keys(metadata).sort().join("|") !==
      "base|externalLinks|files|owner|product|schema|source|sourceDirty|version" ||
    metadata.schema !== 1 ||
    metadata.product !== "portfolio-case-study-site" ||
    metadata.version !== VERSION ||
    metadata.base !== BASE ||
    !/^[a-f0-9]{40}$/u.test(metadata.source) ||
    typeof metadata.sourceDirty !== "boolean" ||
    !metadata.files ||
    Array.isArray(metadata.files) ||
    !metadata.owner ||
    Object.keys(metadata.owner).sort().join("|") !== [...OWNER].sort().join("|")
  )
    throw new Error("Offline portfolio identity differs.");
  const names = Object.keys(metadata.files);
  if (
    names.length < 2 ||
    names.length > 4096 ||
    !names.includes("index.html") ||
    !names.includes("404.html")
  )
    throw new Error("Offline portfolio inventory is incomplete.");
  const caseNames = new Set(),
    directories = new Set([""]);
  for (const name of names) {
    if (!safeName(name) || caseNames.has(name.toLowerCase()) || name === "SOURCE.json")
      throw new Error("Unsafe static resource name.");
    caseNames.add(name.toLowerCase());
    const item = metadata.files[name];
    if (
      !item ||
      Object.keys(item).sort().join("|") !== "bytes|mediaType|sha256" ||
      !Number.isSafeInteger(item.bytes) ||
      item.bytes < 0 ||
      item.bytes > MAX_FILE ||
      item.mediaType !== mediaType(name) ||
      typeof item.sha256 !== "string" ||
      !/^[a-f0-9]{64}$/u.test(item.sha256)
    )
      throw new Error("Invalid static resource identity.");
    let parent = path.posix.dirname(name);
    while (parent !== ".") {
      directories.add(parent);
      parent = path.posix.dirname(parent);
    }
  }
  const pending = [""],
    found = new Set();
  let entries = 0;
  while (pending.length) {
    const relative = pending.pop();
    const handle = fs.opendirSync(path.join(root, relative));
    try {
      let entry;
      while ((entry = handle.readSync()) !== null) {
        if (++entries > 8192) throw new Error("Static tree count exceeded.");
        const name = relative ? relative + "/" + entry.name : entry.name;
        if (name === "SOURCE.json") continue;
        const value = fs.lstatSync(path.join(root, name));
        if (value.isSymbolicLink()) throw new Error("Static aliases are refused.");
        if (value.isDirectory()) {
          if (!directories.has(name)) throw new Error("Unknown static directory.");
          pending.push(name);
        } else {
          if (!Object.hasOwn(metadata.files, name)) throw new Error("Unknown static member.");
          found.add(name);
        }
      }
    } finally {
      handle.closeSync();
    }
  }
  if (found.size !== names.length) throw new Error("Static inventory member missing.");
  const admit = createAncestorAdmission(),
    buffers = new Map();
  let total = 0;
  for (const name of names) {
    const bytes = readRegular(path.join(root, name), MAX_FILE, admit),
      expected = metadata.files[name];
    total += bytes.length;
    if (
      total > MAX_TOTAL ||
      bytes.length !== expected.bytes ||
      createHash("sha256").update(bytes).digest("hex") !== expected.sha256
    )
      throw new Error("Static resource bytes differ.");
    buffers.set(name, bytes);
  }
  for (const name of OWNER) {
    const bytes = readRegular(path.join(ownerRoot, name), 1024 * 1024, admit);
    if (
      typeof metadata.owner[name] !== "string" ||
      createHash("sha256").update(bytes).digest("hex") !== metadata.owner[name]
    )
      throw new Error("Native owner bytes differ.");
  }
  if (
    !Array.isArray(metadata.externalLinks) ||
    metadata.externalLinks.length > 5000 ||
    new Set(metadata.externalLinks).size !== metadata.externalLinks.length ||
    metadata.externalLinks.some((value) => !publicUrl(value))
  )
    throw new Error("Approved public link list differs.");
  return {
    metadata,
    buffers,
    documents: documentRoutes(metadata.files),
    externalLinks: new Set(metadata.externalLinks),
  };
}

function canNavigate(value, snapshot) {
  const url = ownUrl(value);
  return Boolean(url && snapshot.documents.has(url.pathname));
}

function responseFor(request, snapshot) {
  const url = ownUrl(request.url);
  const headers = {
    "Content-Security-Policy": CSP,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Referrer-Policy": "no-referrer",
  };
  if (!url) return new Response("Not found", { status: 404, headers });
  if (!["GET", "HEAD"].includes(request.method))
    return new Response("Method not allowed", { status: 405, headers });
  const file =
    snapshot.documents.get(url.pathname) ??
    (url.pathname.startsWith(BASE) ? url.pathname.slice(BASE.length) : null);
  const entry = file && snapshot.metadata.files[file],
    bytes = file && snapshot.buffers.get(file);
  if (!entry || !bytes)
    return new Response(request.method === "HEAD" ? null : snapshot.buffers.get("404.html"), {
      status: 404,
      headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
    });
  const type = entry.mediaType;
  return new Response(request.method === "HEAD" ? null : bytes, {
    status: 200,
    headers: {
      ...headers,
      "Content-Type":
        type +
        (/^(?:text\/|application\/(?:json|xml|manifest\+json))/u.test(type)
          ? "; charset=utf-8"
          : ""),
    },
  });
}

module.exports = {
  OWNER,
  MAX_TOTAL,
  MAX_FILE,
  mediaType,
  verifiedSnapshot,
  canNavigate,
  responseFor,
};
