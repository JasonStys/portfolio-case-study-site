---
title: "Telemetry flags with reasons, missing data and held-out evidence"
repository: "https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio"
summary: "Investigate telemetry episodes with explicit gaps, modes, censored recovery and detached review annotations in a portable app."
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

## Current usable application — 12 November 2026

Run-bound episodes group related channel alerts and preserve observed recovery, gaps, mode changes and censored windows. The portable interface supports investigation, detached human annotations and exact exports using editable synthetic inputs.

Makes anomaly triage manageable while keeping uncertainty and the evidence behind each episode visible.

The current [version 1.1.0 release](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/releases/tag/v1.1.0) identifies [its packaged runtime source](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/tree/616b8cc92be09622443e103cdc201ce1d0c16a55). The matching [illustrated Windows guide](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/blob/6d5c95bfb4dada3ef97b7c2f3fba0836422c42dc/docs/reports/windows-application-guide.docx) and [guide identity record](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/blob/6d5c95bfb4dada3ef97b7c2f3fba0836422c42dc/docs/reports/windows-application-guide.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Matching Windows portable bundle, its companion files and a local web browser. Runtime is bundled; no Python installation, external account, live hardware or Docker setup is needed for prepared scenarios.

**Current limits.** This is a synthetic statistical demonstration, not live mission diagnosis. Review annotations are detached exports rather than persistent shared records.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

## Problem

A list of flagged samples is difficult to review as an incident. Analysts need channel-local episodes, an honest explanation of missing/context/window boundaries and a way to attach human notes without mixing them into another run.

## Constraints

Invented telemetry and bounded rule-based decisions; no live spacecraft data or operational anomaly assurance. Human annotations are detached local downloads, not a persisted multi-user review service. Portable bundles remain unsigned and platform/ABI-specific.

## Design

Preserve frozen training and held-out evaluation. Group existing decisions into episodes with observed onset, recovery, gap, mode-change and window-censoring boundaries. Export human status and plain-text notes bound to the original run hash, then clear them when another run is analyzed. The released 1.1.0 native bundle includes this workflow with source/version identity, safe native archive formats and post-extraction Chromium acceptance.

## Verification

A known spike must produce one episode from tick 120 to tick 120 with observed recovery. The actual extracted UI records a human review, downloads its run-bound JSON and proves notes reset across nominal and spike analyses. Existing missing-data, undefined-metric, inert-export, failure-recovery and accessibility journeys remain. Version-bound golden IDs were refreshed only after independently restoring the prior version field reproduced all old hashes and preserved every numerical metric/comparison.

## Measured result

Recorded locally: 179 Python tests passed with 99.38% combined coverage against the unchanged 90% requirement; 13 TypeScript tests,24 real Chromium/Firefox/WebKit source journeys and24 deterministic detector benchmark fixtures passed. Actual extracted Windows analyst UI and exact review export passed. Nineteen independent authenticated draft-API tests supplement the original source/archive guards.

Accepted source: [`616b8cc92be09622443e103cdc201ce1d0c16a55`](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/tree/616b8cc92be09622443e103cdc201ce1d0c16a55). The [validation report](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/blob/616b8cc92be09622443e103cdc201ce1d0c16a55/docs/reports/PORTABLE_REFRESH_20261109.md) records executed scope and conditions. Exact-source main checks passed: [CodeQL](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/42752178787), [Validation](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/42752178601).

[Version 1.1.0 downloads](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/releases/tag/v1.1.0) contain application source [`616b8cc92be09622443e103cdc201ce1d0c16a55`](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/tree/616b8cc92be09622443e103cdc201ce1d0c16a55). The [release workflow](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/42752936951) passed its documented native gates. See the [dated download snapshot](/portfolio-case-study-site/downloads/history/2026-11-10/) for those platforms, file types, full checksums and runtime requirements. All three release jobs exercised their own freshly extracted application and real UI/export. The Windows download was independently checked and exercised again before publication; this does not certify an installer lifecycle or default OS browser opening.

## Limitations

An episode is a grouping of existing detector decisions, not a diagnosis. Gap and context boundaries censor continuity; notes do not authenticate telemetry or persist on the server. Windows local launch proof does not establish Linux/macOS release behavior, default OS opener success or clean-machine installation.
