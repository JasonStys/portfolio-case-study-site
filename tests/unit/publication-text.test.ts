/**
 * @file Exercises the exact-edition Office privacy reader with genuine inert ZIP records and XML bodies.
 * Functions: crc32, archive, wordParts, inspect and independent corruption/scan counterexamples.
 * Variables: owned temporary fixture directory and measured real inflater output limits.
 * Line locations: see docs/CODE_INDEX.md. No published documents, accounts, extraction or network.
 */
import {
  lstatSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  truncateSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { deflateRawSync } from "node:zlib";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const inflation = vi.hoisted(() => ({ limits: [] as unknown[] }));
vi.mock("node:zlib", async (original) => {
  const actual = await original<typeof import("node:zlib")>();
  return {
    ...actual,
    inflateRawSync(...args: Parameters<typeof actual.inflateRawSync>) {
      inflation.limits.push(args[1]?.maxOutputLength);
      return actual.inflateRawSync(...args);
    },
  };
});
import { publicationText } from "../../scripts/publication-text.mjs";

const BYTE_CAP = 8 * 1024 * 1024;
const XML_CAP = 2 * 1024 * 1024;
const OLD_GUIDE = "docs/reports/project-guide.docx";
const CURRENT_GUIDE = "docs/reports/windows-application-guide-1.1.0.docx";
const TOKEN = "ghp_" + "M".repeat(24);
const COMPANY_MARKER = "opto" + " 22";
const runtime = path.resolve(".runtime");
let scratch = "";
let sequence = 0;

type Entry = {
  name: string;
  body: string | Buffer;
  method?: number;
  flags?: number;
  nameBytes?: Buffer;
  size?: number;
  crc?: number;
  mode?: number;
};
type Position = { local: number; data: number; central: number; name: string };

/** Independent conventional ZIP CRC-32, not a value copied from the reader implementation. */
function crc32(bytes: Buffer) {
  const polynomial = 0xedb88320;
  let crc = 0xffffffff;
  for (const byte of bytes) {
    let current = (crc ^ byte) & 0xff;
    for (let bit = 0; bit < 8; bit++) current = (current >>> 1) ^ ((current & 1) * polynomial);
    crc = (crc >>> 8) ^ current;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Build real local/central/end records, with explicit independent forged-field controls. */
function archive(entries: Entry[], comment = Buffer.alloc(0)) {
  const locals: Buffer[] = [];
  const central: Buffer[] = [];
  const positions: Position[] = [];
  let offset = 0;
  for (const entry of entries) {
    const body = Buffer.isBuffer(entry.body) ? entry.body : Buffer.from(entry.body);
    const name = entry.nameBytes ?? Buffer.from(entry.name);
    const method = entry.method ?? 0;
    const encoded = method === 8 ? deflateRawSync(body) : body;
    const flags = entry.flags ?? 0x800;
    const crc = entry.crc ?? crc32(body);
    const size = entry.size ?? body.length;
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(flags, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(33, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(encoded.length, 18);
    local.writeUInt32LE(size, 22);
    local.writeUInt16LE(name.length, 26);
    const member = Buffer.concat([local, name, encoded]);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(0x0314, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(flags, 8);
    directory.writeUInt16LE(method, 10);
    directory.writeUInt16LE(33, 14);
    directory.writeUInt32LE(crc, 16);
    directory.writeUInt32LE(encoded.length, 20);
    directory.writeUInt32LE(size, 24);
    directory.writeUInt16LE(name.length, 28);
    directory.writeUInt32LE(((entry.mode ?? 0o100644) * 65536) >>> 0, 38);
    directory.writeUInt32LE(offset, 42);
    positions.push({
      local: offset,
      data: offset + local.length + name.length,
      central: 0,
      name: entry.name,
    });
    locals.push(member);
    central.push(Buffer.concat([directory, name]));
    offset += member.length;
  }
  const centralOffset = offset;
  for (const [index, record] of central.entries()) {
    const position = positions[index];
    if (!position) throw new Error("Independent ZIP fixture position is missing.");
    position.central = offset;
    offset += record.length;
  }
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(offset - centralOffset, 12);
  end.writeUInt32LE(centralOffset, 16);
  end.writeUInt16LE(comment.length, 20);
  return {
    bytes: Buffer.concat([...locals, ...central, end, comment]),
    positions,
    centralOffset,
    endOffset: offset,
  };
}

function wordParts(
  document = '<w:document xmlns:w="urn:synthetic-word"><w:body><w:p><w:r><w:t>Synthetic guide</w:t></w:r></w:p></w:body></w:document>',
  method = 0,
): Entry[] {
  return [
    {
      name: "[Content_Types].xml",
      body: '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/></Types>',
      method,
    },
    { name: "word/document.xml", body: document, method },
    {
      name: "word/_rels/document.xml.rels",
      body: '<Relationships xmlns="urn:synthetic-relationships"><Relationship Id="r1" Target="https://example.invalid/reference" Type="urn:synthetic"/></Relationships>',
      method,
    },
  ];
}

/** Require an independently named fixture part before applying one isolated mutation. */
function requiredPart(parts: Entry[], name: string): Entry {
  const part = parts.find((item) => item.name === name);
  if (!part) throw new Error("An independently named fixture part is missing.");
  return part;
}

function inspect(bytes: Buffer, repositoryPath = CURRENT_GUIDE) {
  const file = path.join(scratch, `fixture-${sequence++}.docx`);
  writeFileSync(file, bytes, { flag: "wx", mode: 0o600 });
  return publicationText(file, repositoryPath);
}

beforeEach(() => {
  try {
    mkdirSync(runtime, { mode: 0o700 });
  } catch (error) {
    if (
      error === null ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "EEXIST"
    )
      throw error;
  }
  const parent = lstatSync(runtime);
  if (!parent.isDirectory() || parent.isSymbolicLink())
    throw new Error("Ordinary owned runtime parent required.");
  scratch = mkdtempSync(path.join(realpathSync.native(runtime), "publication-text-unit-"));
  sequence = 0;
  inflation.limits = [];
});
afterEach(() => {
  if (!scratch) return;
  const actual = realpathSync.native(scratch);
  const status = lstatSync(scratch);
  if (
    path.dirname(actual) !== realpathSync.native(runtime) ||
    !path.basename(actual).startsWith("publication-text-unit-") ||
    !status.isDirectory() ||
    status.isSymbolicLink()
  )
    throw new Error("Refuse cleanup outside this exact fresh owned fixture directory.");
  rmSync(actual, { recursive: true, force: false });
  scratch = "";
});

describe("exact-edition Office source visibility", () => {
  it("calibrates the independent ZIP CRC builder against the standard check vector", () => {
    expect(crc32(Buffer.from("123456789"))).toBe(0xcbf43926);
  });

  it.each([OLD_GUIDE, CURRENT_GUIDE])(
    "reads real stored Word/XML/relationship bytes only for %s",
    (name) => {
      const result = inspect(archive(wordParts()).bytes, name);
      expect(result).toContain("Synthetic guide");
      expect(result).toContain(
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
      );
      expect(result).toContain("https://example.invalid/reference");
    },
  );

  it("exposes compressed markers in document and relationship XML to unchanged privacy patterns", () => {
    const parts = wordParts(
      `<w:document xmlns:w="urn:synthetic-word"><w:t>${TOKEN}</w:t></w:document>`,
      8,
    );
    parts.push({
      name: "docProps/core.xml",
      body: `<metadata>${COMPANY_MARKER}</metadata>`,
      method: 8,
    });
    const rel = parts[2];
    if (!rel) throw new Error("Independent relationship part required.");
    rel.body = `<Relationships><Relationship Target="https://example.invalid/${TOKEN}"/></Relationships>`;
    const zip = archive(parts).bytes;
    expect(zip.includes(Buffer.from(TOKEN))).toBe(false);
    expect(zip.includes(Buffer.from(COMPANY_MARKER))).toBe(false);
    const result = inspect(zip);
    expect(/ghp_[A-Za-z0-9]{20,}/u.test(result)).toBe(true);
    expect(/opto\s*22/iu.test(result)).toBe(true);
    expect(inflation.limits.length).toBe(parts.length);
    expect(
      inflation.limits.every((value) => typeof value === "number" && value > 0 && value <= XML_CAP),
    ).toBe(true);
  });

  it("retains decoded numeric references and text split across actual Word runs", () => {
    const document = `<w:document xmlns:w="urn:synthetic-word"><w:p><w:r><w:t>op</w:t></w:r><w:r><w:t>to&#32;22</w:t></w:r></w:p><w:t>&#103;hp_${"M".repeat(24)}</w:t></w:document>`;
    const raw = archive(wordParts(document, 8)).bytes;
    const result = inspect(raw);
    expect(/opto\s*22/iu.test(result)).toBe(true);
    expect(result).toContain(TOKEN);
  });

  it("does not let valid pretty-printing between Word runs hide displayed markers", () => {
    const document = `<w:document xmlns:w="urn:synthetic-word">
      <w:p>
        <w:r><w:t>gh</w:t></w:r>
        <w:r><w:t>p_${"M".repeat(24)}</w:t></w:r>
      </w:p>
      <w:p>
        <w:r><w:t>op</w:t></w:r>
        <w:r><w:t>to 22</w:t></w:r>
      </w:p>
    </w:document>`;
    const result = inspect(archive(wordParts(document, 8)).bytes);
    expect(result).toContain(TOKEN);
    expect(/opto\s*22/iu.test(result)).toBe(true);
  });

  it("preserves actual literal spaces within Word text rather than deleting every whitespace node", () => {
    const document = `<w:document xmlns:w="urn:synthetic-word"><w:p><w:r><w:t>gh</w:t></w:r><w:r><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>p_${"M".repeat(24)}</w:t></w:r></w:p></w:document>`;
    const result = inspect(archive(wordParts(document)).bytes);
    expect(result).not.toContain(TOKEN);
    expect(result).toContain("gh p_" + "M".repeat(24));
  });

  it("does not let formatting-only CDATA between displayed runs hide a marker", () => {
    const document = `<w:document xmlns:w="urn:synthetic-word"><w:p><w:r><w:t>gh</w:t></w:r><![CDATA[\n  ]]><w:r><w:t>p_${"M".repeat(24)}</w:t></w:r></w:p></w:document>`;
    expect(inspect(archive(wordParts(document, 8)).bytes)).toContain(TOKEN);
  });

  it("preserves a literal CDATA space inside a displayed Word text element", () => {
    const document = `<w:document xmlns:w="urn:synthetic-word"><w:p><w:r><w:t>gh</w:t></w:r><w:r><w:t><![CDATA[ ]]></w:t></w:r><w:r><w:t>p_${"M".repeat(24)}</w:t></w:r></w:p></w:document>`;
    const result = inspect(archive(wordParts(document, 8)).bytes);
    expect(result).not.toContain(TOKEN);
    expect(result).toContain("gh p_" + "M".repeat(24));
  });

  it("classifies numeric whitespace after decoding so formatting between runs cannot hide a marker", () => {
    const document = `<w:document xmlns:w="urn:synthetic-word"><w:p><w:r><w:t>gh</w:t></w:r>&#10;  <w:r><w:t>p_${"M".repeat(24)}</w:t></w:r></w:p></w:document>`;
    expect(inspect(archive(wordParts(document, 8)).bytes)).toContain(TOKEN);
  });

  it("retains numeric whitespace inside a literal Word text element", () => {
    const document = `<w:document xmlns:w="urn:synthetic-word"><w:p><w:r><w:t>gh</w:t></w:r><w:r><w:t>&#32;</w:t></w:r><w:r><w:t>p_${"M".repeat(24)}</w:t></w:r></w:p></w:document>`;
    const result = inspect(archive(wordParts(document, 8)).bytes);
    expect(result).not.toContain(TOKEN);
    expect(result).toContain("gh p_" + "M".repeat(24));
  });

  it("rejects the aggregate XML budget before parsing a malformed later part", () => {
    const parts = wordParts(`<r>${"x".repeat(XML_CAP - 1024)}</r>`, 8);
    parts.push({ name: "docProps/core.xml", body: `<r>${"x".repeat(2048)}`, method: 8 });
    expect(() => inspect(archive(parts).bytes)).toThrow(/XML inspection budget/);
  });

  it("inspects uppercase XML suffixes and every declared XML override regardless of suffix", () => {
    for (const name of ["docProps/custom.XML", "word/custom.payload", "word/media/claimed.png"]) {
      const parts = wordParts(undefined, 8);
      const types = requiredPart(parts, "[Content_Types].xml");
      types.body = String(types.body).replace(
        "</Types>",
        `<Override PartName="/${name}" ContentType="application/xml"/></Types>`,
      );
      parts.push({ name, body: `<r>${TOKEN}</r>`, method: 8 });
      const zip = archive(parts).bytes;
      expect(zip.includes(Buffer.from(TOKEN))).toBe(false);
      expect(inspect(zip)).toContain(TOKEN);
    }
  });

  it("rejects case-equivalent package parts before one can shadow another reader's XML", () => {
    expect(() =>
      inspect(
        archive([
          ...wordParts(),
          { name: "docProps/custom.xml", body: "<r/>" },
          { name: "docProps/CUSTOM.XML", body: `<r>${TOKEN}</r>` },
        ]).bytes,
      ),
    ).toThrow(/ambiguous member name/);
  });

  it("refuses undeclared data and XML pretending to be a declared binary image", () => {
    for (const name of ["word/custom.payload", "word/media/fake.png"])
      expect(() =>
        inspect(archive([...wordParts(), { name, body: `<r>${TOKEN}</r>` }]).bytes),
      ).toThrow(/part type/);
  });

  it("admits only declared PNG and JPEG binary signatures alongside all inspected XML", () => {
    const parts = wordParts();
    parts.push(
      { name: "word/media/picture.png", body: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]) },
      { name: "docProps/thumbnail.jpeg", body: Buffer.from([255, 216, 255, 0]) },
    );
    expect(inspect(archive(parts).bytes)).toContain("Synthetic guide");
    const changed = parts.map((part) => ({ ...part }));
    requiredPart(changed, "docProps/thumbnail.jpeg").body = Buffer.from([255, 0, 255]);
    expect(() => inspect(archive(changed).bytes)).toThrow(/part type/);
  });

  it.each([
    '<Default Extension="XML" ContentType="application/xml"/>',
    '<Default Extension="data" ContentType="application/vnd.ms-word.document.macroEnabled.main+xml"/>',
    '<Override PartName="/missing.xml" ContentType="application/xml"/>',
    '<Override PartName="/word/document.xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/xml"/>',
    '<Default Extension="../bad" ContentType="application/xml"/>',
    '<Default Extension="data" ContentType="not-a-type"/>',
  ])("rejects ambiguous, active or invalid OPC declarations independently: %s", (declaration) => {
    const parts = wordParts();
    const types = requiredPart(parts, "[Content_Types].xml");
    types.body = String(types.body).replace("</Types>", declaration + "</Types>");
    expect(() => inspect(archive(parts).bytes)).toThrow(/content type/);
  });

  it("makes numeric references inside relationships visible as well as their raw XML", () => {
    const parts = wordParts(undefined, 8);
    const rel = parts[2];
    if (!rel) throw new Error("Independent relationship part required.");
    rel.body = `<Relationships><Relationship Target="https://example.invalid/&#103;hp_${"M".repeat(24)}"/></Relationships>`;
    const result = inspect(archive(parts).bytes);
    expect(result).toContain("&#103;hp_");
    expect(result).toContain(TOKEN);
  });

  it("preserves comments, CDATA and supported predefined/numeric XML text without executing anything", () => {
    const document =
      '<?xml version="1.0"?><r><!--literal note--><![CDATA[synthetic <literal>]]><t>&amp;&lt;&gt;&quot;&apos;&#65;&#x42;</t></r>';
    const result = inspect(archive(wordParts(document)).bytes);
    expect(result).toContain("<!--literal note-->");
    expect(result).toContain("synthetic <literal>");
    expect(result).toContain("&<>\"'AB");
  });

  it.each([
    "docs/reports/unreviewed.docx",
    "docs/reports/windows-application-guide-1.1.1.docx",
    "docs/reports/../reports/project-guide.docx",
    "docs/reports/PROJECT-guide.docx",
  ])("does not introduce a generic binary exception for %s", (name) => {
    const zip = archive(wordParts(), Buffer.from([0xff])).bytes;
    expect(() => new TextDecoder("utf-8", { fatal: true }).decode(zip)).toThrow();
    expect(() => inspect(zip, name)).toThrow();
  });

  it("decodes ordinary source strictly and keeps its exact original text", () => {
    const text = "Synthetic source — café\n";
    expect(inspect(Buffer.from(text), "README.md")).toBe(text);
    expect(() => inspect(Buffer.from([0x61, 0xff]), "README.md")).toThrow();
  });
});

describe("genuine ZIP structural refusals", () => {
  it.each([0, 8])("recomputes CRC instead of trusting agreeing headers for method %s", (method) => {
    const parts = wordParts(undefined, method);
    const part = parts[1];
    if (!part) throw new Error("Independent Word part required.");
    part.crc = 0;
    expect(() => inspect(archive(parts).bytes)).toThrow(/CRC/i);
  });

  it("checks non-XML bodies too, so hidden image corruption is not accepted", () => {
    const zip = archive([
      ...wordParts(),
      { name: "word/media/image.bin", body: "inert image fixture", crc: 0 },
    ]);
    expect(() => inspect(zip.bytes)).toThrow(/CRC/i);
  });

  it.each([0, 8])("refuses an understated actual payload length for method %s", (method) => {
    const parts = wordParts(`<r>${"x".repeat(32_768)}</r>`, method);
    const part = parts[1];
    if (!part) throw new Error("Independent Word part required.");
    part.size = 1;
    expect(() => inspect(archive(parts).bytes)).toThrow();
  });

  it.each([1, 8])(
    "refuses encryption or data-descriptor flags %s before interpreting members",
    (flags) => {
      const parts = wordParts();
      const part = parts[1];
      if (!part) throw new Error("Independent Word part required.");
      part.flags = flags;
      expect(() => inspect(archive(parts).bytes)).toThrow(/encrypted|unsupported/i);
    },
  );

  it("refuses an unsupported compression method", () => {
    const parts = wordParts();
    const part = parts[1];
    if (!part) throw new Error("Independent Word part required.");
    part.method = 14;
    expect(() => inspect(archive(parts).bytes)).toThrow(/unsupported/i);
  });

  it.each(["word/vbaProject.bin", "word/embeddings/object.bin"])(
    "refuses active payload %s",
    (name) => {
      expect(() =>
        inspect(archive([...wordParts(), { name, body: "inert blocked fixture" }]).bytes),
      ).toThrow(/active|unsupported/i);
    },
  );

  it("refuses a ZIP member advertised as a symbolic link", () => {
    expect(() =>
      inspect(
        archive([...wordParts(), { name: "word/link.xml", body: "<r/>", mode: 0o120777 }]).bytes,
      ),
    ).toThrow();
  });

  it.each([
    "/absolute.xml",
    "../escape.xml",
    "word/../escape.xml",
    "word/./same.xml",
    "word//empty.xml",
    "word\\escape.xml",
    "Z:/drive.xml",
    "word/control\u0000.xml",
  ])("refuses unsafe member path %s", (name) => {
    expect(() => inspect(archive([...wordParts(), { name, body: "<r/>" }]).bytes)).toThrow();
  });

  it("refuses duplicate names and malformed UTF-8 names", () => {
    const duplicate = archive([...wordParts(), { name: "word/document.xml", body: "<r/>" }]);
    expect(() => inspect(duplicate.bytes)).toThrow(/name/i);
    expect(() =>
      inspect(
        archive([
          ...wordParts(),
          { name: "invalid.xml", nameBytes: Buffer.from([0xff]), body: "<r/>" },
        ]).bytes,
      ),
    ).toThrow();
  });

  it.each(["[Content_Types].xml", "word/document.xml"])("requires the actual %s part", (name) => {
    expect(() => inspect(archive(wordParts().filter((part) => part.name !== name)).bytes)).toThrow(
      /required/i,
    );
  });

  it("refuses truncated end/directory records and undeclared trailing data", () => {
    const zip = archive(wordParts());
    for (const bytes of [
      zip.bytes.subarray(0, 10),
      zip.bytes.subarray(0, -1),
      Buffer.concat([zip.bytes, Buffer.from("extra")]),
    ])
      expect(() => inspect(bytes)).toThrow();
    const broken = Buffer.from(zip.bytes);
    broken.writeUInt32LE(0, zip.centralOffset);
    expect(() => inspect(broken)).toThrow(/directory/i);
  });

  it("refuses multidisk archives, ZIP64 sentinel counts and excess member counts", () => {
    const zip = archive(wordParts());
    const disk = Buffer.from(zip.bytes);
    disk.writeUInt16LE(1, zip.endOffset + 4);
    expect(() => inspect(disk)).toThrow(/split/i);
    const zip64 = Buffer.from(zip.bytes);
    zip64.writeUInt16LE(0xffff, zip.endOffset + 8);
    zip64.writeUInt16LE(0xffff, zip.endOffset + 10);
    expect(() => inspect(zip64)).toThrow(/budget|directory/i);
    const many = [
      ...wordParts(),
      ...Array.from({ length: 254 }, (_, index) => ({
        name: `parts/part-${index}.bin`,
        body: "x",
      })),
    ];
    expect(() => inspect(archive(many).bytes)).toThrow(/budget/i);
  });

  it.each([6, 8, 14, 18, 22])("refuses a local-header field disagreement at offset %s", (field) => {
    const zip = archive(wordParts());
    const position = zip.positions[1];
    if (!position) throw new Error("Independent local-header position required.");
    zip.bytes[position.local + field] = (zip.bytes[position.local + field] ?? 0) ^ 1;
    expect(() => inspect(zip.bytes)).toThrow(/local/i);
  });

  it("refuses a local name mismatch and overlapping real local records", () => {
    const nameMismatch = archive(wordParts());
    const doc = nameMismatch.positions[1];
    if (!doc) throw new Error("Independent name position required.");
    nameMismatch.bytes[doc.local + 30] = 0x78;
    expect(() => inspect(nameMismatch.bytes)).toThrow(/alias|overlap/i);
    const nested = archive([{ name: "nested.xml", body: "<r/>" }]);
    const overlap = archive([
      ...wordParts(),
      { name: "carrier.bin", body: nested.bytes.subarray(0, nested.centralOffset) },
      { name: "nested.xml", body: "<r/>" },
    ]);
    const carrier = overlap.positions[3];
    const alias = overlap.positions[4];
    if (!carrier || !alias) throw new Error("Independent overlap positions required.");
    overlap.bytes.writeUInt32LE(carrier.data, alias.central + 42);
    expect(() => inspect(overlap.bytes)).toThrow(/overlap/i);
  });
});

describe("bounded ordinary files and XML inspection", () => {
  it("rejects an actual compressed file above the eight-MiB descriptor budget", () => {
    const file = path.join(scratch, "large.docx");
    writeFileSync(file, Buffer.from("x"), { flag: "wx", mode: 0o600 });
    truncateSync(file, BYTE_CAP + 1);
    expect(() => publicationText(file, CURRENT_GUIDE)).toThrow(/budget/i);
  });

  it("refuses a directory or actual multiply linked source before ZIP parsing", () => {
    const directory = path.join(scratch, "directory");
    mkdirSync(directory);
    expect(() => publicationText(directory, CURRENT_GUIDE)).toThrow();
    const file = path.join(scratch, "linked.docx");
    const alias = path.join(scratch, "alias.docx");
    writeFileSync(file, archive(wordParts()).bytes, { flag: "wx", mode: 0o600 });
    linkSync(file, alias);
    expect(lstatSync(file).nlink).toBe(2);
    expect(() => publicationText(alias, CURRENT_GUIDE)).toThrow(/single-link/i);
  });

  it("caps real inflation even when the local and central expanded sizes both lie", () => {
    const parts = wordParts(undefined, 8);
    parts.push({
      name: "word/media/bounded.bin",
      body: Buffer.alloc(XML_CAP + 1, 0x61),
      size: 1,
      method: 8,
    });
    expect(() => inspect(archive(parts).bytes)).toThrow();
    expect(
      inflation.limits.every((value) => typeof value === "number" && value > 0 && value <= XML_CAP),
    ).toBe(true);
    expect(inflation.limits.length).toBeGreaterThan(0);
  });

  it("rejects both the total declared expansion and aggregate inspected XML limits", () => {
    const binary = Buffer.alloc(XML_CAP, 0x61);
    const total = archive([
      ...wordParts(undefined, 8),
      ...Array.from({ length: 4 }, (_, index) => ({
        name: `word/media/part-${index}.bin`,
        body: binary,
        method: 8,
      })),
    ]);
    expect(() => inspect(total.bytes)).toThrow(/expanded.*budget/i);
    const xml = `<r>${"x".repeat(XML_CAP / 2 + 100)}</r>`;
    expect(() =>
      inspect(
        archive(wordParts(xml, 8).concat([{ name: "docProps/core.xml", body: xml, method: 8 }]))
          .bytes,
      ),
    ).toThrow(/XML inspection budget/i);
  });

  it("rejects malformed UTF-8 in otherwise CRC-correct XML", () => {
    const parts = wordParts();
    const part = parts[1];
    if (!part) throw new Error("Independent XML part required.");
    part.body = Buffer.from([0x3c, 0x72, 0x3e, 0xff, 0x3c, 0x2f, 0x72, 0x3e]);
    expect(() => inspect(archive(parts).bytes)).toThrow();
  });

  it.each([
    '<!DOCTYPE r [<!ENTITY x "inert">]><r>&x;</r>',
    '<!ENTITY x SYSTEM "https://example.invalid/never-fetched"><r/>',
    "<r>&unknown;</r>",
    "<r>&missing</r>",
    "<r>&#0;</r>",
    "<r>&#xD800;</r>",
    "<r>&#x110000;</r>",
    "<r>&#x;</r>",
    "<r><a></r>",
    "<r>",
    "<r/><second/>",
    "outside<r/>",
    '<r duplicate="a" duplicate="b"/>',
    '<r attribute="unfinished>',
    "<r><!--unfinished</r>",
    "<r><![CDATA[unfinished</r>",
    "<r>bad]]>text</r>",
    "<r>\u0000</r>",
  ])("rejects malformed/declared-entity XML: %s", (document) => {
    expect(() => inspect(archive(wordParts(document, 8)).bytes)).toThrow();
  });

  it("enforces finite XML nesting and token budgets", () => {
    const deep = "<r>".repeat(129) + "</r>".repeat(129);
    expect(() => inspect(archive(wordParts(deep, 8)).bytes)).toThrow(/depth budget/i);
    const many = "<r>" + "<x/>".repeat(100_001) + "</r>";
    expect(() => inspect(archive(wordParts(many, 8)).bytes)).toThrow(/token budget/i);
  });
});
