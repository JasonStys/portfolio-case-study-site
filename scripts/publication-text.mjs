/**
 * @file Keeps only the two named Word editions' complete XML and relationships visible to source privacy checks.
 * Functions: publicationText, boundedBytes, wordText, xmlText and CRC helpers; no extraction or content execution.
 * Variables: compressed, member, expansion, XML and traversal budgets. Line locations: docs/CODE_INDEX.md.
 */
import { closeSync, constants, fstatSync, lstatSync, openSync, readSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

const maxBytes = 8 * 1024 * 1024;
const maxXmlBytes = 2 * 1024 * 1024;
const utf8 = new TextDecoder("utf-8", { fatal: true });

/** Reject malformed package claims with an active guard, including optimized Node execution. */
function requireValue(condition, message) {
  if (!condition) throw new Error(`Reviewed publication: ${message}`);
}

/** Inspect characters in place without allocating a second full source array. */
function hasControl(value, mode = "text") {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (
      (code < 32 && (mode === "name" || ![9, 10, 13].includes(code))) ||
      (mode === "name" && code === 127) ||
      (mode === "xml" && code >= 0xfffe)
    )
      return true;
  }
  return false;
}

/** Read one opened descriptor up to a fixed cap, retaining the original file identity. */
function boundedBytes(path) {
  const descriptor = openSync(
    path,
    constants.O_RDONLY | (constants.O_NONBLOCK ?? 0) | (constants.O_NOFOLLOW ?? 0),
  );
  try {
    const status = fstatSync(descriptor);
    const named = lstatSync(path);
    requireValue(
      status.isFile() &&
        named.isFile() &&
        !named.isSymbolicLink() &&
        status.nlink === 1 &&
        named.nlink === 1 &&
        status.dev === named.dev &&
        status.ino === named.ino &&
        status.size === named.size,
      "only one ordinary single-link source descriptor can be inspected",
    );
    requireValue(status.size <= maxBytes, "file exceeds byte budget");
    const buffer = Buffer.alloc(Math.min(status.size + 1, maxBytes + 1));
    let count = 0;
    while (count < buffer.length) {
      const received = readSync(descriptor, buffer, count, buffer.length - count, count);
      if (!received) break;
      count += received;
    }
    const after = fstatSync(descriptor);
    const current = lstatSync(path);
    requireValue(
      count <= maxBytes &&
        count === status.size &&
        after.size === status.size &&
        after.nlink === 1 &&
        after.mtimeMs === status.mtimeMs &&
        after.ctimeMs === status.ctimeMs &&
        current.isFile() &&
        !current.isSymbolicLink() &&
        current.nlink === 1 &&
        current.dev === status.dev &&
        current.ino === status.ino &&
        current.size === status.size,
      "file identity or byte count changed while inspected",
    );
    return buffer.subarray(0, count);
  } finally {
    closeSync(descriptor);
  }
}

/** Decode only XML's built-in/numeric references; declared/custom entities never expand. */
function entityText(value) {
  requireValue(
    !/&(?!amp;|lt;|gt;|quot;|apos;|#[0-9]+;|#x[0-9a-fA-F]+;)/u.test(value),
    "unknown or malformed XML entity",
  );
  return value.replace(/&(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);/gu, (_, name) => {
    const predefined = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
    if (Object.hasOwn(predefined, name)) return predefined[name];
    const code = name.startsWith("#x") ? Number.parseInt(name.slice(2), 16) : Number(name.slice(1));
    requireValue(
      Number.isSafeInteger(code) &&
        (code === 9 ||
          code === 10 ||
          code === 13 ||
          (code >= 32 && code <= 0xd7ff) ||
          (code >= 0xe000 && code <= 0xfffd) ||
          (code >= 0x10000 && code <= 0x10ffff)),
      "invalid XML character reference",
    );
    return String.fromCodePoint(code);
  });
}

/** Share one post-decode rule for literal text and non-displayed formatting whitespace. */
function canonicalFragment(value, literal) {
  return literal || value.trim() ? value : "";
}

/** Check bounded ordinary OOXML syntax without DTDs, then retain raw and decoded text for privacy scans. */
function xmlText(payload, onOpen) {
  const source = utf8.decode(payload);
  requireValue(
    !/<!\s*(?:DOCTYPE|ENTITY)\b/iu.test(source),
    "DTD and entity declarations are unsupported",
  );
  requireValue(!hasControl(source, "xml"), "invalid XML character");
  const stack = [],
    visible = [],
    decodedAttributes = [];
  let cursor = 0,
    roots = 0,
    tokens = 0;
  while (cursor < source.length) {
    requireValue(++tokens <= 100000, "XML token budget");
    if (source[cursor] !== "<") {
      let next = source.indexOf("<", cursor);
      if (next < 0) next = source.length;
      const value = source.slice(cursor, next);
      requireValue(stack.length > 0 || value.trim() === "", "text outside XML root");
      requireValue(!value.includes("]]>"), "malformed XML text");
      const literal = /(?:^|:)(?:t|instrText|delText)$/u.test(stack.at(-1) ?? "");
      // Decode before classifying formatting; numeric newlines between runs are not displayed text.
      visible.push(canonicalFragment(entityText(value), literal));
      cursor = next;
      continue;
    }
    if (source.startsWith("<!--", cursor)) {
      const end = source.indexOf("-->", cursor + 4);
      requireValue(
        end >= 0 && !source.slice(cursor + 4, end).includes("--"),
        "malformed XML comment",
      );
      cursor = end + 3;
      continue;
    }
    if (source.startsWith("<![CDATA[", cursor)) {
      const end = source.indexOf("]]>", cursor + 9);
      requireValue(stack.length > 0 && end >= 0, "malformed XML CDATA");
      const value = source.slice(cursor + 9, end);
      const literal = /(?:^|:)(?:t|instrText|delText)$/u.test(stack.at(-1) ?? "");
      visible.push(canonicalFragment(value, literal));
      cursor = end + 3;
      continue;
    }
    if (source.startsWith("<?", cursor)) {
      const end = source.indexOf("?>", cursor + 2);
      requireValue(
        end >= 0 && /^[A-Za-z_][A-Za-z0-9_.:-]*(?:\s|\?)/u.test(source.slice(cursor + 2, end + 1)),
        "malformed XML instruction",
      );
      cursor = end + 2;
      continue;
    }
    requireValue(!source.startsWith("<!", cursor), "unsupported XML declaration");
    let end = cursor + 1,
      quote = "";
    for (; end < source.length; end++) {
      const character = source[end];
      if (quote) {
        if (character === quote) quote = "";
      } else if (character === '"' || character === "'") quote = character;
      else if (character === ">") break;
    }
    requireValue(end < source.length && !quote, "unterminated XML tag");
    let tag = source.slice(cursor + 1, end);
    if (tag.startsWith("/")) {
      const closing = /^\/([A-Za-z_][A-Za-z0-9_.:-]*)\s*$/u.exec(tag);
      requireValue(closing && stack.pop() === closing[1], "mismatched XML closing tag");
      if (/(?:^|:)p$/u.test(closing[1])) visible.push("\n");
    } else {
      const selfClosing = tag.endsWith("/");
      if (selfClosing) tag = tag.slice(0, -1);
      const opening = /^([A-Za-z_][A-Za-z0-9_.:-]*)([\s\S]*)$/u.exec(tag);
      requireValue(opening, "invalid XML element name");
      const attributes = new Map();
      let rest = opening[2];
      while (rest.trim()) {
        const attribute = /^\s+([A-Za-z_][A-Za-z0-9_.:-]*)\s*=\s*(["'])([\s\S]*?)\2/u.exec(rest);
        requireValue(
          attribute && !attributes.has(attribute[1]) && !attribute[3].includes("<"),
          "malformed or duplicate XML attribute",
        );
        const decoded = entityText(attribute[3]);
        attributes.set(attribute[1], decoded);
        decodedAttributes.push(decoded);
        rest = rest.slice(attribute[0].length);
      }
      if (stack.length === 0) requireValue(++roots === 1, "multiple XML roots");
      if (onOpen) onOpen(opening[1], attributes, stack.length);
      if (selfClosing && /(?:^|:)(?:br|cr|tab)$/u.test(opening[1])) visible.push("\n");
      if (!selfClosing) {
        stack.push(opening[1]);
        requireValue(stack.length <= 128, "XML depth budget");
      }
    }
    cursor = end + 1;
  }
  requireValue(roots === 1 && stack.length === 0, "missing or unclosed XML root");
  return source + "\n" + visible.join("") + "\n" + decodedAttributes.join("\n");
}

/** Admit conventional OPC type declarations so every declared XML part is inspected regardless of suffix. */
function contentTypes(parts) {
  const defaults = new Map(),
    overrides = new Map();
  const entry = parts.find((part) => part.name === "[Content_Types].xml");
  requireValue(entry, "content type declarations missing");
  requireValue(entry.payload.length <= maxXmlBytes, "XML inspection budget");
  const text = xmlText(entry.payload, (name, attributes, depth) => {
    if (depth === 0) {
      requireValue(
        name === "Types" &&
          attributes.size === 1 &&
          attributes.get("xmlns") ===
            "http://schemas.openxmlformats.org/package/2006/content-types",
        "unsupported content type root",
      );
      return;
    }
    requireValue(
      depth === 1 && (name === "Default" || name === "Override") && attributes.size === 2,
      "unsupported content type declaration",
    );
    const type = attributes.get("ContentType");
    requireValue(
      typeof type === "string" &&
        type.length <= 200 &&
        /^[A-Za-z0-9.+-]+\/[A-Za-z0-9.+-]+$/u.test(type) &&
        !/macroenabled|vbaproject|oleobject|activex/iu.test(type),
      "unsupported declared content type",
    );
    if (name === "Default") {
      const extension = attributes.get("Extension");
      requireValue(
        typeof extension === "string" &&
          /^[A-Za-z0-9]+$/u.test(extension) &&
          !defaults.has(extension.toLowerCase()),
        "ambiguous default content type",
      );
      defaults.set(extension.toLowerCase(), type.toLowerCase());
    } else {
      const part = attributes.get("PartName");
      requireValue(
        typeof part === "string" &&
          part.startsWith("/") &&
          parts.some((candidate) => candidate.name === part.slice(1)) &&
          !overrides.has(part.toLowerCase()),
        "ambiguous override content type",
      );
      overrides.set(part.toLowerCase(), type.toLowerCase());
    }
    requireValue(defaults.size + overrides.size <= 256, "content type declaration budget");
  });
  return {
    text,
    bytes: entry.payload.length,
    typeFor: (name) =>
      overrides.get("/" + name.toLowerCase()) ?? defaults.get(name.split(".").at(-1).toLowerCase()),
  };
}

/** Non-XML content is limited to declared conventional PNG/JPEG images with real binary signatures. */
function imagePart(payload, name, type) {
  const lower = name.toLowerCase();
  return (
    (type === "image/png" &&
      lower.endsWith(".png") &&
      payload.length >= 8 &&
      payload.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (type === "image/jpeg" &&
      /\.jpe?g$/u.test(lower) &&
      payload.length >= 3 &&
      payload[0] === 255 &&
      payload[1] === 216 &&
      payload[2] === 255)
  );
}

/** Compute standard ZIP CRC-32 for each fully decoded member, including non-XML parts. */
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}

/** Inspect a conventional single-disk ZIP, rejecting ambiguity, active payloads and expansion abuse. */
function wordText(bytes) {
  let end = -1;
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset -= 1) {
    if (
      bytes.readUInt32LE(offset) === 0x06054b50 &&
      offset + 22 + bytes.readUInt16LE(offset + 20) === bytes.length
    ) {
      end = offset;
      break;
    }
  }
  requireValue(end >= 0, "missing ZIP end record");
  const count = bytes.readUInt16LE(end + 10);
  let cursor = bytes.readUInt32LE(end + 16);
  const directoryEnd = cursor + bytes.readUInt32LE(end + 12);
  requireValue(
    bytes.readUInt16LE(end + 4) === 0 &&
      bytes.readUInt16LE(end + 6) === 0 &&
      bytes.readUInt16LE(end + 8) === count,
    "split ZIP is unsupported",
  );
  requireValue(
    count > 0 && count <= 256 && directoryEnd === end,
    "directory identity or member budget",
  );
  const names = new Set();
  const folded = new Set();
  const ranges = [];
  const text = [];
  const parts = [];
  let expanded = 0;
  for (let index = 0; index < count; index += 1) {
    requireValue(
      cursor + 46 <= directoryEnd && bytes.readUInt32LE(cursor) === 0x02014b50,
      "invalid directory member",
    );
    const flags = bytes.readUInt16LE(cursor + 8);
    const method = bytes.readUInt16LE(cursor + 10);
    const expectedCrc = bytes.readUInt32LE(cursor + 16);
    const compressed = bytes.readUInt32LE(cursor + 20);
    const size = bytes.readUInt32LE(cursor + 24);
    const nameLength = bytes.readUInt16LE(cursor + 28);
    const next =
      cursor + 46 + nameLength + bytes.readUInt16LE(cursor + 30) + bytes.readUInt16LE(cursor + 32);
    requireValue(
      next <= directoryEnd && bytes.readUInt16LE(cursor + 34) === 0,
      "invalid directory extent",
    );
    const nameBytes = bytes.subarray(cursor + 46, cursor + 46 + nameLength);
    const name = utf8.decode(nameBytes);
    const directory = name.endsWith("/");
    const pathParts = (directory ? name.slice(0, -1) : name).split("/");
    requireValue(
      name.length > 0 &&
        !folded.has(name.toLowerCase()) &&
        !name.startsWith("/") &&
        !name.includes("\\") &&
        !name.includes(":") &&
        !hasControl(name, "name") &&
        !pathParts.some((part) => part === ".." || part === "." || part === ""),
      "ambiguous member name",
    );
    requireValue(
      !(flags & 9) &&
        [0, 8].includes(method) &&
        ((bytes.readUInt32LE(cursor + 38) >>> 16) & 0xf000) !== 0xa000 &&
        (!directory || (size === 0 && compressed === 0 && expectedCrc === 0 && method === 0)) &&
        !/vbaproject|\/embeddings\//i.test(name),
      "active, encrypted or unsupported member",
    );
    names.add(name);
    folded.add(name.toLowerCase());
    expanded += size;
    requireValue(expanded <= maxBytes && size <= maxXmlBytes, "expanded member budget");
    const local = bytes.readUInt32LE(cursor + 42);
    requireValue(
      local + 30 <= bytes.readUInt32LE(end + 16) && bytes.readUInt32LE(local) === 0x04034b50,
      "invalid local member",
    );
    const localNameEnd = local + 30 + bytes.readUInt16LE(local + 26);
    const start = localNameEnd + bytes.readUInt16LE(local + 28);
    const finish = start + compressed;
    requireValue(
      bytes.readUInt16LE(local + 6) === flags &&
        bytes.readUInt16LE(local + 8) === method &&
        bytes.readUInt32LE(local + 14) === expectedCrc &&
        bytes.readUInt32LE(local + 18) === compressed &&
        bytes.readUInt32LE(local + 22) === size &&
        localNameEnd <= start &&
        finish <= bytes.readUInt32LE(end + 16),
      "local member disagrees with directory",
    );
    requireValue(
      bytes.subarray(local + 30, localNameEnd).equals(nameBytes) &&
        ranges.every(([a, b]) => finish <= a || local >= b),
      "aliased or overlapping member",
    );
    ranges.push([local, finish]);
    const encoded = bytes.subarray(start, finish);
    const payload =
      method === 8 ? inflateRawSync(encoded, { maxOutputLength: maxXmlBytes }) : encoded;
    requireValue(
      payload.length === size && crc32(payload) === expectedCrc,
      "member size or CRC mismatch",
    );
    if (!directory) parts.push({ name, payload });
    cursor = next;
  }
  requireValue(
    cursor === directoryEnd && names.has("[Content_Types].xml") && names.has("word/document.xml"),
    "required Word parts missing",
  );
  const declared = contentTypes(parts);
  let xmlBytes = declared.bytes;
  text.push(declared.text);
  for (const part of parts) {
    if (part.name !== "[Content_Types].xml") {
      const type = declared.typeFor(part.name);
      const xml = typeof type === "string" && /(?:\/xml|\+xml)$/u.test(type);
      requireValue(
        xml || (!/\.(?:xml|rels)$/iu.test(part.name) && imagePart(part.payload, part.name, type)),
        "undeclared or contradictory package part type",
      );
      if (xml) {
        requireValue(xmlBytes + part.payload.length <= maxXmlBytes, "XML inspection budget");
        xmlBytes += part.payload.length;
        text.push(xmlText(part.payload));
      }
    }
  }
  return text.join("\n");
}

/** Decode ordinary source strictly; only the exact reviewed edition receives bounded ZIP handling. */
export function publicationText(path, repositoryPath) {
  const bytes = boundedBytes(path);
  if (
    [
      "docs/reports/project-guide.docx",
      "docs/reports/windows-application-guide-1.1.0.docx",
    ].includes(repositoryPath)
  )
    return wordText(bytes);
  requireValue(!repositoryPath.toLowerCase().endsWith(".docx"), "unknown Word edition");
  const source = utf8.decode(bytes);
  requireValue(!hasControl(source), "unknown binary is not ordinary UTF-8 source");
  return source;
}
