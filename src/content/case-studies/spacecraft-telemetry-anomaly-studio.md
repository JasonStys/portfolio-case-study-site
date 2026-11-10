---
title: "Telemetry flags with reasons, missing data and held-out evidence"
repository: "https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio"
summary: "Frozen telemetry baselines and causal alerts with run-specific triage episodes, explicit gaps, boundary uncertainty and exportable human review."
role: "Statistical software and telemetry evaluation"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Frozen statistical baselines",
    "Run-specific episode review",
    "Explicit missing observations",
    "Held-out metric contracts",
  ]
---

## Problem

A detector can look effective by fitting future data or treating missing observations as healthy. Even honest point-level alerts become difficult to investigate when reviewers cannot tell whether a condition recovered, crossed a mode boundary or simply disappeared into a data gap.

## Constraints

Train only on the fixed prefix, keep labels outside scoring and evaluate later observations causally. Missing observations must not count as healthy detections. Episodes and notes must belong to one analysis rather than carrying decisions across changed evidence.

## Design

Python learns channel/context median–MAD limits on a fixed training prefix, then applies point checks, causal EWMA drift and repeat-value rules. The same held-out data compares context-aware and pooled strategies. Labels evaluate decisions without influencing scoring.

The new triage groups alerts by channel and context within one identified run. Episodes explicitly distinguish observed recovery, mode/gap boundaries and conditions already active at the start or unconfirmed at the end. Missing data never supplies an invented recovery.

A reviewer can inspect an episode, add a bounded note and review state, and download a JSON review linked to the exact analysis hash. CLI, HTML and saved-history outputs carry the same episode ledger. Notes remain separate human commentary; starting another analysis clears them rather than silently applying them to different evidence.

## Verification

Hand-written decision rows, future-mutation tests and label-isolation checks probe different failure modes. Real browser journeys inspect and export episodes, invalidate stale notes, expose missing metrics and exercise API/security boundaries.

## Measured result

The report records **90 Python tests at 99.34% combined statement/branch coverage**, **13 TypeScript tests** and **24 Chromium/Firefox/WebKit browser journeys**. Independent decision rows exercise channel isolation, gaps, mode changes, normal recovery, empty input and both window boundaries.

Browser checks follow actual run-specific review/export, note reset, failed requests, mobile accessibility and existing security boundaries. Twenty-four metric/comparison fixtures were independently checked against their previous values before refreshing hashes to include the episode ledger. Detector scoring and frozen-training semantics remain unchanged.

Accepted source: [`0f63e1332b00d30fc682589bfd0fdad637845ce3`](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/tree/0f63e1332b00d30fc682589bfd0fdad637845ce3). The [change report](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/blob/0f63e1332b00d30fc682589bfd0fdad637845ce3/docs/reports/PRACTICAL_WORKFLOWS_20261109.md) records the executed scope and results. Exact-main workflow records passed: [Validation](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/42697036475), [CodeQL](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/42697036082).

## Limitations

Three synthetic channels and logical ticks do not establish physical spacecraft accuracy. This combines statistical learning and heuristics, not a neural model, root-cause diagnosis or live monitor. Notes are tab-local and must be exported; no authenticated reviewer identity or review import is supplied. Hashes identify content rather than its truth or authorship. Earlier release downloads have not been rebuilt for this update; use the accepted source.
