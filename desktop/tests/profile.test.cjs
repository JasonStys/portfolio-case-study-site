/**
 * @file Exercises actual ordinary-file profile ownership and pre-existing alias refusals without personal data.
 * Functions: local fixture, real Windows junction/hardlink controls and normal durable reopen.
 * Variables: synthetic marker/lock/browser sentinels; no Chromium or normal OS profile access.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { openProfile } = require("../profile.cjs");
function workspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-profile-"));
  t.after(() => fs.rmSync(root, { recursive: true }));
  return { root, profile: path.join(root, "workspace") };
}
test("normal two-launch ownership preserves marker and existing browser bytes, releasing only its lock", (t) => {
  const { profile } = workspace(t),
    first = openProfile(profile),
    marker = fs.readFileSync(path.join(profile, "owner.json"));
  const sentinel = path.join(first.browser, "Preferences");
  fs.writeFileSync(sentinel, '{"synthetic":"unchanged"}');
  assert.throws(() => openProfile(profile), /EEXIST/);
  first.close();
  first.close();
  const second = openProfile(profile);
  assert.deepEqual(fs.readFileSync(path.join(profile, "owner.json")), marker);
  assert.equal(fs.readFileSync(sentinel, "utf8"), '{"synthetic":"unchanged"}');
  second.close();
  assert.equal(fs.existsSync(path.join(profile, "owner.lock")), false);
});
test("changed or interrupted owner tokens are preserved rather than adopted or removed", (t) => {
  const { profile } = workspace(t),
    owner = openProfile(profile),
    lock = path.join(profile, "owner.lock");
  fs.writeFileSync(lock, "different interrupted token");
  assert.throws(() => owner.close(), /owner changed/);
  assert.throws(() => openProfile(profile), /EEXIST/);
  assert.equal(fs.readFileSync(lock, "utf8"), "different interrupted token");
});
test("unknown content and frozen-resource descendants are refused before any marker is written", (t) => {
  const { root, profile } = workspace(t);
  fs.mkdirSync(profile);
  fs.writeFileSync(path.join(profile, "unrelated.txt"), "preserve");
  assert.throws(() => openProfile(profile), /Unknown workspace/);
  assert.equal(fs.existsSync(path.join(profile, "owner.json")), false);
  const installation = path.join(root, "application");
  fs.mkdirSync(installation);
  assert.throws(
    () => openProfile(path.join(installation, "profile"), [installation]),
    /outside application/,
  );
  assert.equal(fs.existsSync(path.join(installation, "profile")), false);
});
test("an actual ancestor junction/symlink is refused before touching its outside target", (t) => {
  const { root } = workspace(t),
    outside = path.join(root, "outside"),
    alias = path.join(root, "alias");
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, alias, process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => openProfile(path.join(alias, "workspace")), /real local directory/);
  assert.deepEqual(fs.readdirSync(outside), []);
});
for (const member of ["owner.json", "owner.lock", "browser-state/Preferences"])
  test("actual hardlinked mutable member is refused unchanged: " + member, (t) => {
    const { root, profile } = workspace(t),
      owner = openProfile(profile);
    owner.close();
    const sentinel = path.join(root, "outside-sentinel"),
      target = path.join(profile, member);
    fs.writeFileSync(sentinel, "outside must not change");
    if (fs.existsSync(target)) fs.unlinkSync(target);
    fs.linkSync(sentinel, target);
    assert.throws(() => openProfile(profile), /identity|single-link/);
    assert.equal(fs.readFileSync(sentinel, "utf8"), "outside must not change");
  });
