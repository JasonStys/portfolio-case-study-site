/**
 * @file Checks the actual native workflow's independent Windows commands, read-only scope and manual-only package retention.
 * Functions: validateNativeWorkflow and checked CLI entry; no workflow dispatch or release operations.
 * Variables: exact required command set and immutable action pins; trusted source review remains primary.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseDocument } from "yaml";
const COMMANDS = [
  "npm ci",
  "npm ci --prefix desktop",
  "npm run audit",
  "npm audit --prefix desktop --audit-level=high",
  "npm run native:policy",
  "npm run native:test",
  "node desktop/tests/electron-faults.mjs .runtime/native-hosted-faults",
  "node scripts/build-native.mjs release/hosted",
  "node scripts/accept-native.mjs release/hosted/Jason-Stys-Portfolio-1.1.0-windows-x64.zip release/hosted/package-integrity.json .runtime/native-hosted-acceptance",
];
const CHECKOUT = "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
  SETUP = "actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1",
  UPLOAD = "actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9";
const MANUAL =
  "github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main' && inputs.upload_package && success()";
export function validateNativeWorkflow(text) {
  const document = parseDocument(text, { uniqueKeys: true });
  if (document.errors.length) throw new Error("Native workflow YAML is invalid.");
  const data = document.toJS(),
    job = data.jobs?.windows;
  if (
    Object.keys(data.on ?? {})
      .sort()
      .join("|") !== "pull_request|push|workflow_dispatch" ||
    JSON.stringify(data.on.push?.branches) !== '["main"]' ||
    JSON.stringify(data.on.pull_request?.branches) !== '["main"]' ||
    data.on.workflow_dispatch?.inputs?.upload_package?.type !== "boolean" ||
    data.on.workflow_dispatch.inputs.upload_package.default !== false ||
    JSON.stringify(data.permissions) !== '{"contents":"read"}' ||
    Object.keys(data.jobs ?? {}).join("|") !== "windows" ||
    !job ||
    job["runs-on"] !== "windows-2025" ||
    job["timeout-minutes"] !== 20 ||
    Object.hasOwn(job, "permissions") ||
    Object.hasOwn(job, "if") ||
    job["continue-on-error"] ||
    job.environment ||
    !Array.isArray(job.steps)
  )
    throw new Error("Native workflow trigger, scope or bounded job differs.");
  const runs = [];
  for (const step of job.steps) {
    if (step["continue-on-error"] || step.env || step.shell)
      throw new Error("Native step execution control differs.");
    if (step.run !== undefined) {
      if (
        typeof step.run !== "string" ||
        step.run.includes("\n") ||
        step.run.includes("\r") ||
        Object.hasOwn(step, "if")
      )
        throw new Error(
          "Each required Windows command must execute independently and unconditionally.",
        );
      runs.push(step.run);
    } else if (![CHECKOUT, SETUP, UPLOAD].includes(step.uses))
      throw new Error("Native workflow action differs.");
  }
  if (JSON.stringify(runs) !== JSON.stringify(COMMANDS))
    throw new Error("Required independent native commands differ.");
  const checkout = job.steps.filter((step) => step.uses === CHECKOUT),
    setup = job.steps.filter((step) => step.uses === SETUP),
    uploads = job.steps.filter((step) => step.uses === UPLOAD);
  if (
    checkout.length !== 1 ||
    checkout[0].with?.["persist-credentials"] !== false ||
    setup.length !== 1 ||
    setup[0].with?.["node-version"] !== "24" ||
    uploads.length !== 2
  )
    throw new Error("Native setup or retained credentials differ.");
  const bounded = uploads.find((step) => step.with?.name === "offline-native-evidence"),
    packageUpload = uploads.find((step) => step.with?.name === "offline-native-windows-package");
  if (
    !bounded ||
    bounded.if !== "always()" ||
    bounded.with["retention-days"] !== 3 ||
    !packageUpload ||
    packageUpload.if !== MANUAL ||
    packageUpload.with["retention-days"] !== 1 ||
    bounded.with.path
      .split(/\r?\n/u)
      .filter(Boolean)
      .some(
        (value) =>
          !/^\.runtime\/native-hosted-acceptance\/(?:receipt\.json|acceptance\/(?:acceptance\.json|failure\.json|native-portfolio-\*\.png))$|^release\/hosted\/package-integrity\.json$|^\.runtime\/native-hosted-faults\/receipt\.json$/u.test(
            value,
          ),
      ) ||
    packageUpload.with.path.trim() !==
      "release/hosted/Jason-Stys-Portfolio-1.1.0-windows-x64.zip\nrelease/hosted/package-integrity.json"
  )
    throw new Error("Native evidence/package retention boundary differs.");
  return true;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  validateNativeWorkflow(
    fs.readFileSync(
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "../.github/workflows/native-app.yml",
      ),
      "utf8",
    ),
  );
  console.log(
    "Native workflow uses independent required Windows commands and bounded manual-only package retention.",
  );
}
