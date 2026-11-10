---
title: "A model lifecycle beyond the notebook"
repository: "https://github.com/JasonStys/ml-model-lifecycle-observatory"
summary: "Reproducible model lifecycle engineering with read-only release dossiers, verified artifact metadata, explicit quality gates, bounded history and drift context."
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

This is a synthetic operator-token lab, not general user accounts or production release authority. Recorded metrics and dataset fingerprints are declarations matched to the artifact, not independently repeated evaluation. The 100-sample drift heuristic is not statistical confidence or causal diagnosis. Snapshots may become stale. Earlier downloads have not been rebuilt for this update; use the accepted source.
