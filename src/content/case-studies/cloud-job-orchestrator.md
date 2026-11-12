---
title: "Reliable job control across process boundaries"
repository: "https://github.com/JasonStys/cloud-job-orchestrator"
summary: "Author job graphs and inspect real Rust-worker execution, retries and cancellation through a local PostgreSQL-backed workspace."
role: "Cloud, backend, and distributed-systems engineering"
languages: ["Rust", "SQL", "TypeScript", "Bash"]
evidence:
  [
    "Read-only DAG preview",
    "Coherent job/event snapshots",
    "PostgreSQL worker acceptance",
    "Bounded blocker explanations",
  ]
---

## Current usable application — 12 November 2026

The native workspace runs the original Rust workers against bundled PostgreSQL. Editable DAGs, imports, explicit worker admission and pause, cancellation, captured results and durable event history connect lease and retry evidence to the actual workflow.

Turns job state into actionable diagnosis while keeping the executed job set closed and the recovery evidence inspectable.

The current [version 1.1.0 release](https://github.com/JasonStys/cloud-job-orchestrator/releases/tag/v1.1.0) identifies [its packaged runtime source](https://github.com/JasonStys/cloud-job-orchestrator/tree/60a08d2d059dc4cf813e1b96029dd42ec76dc067). The matching [illustrated Windows guide](https://github.com/JasonStys/cloud-job-orchestrator/blob/2b13da97103b6a7e73ed2f9b144b71e4c8159d5f/docs/reports/windows-application-guide-1.1.0.docx) and [guide identity record](https://github.com/JasonStys/cloud-job-orchestrator/blob/2b13da97103b6a7e73ed2f9b144b71e4c8159d5f/docs/reports/windows-application-guide-1.1.0.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows x64 and the complete checksummed ZIP, including its app-local PostgreSQL tree and notices. Keep a writable owner-local workspace; no global database service, compiler or Docker setup is required for the fixed local jobs.

**Current limits.** Closed local job types and trusted-owner plaintext storage only; the app does not supply cloud execution or a production multiuser identity, network or TLS boundary.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

## Problem

Dependency-aware work becomes hard to diagnose when parents fail, workers disappear, leases expire and retries overlap. Operators need to distinguish unmet dependencies from an expired lease or completed work, without submitting another job just to understand the plan.

## Constraints

Graphs, payloads, retries and explanations must remain bounded. Preview must not submit work, and inspection must capture coherent job/dependency/event state. Lease expiry is evidence to inspect, not proof that a former worker has stopped or that effects occurred exactly once.

## Design

Rust models jobs, dependency edges, attempts, leases and events around PostgreSQL. Topological validation rejects cycles. Workers claim tasks through expiring leases, while explicit retry and terminal-state rules bound recovery. Containers and infrastructure definitions document a reproducible deployment path.

The new CLI/API preview exposes dependency waves without submission. A captured review combines one job, its dependencies, the observation time and a bounded event window. It distinguishes terminal blockers, exact unmet-parent counts, expired-but-not-reaped leases and truncated history. Dashboard selection, paging, refresh and exact JSON download preserve that context.

A support user can preview a draft graph, inspect a delayed job, identify failed parents and review lease evidence before taking a separate action. Editing a draft invalidates its plan; stale responses cannot replace a newer selection. Large explanations retain exact counts while limiting repeated blocker IDs.

## Verification

Portable graph/property/route tests are distinct from real PostgreSQL tests. Independent maximum-size fixtures check explanation counts and truncation. Browser fixtures exercise selection, stale/error states and downloads, while a separate hosted API/worker test executes actual tasks and verifies static delivery.

## Measured result

Local evidence records **20 portable Rust tests**, **12 browser journeys** across Chromium, Firefox, WebKit and mobile WebKit, two TypeScript checks, strict Clippy and successful builds. A 1,000-job oracle verifies explanation budgets and explicit truncation.

Four genuine PostgreSQL tests are explicitly separate from the portable suite and required by CI; missing database configuration cannot silently pass them. A separate accepted hosted journey runs the compiled API and worker against disposable PostgreSQL, checking actual task execution, attempt events, non-submitting previews and static HTML/JavaScript delivery. Those backend/static-delivery checks are distinct from the browser fixtures above.

Accepted source: [`c93ca92be7ffa6bdd4e44f0773cae5146a57ecf4`](https://github.com/JasonStys/cloud-job-orchestrator/tree/c93ca92be7ffa6bdd4e44f0773cae5146a57ecf4). The [change report](https://github.com/JasonStys/cloud-job-orchestrator/blob/c93ca92be7ffa6bdd4e44f0773cae5146a57ecf4/docs/reports/PRACTICAL_WORKFLOWS_20261109.md) records the executed scope and results. Exact-main workflow records passed: [CI](https://github.com/JasonStys/cloud-job-orchestrator/actions/runs/42718227263), [CodeQL](https://github.com/JasonStys/cloud-job-orchestrator/actions/runs/42718227181).

## Limitations

This is a trusted-control-plane reference, not hosted multi-tenant accounts or a managed workflow platform. Inspection omits result payloads, but the existing unauthenticated trusted-lab result endpoint can return them; omission is not a privacy boundary. Lease recovery does not establish exactly-once effects, multi-region consensus or duration forecasts. Captures can become stale; browser automation does not replace manual assistive-technology testing. No cloud resources were provisioned for this improvement. This source-first project is built and exercised through its documented package/service gates; no native desktop release is supplied.
