/**
 * @file Tests exact native URL components, original readable-data navigation and sole-main-frame authority.
 * Functions: Node test cases with independent positive and deceptive-origin inputs.
 * Variables: literal allowed paths/URLs; null-origin equivalence never grants authority.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict");
const {
  ownUrl,
  publicUrl,
  safeName,
  senderAllowed,
  documentRoutes,
  BASE,
} = require("../policy.cjs");
test("native routing preserves normal base aliases, encoded queries and fragment navigation", () => {
  for (const value of [
    "portfolio://catalog/portfolio-case-study-site/",
    "portfolio://catalog/portfolio-case-study-site",
    "portfolio://catalog/portfolio-case-study-site/projects/?q=C%23&domain=Space+systems#main-content",
  ])
    assert.ok(ownUrl(value));
});
for (const value of [
  "data:text/html,hello",
  "file:///portfolio-case-study-site/",
  "other://catalog/portfolio-case-study-site/",
  "portfolio://catalog.evil/portfolio-case-study-site/",
  "portfolio://catalog./portfolio-case-study-site/",
  "portfolio://user@catalog/portfolio-case-study-site/",
  "portfolio://catalog:77/portfolio-case-study-site/",
  "portfolio://catalog/elsewhere/",
  "portfolio://catalog/portfolio-case-study-site/../../outside",
  "portfolio://catalog/portfolio-case-study-site/%2e%2e/outside",
  "not a URL",
  "portfolio://catalog/portfolio-case-study-site/" + "x".repeat(8192),
])
  test("deceptive native origin or excessive URL refused: " + value.slice(0, 90), () =>
    assert.equal(ownUrl(value), null),
  );
test("primary source HTTPS references remain eligible, while local and executable protocols do not", () => {
  for (const value of [
    "https://github.com/JasonStys",
    "https://github.com/coverlet-coverage/coverlet",
    "https://www.w3.org/TR/WCAG22/",
    "https://docs.python.org/3/library/os.html#os.stat",
    "https://www.linkedin.com/in/jason-stys-31b30b351/",
  ])
    assert.equal(publicUrl(value), value);
  for (const value of [
    "file:///C:/x",
    "javascript:alert(1)",
    "mailto:x@example.com",
    "http://github.com/JasonStys",
    "https://user:secret@github.com/JasonStys",
    "https://github.com:444/JasonStys",
    "https://127.0.0.1/",
    "https://[::1]/",
    "https://2130706433/",
    "https://localhost/",
    "https://localhost./",
    "https://service.local/",
    "https://service.local./",
    "https://docs.example.test/",
    null,
    {},
    "x".repeat(4097),
  ])
    assert.equal(publicUrl(value), null);
});
test("ordinary static names exclude Windows devices, aliases and traversal", () => {
  for (const value of [
    "index.html",
    "assets/site.ABC.css",
    "projects/mission-clock-integrity-lab/index.html",
  ])
    assert.equal(safeName(value), true);
  for (const value of [
    "../x.html",
    "/absolute",
    "a//b",
    "a/./b",
    "a\\b",
    "a:x",
    "CON.txt",
    "a/NUL",
    "a/Lpt1.js",
    "x. ",
    "a\u0000b",
  ])
    assert.equal(safeName(value), false);
});
test("only the actual main frame can use the bridge, including the existing JSON evidence reader", () => {
  const documents = documentRoutes({
    "index.html": { mediaType: "text/html" },
    "projects/index.html": { mediaType: "text/html" },
    "downloads/index.json": { mediaType: "application/json" },
    "assets/client.js": { mediaType: "text/javascript" },
  });
  assert.equal(documents.get(BASE + "projects/"), "projects/index.html");
  assert.equal(documents.get(BASE + "projects"), "projects/index.html");
  assert.equal(documents.get(BASE + "downloads/index.json"), "downloads/index.json");
  assert.equal(documents.has(BASE + "assets/client.js"), false);
  const frame = { url: "portfolio://catalog" + BASE + "downloads/index.json" },
    contents = { mainFrame: frame },
    snapshot = { documents };
  assert.equal(senderAllowed({ sender: contents, senderFrame: frame }, contents, snapshot), true);
  assert.equal(
    senderAllowed({ sender: contents, senderFrame: { ...frame } }, contents, snapshot),
    false,
  );
  assert.equal(senderAllowed({ sender: {}, senderFrame: frame }, contents, snapshot), false);
  frame.url = "other://catalog" + BASE;
  assert.equal(senderAllowed({ sender: contents, senderFrame: frame }, contents, snapshot), false);
  frame.url = "portfolio://catalog" + BASE + "assets/client.js";
  assert.equal(senderAllowed({ sender: contents, senderFrame: frame }, contents, snapshot), false);
});
