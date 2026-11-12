---
title: "A model lifecycle beyond the notebook"
repository: "https://github.com/JasonStys/ml-model-lifecycle-observatory"
summary: "Train supported models, inspect verified dossiers and retain explicit promotion, rollback, prediction and drift evidence."
role: "Machine-learning engineering and MLOps"
languages: ["Python", "SQL", "Bash"]
evidence:
  [
    "Artifact and registry agreement",
    "Recorded quality-gate reasons",
    "Read-only release dossiers",
    "Drift and rollback boundaries",
  ]
---

## Current usable application — 12 November 2026

A desktop workflow accepts bounded JSONL data, trains both supported algorithms, inspects verified release dossiers and records explicit promotion or rollback. Predictions, PSI drift, datasets, the registry and the selected champion persist across restarts.

Gives reviewers concrete evidence and uncertainty before a model-selection or release decision.

The current [version 1.1.0 release](https://github.com/JasonStys/ml-model-lifecycle-observatory/releases/tag/v1.1.0) identifies [its packaged runtime source](https://github.com/JasonStys/ml-model-lifecycle-observatory/tree/c23def449e9d1af1f9fbdce6438cf294cc2a4217). The matching [illustrated Windows guide](https://github.com/JasonStys/ml-model-lifecycle-observatory/blob/0162e67a8019d8721fd37fae78f8f868e08846d1/docs/reports/windows-application-guide-1.1.0.docx) and [guide identity record](https://github.com/JasonStys/ml-model-lifecycle-observatory/blob/0162e67a8019d8721fd37fae78f8f868e08846d1/docs/reports/windows-application-guide-1.1.0.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows x64 and a writable owner-local workspace. Verify the matching release checksum and retain the complete distribution and notices. The application runtime is bundled; no system Python, Node or Docker setup is needed for its prepared workflows.

**Current limits.** An owner-local model workbench, not a production deployment controller or authenticated multiuser release authority. Local projects and artifacts are plaintext.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

## Problem

A model notebook does not explain whether a particular artifact belongs to the intended dataset and registry entry, why its recorded quality gates pass, or which drift evidence applies. Reviewers need that context before making a separate promotion or rollback decision.

## Constraints

Use deterministic synthetic data and bounded, safely parsed artifacts. Administrative review requires the existing token and must not promote or roll back a model. Recorded evaluation and dataset metadata must remain distinct from independently rerunning metrics or verifying raw dataset bytes.

## Design

The existing Python pipeline trains calibrated models on deterministic synthetic data, checks artifacts before serving, records lifecycle transitions in SQL and supports controlled canary routing and rollback.

The new local CLI and authenticated administrator endpoint produce a read-only release dossier. They verify bounded bundle bytes, manifests and schema against registry metadata, then explain recorded gate outcomes, split declarations, calibration and abstention. A coherent role/history snapshot retains at most 100 entries with an explicit truncation flag.

An operator can inspect a candidate, attach matching drift context and export a new report without promoting, rolling back or overwriting an existing export. Missing context, small samples and unverified prior rollback candidates remain visible. Artifact/registry agreement does not rerun evaluation or authenticate the raw dataset.

## Verification

Independent gate-boundary fixtures and actual trained artifacts check registry agreement, tampering, authorization, history bounds and no-write behavior. Resource-warning failures catch leaked SQLite connections; separate hosted database and container gates complement local tests.

## Measured result

The report records **59 non-PostgreSQL tests at 97.16% branch-inclusive coverage**, with the new review module fully covered. Independent gate-boundary cases and actual trained-artifact journeys cover unauthorized requests, tampering, metadata disagreement, invalid values, size limits, history truncation, absent registries and no lifecycle writes.

Testing also exposed SQLite handles that survived completed transactions. Read/schema paths now close connections explicitly, and resource/unraisable warnings fail tests. The final suite passes those guards and confirms that reviewing an absent registry does not create it.

Strict types, source checks, Kubernetes object validation and dependency audits passed. The accepted CI includes the separate PostgreSQL and container checks; they are not counted as locally executed database tests.

Accepted source: [`e3f47233539d2af763b5c30a2575e6544a0ba5d7`](https://github.com/JasonStys/ml-model-lifecycle-observatory/tree/e3f47233539d2af763b5c30a2575e6544a0ba5d7). The [change report](https://github.com/JasonStys/ml-model-lifecycle-observatory/blob/e3f47233539d2af763b5c30a2575e6544a0ba5d7/docs/reports/practical-workflows-20261109.md) records the executed scope and results. Exact-main workflow records passed: [CodeQL](https://github.com/JasonStys/ml-model-lifecycle-observatory/actions/runs/42720621967), [CI](https://github.com/JasonStys/ml-model-lifecycle-observatory/actions/runs/42720622275).

## Limitations

This is a synthetic operator-token lab, not general user accounts or production release authority. Recorded metrics and dataset fingerprints are declarations matched to the artifact, not independently repeated evaluation. The 100-sample drift heuristic is not statistical confidence or causal diagnosis. Snapshots may become stale. This source-first project is built and exercised through its documented package/service gates; no native desktop release is supplied.
