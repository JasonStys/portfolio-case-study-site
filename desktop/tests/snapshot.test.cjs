/**
 * @file Independently verifies actual HTML-anchor selection and exclusive complete static snapshot creation.
 * Functions: build-time parser and copy regressions; variables: inert source HTML/entity encodings and ordinary files.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { fixture } = require("./fixtures.cjs");
test("actual HTML anchors retain independent primary references and decoded queries without authorizing head links or text", async () => {
  const { anchorLinks } = await import("../../scripts/native-snapshot.mjs");
  const result = anchorLinks(
    new Map([
      [
        "index.html",
        Buffer.from(
          `<head><link href="https://head.example.org/not-an-anchor"></head><a href="https://docs.python.org/3/?a=1&amp;b=2&#35;section">Primary reference</a><a href="//www.w3.org/TR/WCAG22/">Standard</a><a href="/portfolio-case-study-site/projects/">Internal</a><a href="https://127.0.0.1/private">Local</a><a href="javascript:alert(1)">Invalid</a><!-- <a href="https://comment.example.org/"> --><script>const value='<a href="https://script.example.org/">';</script><p>https://text.example.org/</p>`,
        ),
      ],
    ]),
  );
  assert.deepEqual(result, [
    "https://docs.python.org/3/?a=1&b=2#section",
    "https://www.w3.org/TR/WCAG22/",
  ]);
});
test("fresh complete snapshot and copy verify all exact bodies without overwriting an existing destination", async (t) => {
  const f = fixture(t),
    { createSnapshot, copySnapshot } = await import("../../scripts/native-snapshot.mjs");
  fs.unlinkSync(path.join(f.site, "SOURCE.json"));
  const output = path.join(f.root, "new-site"),
    copied = path.join(f.root, "copied-site");
  const metadata = createSnapshot({
    directory: f.site,
    ownerRoot: f.owner,
    output,
    source: "b".repeat(40),
    sourceDirty: true,
  });
  assert.equal(metadata.source, "b".repeat(40));
  assert.equal(metadata.sourceDirty, true);
  for (const [name, body] of Object.entries(f.content))
    assert.equal(fs.readFileSync(path.join(output, name), "utf8"), body);
  copySnapshot(output, copied, f.owner);
  assert.deepEqual(
    fs.readFileSync(path.join(copied, "SOURCE.json")),
    fs.readFileSync(path.join(output, "SOURCE.json")),
  );
  assert.throws(() => copySnapshot(output, copied, f.owner), /EEXIST/);
  assert.throws(
    () =>
      createSnapshot({
        directory: f.site,
        ownerRoot: f.owner,
        output: path.join(f.site, "nested"),
        source: "b".repeat(40),
        sourceDirty: false,
      }),
    /outside input/,
  );
  assert.equal(fs.existsSync(path.join(f.site, "nested")), false);
});
