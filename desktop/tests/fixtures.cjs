/**
 * @file Creates independent inert ordinary-file snapshots for native policy and resource regressions.
 * Functions: fixture and writeMetadata.
 * Variables: exact test bytes and independently computed digests; no server, browser or personal profile.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { createHash } = require("node:crypto");
const { OWNER } = require("../resources.cjs");
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-native-fixture-")),
    site = path.join(root, "site"),
    owner = path.join(root, "owner");
  fs.mkdirSync(site);
  fs.mkdirSync(owner);
  t.after(() => fs.rmSync(root, { recursive: true }));
  const content = {
    "index.html": "<!doctype html><title>Actual fixture</title><h1>Offline</h1>",
    "404.html": "<!doctype html><title>Not found</title>",
    "assets/client.js": "// inert static script",
    "assets/site.css": "body {}",
    "downloads/index.json": '{"schemaVersion":1,"repositories":[]}',
    "search-index.json": '{"schemaVersion":2}',
    "projects/index.html": "<!doctype html><title>Projects</title>",
  };
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
  };
  const hash = (data) => createHash("sha256").update(data).digest("hex");
  const owners = {};
  for (const name of OWNER) {
    const data = "// inert owner " + name;
    fs.writeFileSync(path.join(owner, name), data);
    owners[name] = hash(data);
  }
  for (const [name, data] of Object.entries(content)) {
    fs.mkdirSync(path.dirname(path.join(site, name)), { recursive: true });
    fs.writeFileSync(path.join(site, name), data);
  }
  const metadata = {
    schema: 1,
    product: "portfolio-case-study-site",
    version: "1.1.0",
    source: "a".repeat(40),
    sourceDirty: true,
    base: "/portfolio-case-study-site/",
    files: Object.fromEntries(
      Object.entries(content).map(([name, data]) => [
        name,
        {
          bytes: Buffer.byteLength(data),
          mediaType: types[path.extname(name)],
          sha256: hash(data),
        },
      ]),
    ),
    owner: owners,
    externalLinks: [
      "https://github.com/JasonStys",
      "https://github.com/coverlet-coverage/coverlet",
    ],
  };
  const writeMetadata = () =>
    fs.writeFileSync(path.join(site, "SOURCE.json"), JSON.stringify(metadata));
  writeMetadata();
  return { root, site, owner, content, metadata, writeMetadata };
}
module.exports = { fixture };
