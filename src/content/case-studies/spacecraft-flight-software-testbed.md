---
title: "Software recovery you can replay and inspect"
repository: "https://github.com/JasonStys/spacecraft-flight-software-testbed"
summary: "A software-only C++ executive with deterministic fault recovery and a review of onboard state changes versus actual downlink witnesses."
role: "Flight-software concepts and systems verification"
languages: ["C++", "Python", "TypeScript", "SQL"]
evidence:
  [
    "Independent recovery oracles",
    "Received-witness comparison",
    "Native sanitizers",
    "Cross-platform source validation",
  ]
---

## Problem

A mode label cannot explain whether a short-lived fault state reached the ground. A delayed downlink can miss a transition entirely or reveal only a later cumulative counter. Reviewers need to distinguish simulated onboard events from what the received stream actually supports.

## Constraints

Keep the executive deterministic and software-only, with bounded checkpoints and validated commands. Logical ticks and invented indices are not physical telemetry. Missing downlinks must remain missing, and full-run synthetic truth must not be presented as a causal ground observation.

## Design

The deterministic C++20 executive models boot, standby, science and latched SAFE states with logical ticks, a watchdog and bounded checkpoints. A fixed native worker supplies a Python evidence service and TypeScript inspector. A nominal run provides a comparison under identical settings.

The new review compares mode, boot and diagnostic-counter changes with their first actual received witnesses. It exposes unseen short states, preceding received bounds, confirmation delays and boot/window censoring. Full-run synthetic truth is shown separately from the causal ground perspective.

A reviewer can inject a watchdog/reset or downlink-loss scenario, inspect what changed onboard, follow received frames and export the same run-identified JSON/HTML ledger. No witness is labeled as proof that nothing happened; later counter receipt does not reveal an exact increment time.

## Verification

Native command/codec contracts and independent Python traces check watchdog/reset behavior and received witnesses. Browser journeys separate onboard truth from ground evidence and verify exports, missing observations, errors and accessibility.

## Measured result

The report records **81 Python tests at 99.48% combined statement/branch coverage**, three rebuilt native contracts, **12 TypeScript tests** and **24 Chromium/Firefox/WebKit browser journeys**. Hand-authored traces cover hidden states, reset boundaries, missing prior frames, empty/no-change cases and unconfirmed changes at the window end.

Native scenarios independently verify delivered frames and time order. Browser journeys check actual witness inspection, ground/truth separation, exports, failures and mobile accessibility. All seven existing replay fingerprints and summaries remain unchanged. Accepted CI retains cross-platform, sanitizer, native coverage and portable-build checks.

Accepted source: [`9f5b99802e6f3f3f0bfa50357c203635923cf159`](https://github.com/JasonStys/spacecraft-flight-software-testbed/tree/9f5b99802e6f3f3f0bfa50357c203635923cf159). The [change report](https://github.com/JasonStys/spacecraft-flight-software-testbed/blob/9f5b99802e6f3f3f0bfa50357c203635923cf159/docs/reports/PRACTICAL_WORKFLOWS_20261109.md) records the executed scope and results. Exact-main workflow records passed: [CodeQL](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/42704308513), [Validation](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/42704308230).

## Limitations

This is not an RTOS, hardware controller, timing guarantee or flight-qualified component. Logical ticks and invented indices are not physical measurements, and SAFE is only a simulated state. CRC checks detect corruption rather than authenticated authorship. No guidance, targeting or real mission operation is supplied. Previously published downloads predate this review workflow; use the accepted source for the new features.
