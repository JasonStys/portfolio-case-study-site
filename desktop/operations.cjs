/**
 * @file Retains an accepted public-link confirmation until actual completion before native Quit.
 * Functions: createOperations and openPublicLink.
 * Variables: one pending operation, explicit closing state and exact approved URL set.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const { publicUrl } = require("./policy.cjs");
function createOperations() {
  const pending = new Set();
  let closing = false;
  return {
    get closing() {
      return closing;
    },
    async run(work) {
      if (closing || pending.size) throw new Error("Finish the current public-link request first.");
      const task = Promise.resolve().then(work);
      pending.add(task);
      try {
        return await task;
      } finally {
        pending.delete(task);
      }
    },
    stopAdmission() {
      closing = true;
    },
    async finish() {
      closing = true;
      await Promise.allSettled([...pending]);
    },
  };
}

async function openPublicLink(value, snapshot, confirm, open) {
  const target = publicUrl(value);
  if (!target || !snapshot.externalLinks.has(target))
    throw new Error(
      "This link is not in the snapshot's approved public source, contact or download list.",
    );
  const approved = await confirm(target);
  if (!approved) return { opened: false, canceled: true };
  await open(target);
  return { opened: true, canceled: false };
}
module.exports = { createOperations, openPublicLink };
