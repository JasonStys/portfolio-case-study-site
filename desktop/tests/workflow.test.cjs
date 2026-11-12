/**
 * @file Mutates the actual parsed Windows native workflow to prove failure-status, privilege and upload gates remain mandatory.
 * Functions: actual YAML fixture mutations; variables: unchanged production workflow text and independent negative edits.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
test("actual native policy rejects masked native failures, skipped controls and automatic full-package uploads", async () => {
  const { validateNativeWorkflow } = await import("../../scripts/native-workflow-policy.mjs"),
    { parse, stringify } = await import("yaml");
  const text = fs.readFileSync(
    path.join(__dirname, "../../.github/workflows/native-app.yml"),
    "utf8",
  );
  assert.equal(validateNativeWorkflow(text), true);
  const mutations = [
    (data) => {
      data.permissions.contents = "write";
    },
    (data) => {
      data.on.pull_request_target = {};
    },
    (data) => {
      const steps = data.jobs.windows.steps;
      const first = steps.find((step) => step.run === "npm ci"),
        second = steps.findIndex((step) => step.run === "npm ci --prefix desktop");
      first.run += "\nnpm ci --prefix desktop";
      steps.splice(second, 1);
    },
    (data) => {
      data.jobs.windows.steps.find((step) => step.run === "npm run native:test").if = "false";
    },
    (data) => {
      data.jobs.windows.steps.find((step) => step.run === "npm run native:test").if = false;
    },
    (data) => {
      data.jobs.windows.if = false;
    },
    (data) => {
      data.jobs.windows.steps.find((step) => step.run === "npm run native:test")[
        "continue-on-error"
      ] = true;
    },
    (data) => {
      data.jobs.windows.steps.find(
        (step) => step.with?.name === "offline-native-windows-package",
      ).if = "success()";
    },
    (data) => {
      data.jobs.windows.steps.find(
        (step) => step.with?.name === "offline-native-evidence",
      ).with.path += "\nrelease/hosted/";
    },
    (data) => {
      data.jobs.windows.steps.find((step) => step.uses?.startsWith("actions/checkout@")).with[
        "persist-credentials"
      ] = true;
    },
    (data) => {
      data.jobs.windows["timeout-minutes"] = 120;
    },
  ];
  for (const mutate of mutations) {
    const data = parse(text);
    mutate(data);
    assert.throws(() => validateNativeWorkflow(stringify(data)));
  }
  assert.throws(
    () =>
      validateNativeWorkflow(
        text.replace("  contents: read", "  contents: read\n  contents: write"),
      ),
    /invalid/,
  );
});
