/**
 * @file Exercises real resource bytes, aliases, unexpected trees and exact protocol response behavior.
 * Functions: Node resource/response regression cases.
 * Variables: actual inert filesystem fixtures; buffers cannot be retargeted by request URL.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { fixture } = require("./fixtures.cjs");
const { verifiedSnapshot, responseFor, canNavigate } = require("../resources.cjs");
const { HOME, BASE } = require("../policy.cjs");
test("actual bytes are verified once and requests cannot read later filesystem modifications", async (t) => {
  const { site, owner, content } = fixture(t),
    snapshot = verifiedSnapshot(site, owner);
  fs.writeFileSync(path.join(site, "index.html"), "mutated after verification");
  const response = responseFor(
    { url: HOME + "?query=example#main-content", method: "GET" },
    snapshot,
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), content["index.html"]);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("content-security-policy"), /worker-src 'none'/);
});
test("actual JSON evidence is readable as a document, while JS/CSS remain subresources", async (t) => {
  const { site, owner } = fixture(t),
    snapshot = verifiedSnapshot(site, owner);
  assert.equal(canNavigate("portfolio://catalog" + BASE + "downloads/index.json", snapshot), true);
  assert.equal(canNavigate("portfolio://catalog" + BASE + "assets/client.js", snapshot), false);
  assert.equal(canNavigate("portfolio://catalog" + BASE + "assets/site.css", snapshot), false);
  const response = responseFor({ url: HOME + "downloads/index.json", method: "GET" }, snapshot);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).schemaVersion, 1);
  assert.equal(await responseFor({ url: HOME, method: "HEAD" }, snapshot).text(), "");
  assert.equal(responseFor({ url: HOME, method: "POST" }, snapshot).status, 405);
});
test("unknown/query/path requests cannot expand the immutable resource lookup", async (t) => {
  const { site, owner, content } = fixture(t),
    snapshot = verifiedSnapshot(site, owner);
  for (const value of [
    HOME + "%2f..%2fsecret",
    HOME + "../owner/owner.json",
    HOME + "SOURCE.json",
    HOME + "unknown",
    "file:///C:/private",
    "https://github.com/JasonStys",
  ]) {
    const response = responseFor({ url: value, method: "GET" }, snapshot);
    assert.equal(response.status, 404);
  }
  assert.equal(
    await responseFor({ url: HOME + "unknown", method: "GET" }, snapshot).text(),
    content["404.html"],
  );
  assert.equal(
    await responseFor(
      { url: HOME + "assets/client.js?file=../../owner", method: "GET" },
      snapshot,
    ).text(),
    content["assets/client.js"],
  );
});
test("changed content and owner bytes are independently refused", (t) => {
  const { site, owner, content } = fixture(t);
  fs.writeFileSync(path.join(site, "assets/site.css"), "wrong");
  assert.throws(() => verifiedSnapshot(site, owner), /bytes differ/);
  fs.writeFileSync(path.join(site, "assets/site.css"), content["assets/site.css"]);
  verifiedSnapshot(site, owner);
  fs.writeFileSync(path.join(owner, "main.mjs"), "changed owner");
  assert.throws(() => verifiedSnapshot(site, owner), /owner bytes/);
});
test("unexpected empty directories and regular files are refused before any exposure", (t) => {
  const { site, owner } = fixture(t);
  fs.mkdirSync(path.join(site, "unexpected"));
  assert.throws(() => verifiedSnapshot(site, owner), /Unknown static directory/);
  fs.rmdirSync(path.join(site, "unexpected"));
  fs.writeFileSync(path.join(site, "unexpected.txt"), "inert");
  assert.throws(() => verifiedSnapshot(site, owner), /Unknown static member/);
});
test("real hardlinked immutable input is rejected without changing its outside sentinel", (t) => {
  const { root, site, owner } = fixture(t),
    file = path.join(site, "assets/site.css"),
    alias = path.join(root, "outside");
  const before = fs.readFileSync(file);
  fs.linkSync(file, alias);
  assert.throws(() => verifiedSnapshot(site, owner));
  assert.deepEqual(fs.readFileSync(alias), before);
});
test("self-consistent metadata cannot authorize an unsafe path or an executable/local external target", (t) => {
  const { site, owner, metadata, writeMetadata } = fixture(t);
  metadata.externalLinks.push("file:///C:/private");
  writeMetadata();
  assert.throws(() => verifiedSnapshot(site, owner), /public link list/);
  metadata.externalLinks.pop();
  metadata.files["../outside.html"] = { ...metadata.files["index.html"] };
  writeMetadata();
  assert.throws(() => verifiedSnapshot(site, owner), /Unsafe static resource/);
});
