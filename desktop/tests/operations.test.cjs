/**
 * @file Verifies exact manual link admission and retained confirmation/open work before repeated Quit.
 * Functions: deferred and event-controlled operation tests.
 * Variables: inert URLs, observable prompts and held promises; no external browser or network.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createOperations, openPublicLink } = require("../operations.cjs");
const URL = "https://github.com/coverlet-coverage/coverlet";
const snapshot = { externalLinks: new Set([URL]) };
function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
test("a real listed primary reference opens only after explicit confirmation; Cancel never opens", async () => {
  const opened = [],
    prompted = [];
  const request = (approved) =>
    openPublicLink(
      URL,
      snapshot,
      async (value) => {
        prompted.push(value);
        return approved;
      },
      async (value) => {
        opened.push(value);
      },
    );
  assert.deepEqual(await request(false), { opened: false, canceled: true });
  assert.deepEqual(opened, []);
  assert.deepEqual(await request(true), { opened: true, canceled: false });
  assert.deepEqual(opened, [URL]);
  assert.deepEqual(prompted, [URL, URL]);
});
test("unlisted, altered and executable targets are refused before a dialog or opener", async () => {
  let calls = 0;
  for (const value of [
    URL + "?unlisted=1",
    "https://example.org/unlisted",
    "file:///C:/Windows",
    "javascript:alert(1)",
    {},
    null,
  ]) {
    await assert.rejects(
      openPublicLink(
        value,
        snapshot,
        async () => {
          calls++;
          return true;
        },
        async () => {
          calls++;
        },
      ),
    );
  }
  assert.equal(calls, 0);
});
test("repeated Quit retains accepted confirmation and actual opener completion while refusing new work", async () => {
  const owner = createOperations(),
    prompted = deferred(),
    confirmation = deferred(),
    opening = deferred(),
    opener = deferred();
  const running = owner.run(() =>
    openPublicLink(
      URL,
      snapshot,
      async () => {
        prompted.resolve();
        return confirmation.promise;
      },
      async () => {
        opening.resolve();
        await opener.promise;
      },
    ),
  );
  await prompted.promise;
  let finished = false;
  const close = owner.finish().then(() => {
    finished = true;
  });
  const repeated = owner.finish();
  await assert.rejects(owner.run(async () => {}));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(finished, false);
  confirmation.resolve(true);
  await opening.promise;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(finished, false);
  opener.resolve();
  assert.deepEqual(await running, { opened: true, canceled: false });
  await Promise.all([close, repeated]);
  assert.equal(finished, true);
});
test("a rejected accepted opener still settles retained work and cannot reopen admission", async () => {
  const owner = createOperations(),
    fail = new Error("inert opener failure");
  const running = owner.run(() =>
    openPublicLink(
      URL,
      snapshot,
      async () => true,
      async () => {
        throw fail;
      },
    ),
  );
  const settled = owner.finish();
  await assert.rejects(running, (error) => error === fail);
  await settled;
  await assert.rejects(owner.run(async () => {}));
});
