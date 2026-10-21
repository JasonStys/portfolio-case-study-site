---
title: "Telemetry flags with reasons, missing data and held-out evidence"
repository: "https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio"
summary: "Frozen robust telemetry baselines, causal drift checks and explicit missing observations make both detection successes and false alarms inspectable."
role: "Statistical software and telemetry evaluation"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "576 finite configurations",
    "Causality and label-isolation tests",
    "Held-out strategy comparison",
    "Explicit false alarms and misses",
  ]
---

## Problem

A detector can appear effective by fitting future observations, using ground-truth labels during scoring or counting missing telemetry as healthy. A useful analysis tool needs frozen training, explicit context, causal processing and honest quality accounting.

## Constraints

Three synthetic channels and logical ticks, not physical spacecraft measurements. Train only on the fixed prefix and evaluate later observations. Labels may evaluate decisions but never influence them. Undefined denominators stay undefined; a telemetry gap is not a sensor confusion-count success.

## Design

Python learns channel/context median–MAD limits on ticks 0–79, then applies point limits, causal EWMA drift and a repeat-value flatline rule. The same held-out observations are scored by a context-aware and a pooled strategy. The TypeScript inspector exposes residuals, thresholds, gaps, selected ticks and alert reasons. Ground truth is separated from scoring. Unlabeled CLI imports have unknown accuracy, not invented labels.

## Verification

Hand-computed statistical/rule oracles, future-mutation causality checks, label-isolation checks, bounded CSV property cases and the complete finite UI grid test different failure modes. Real browser tests verify gaps, null metrics, actual downloads, retry behavior, mobile layout and accessibility. See the [published evidence](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/releases/tag/v1.0.0), [model](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/blob/main/docs/MODEL.md) and [validation](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/blob/main/docs/VALIDATION.md).

## Measured result

Release v1.0.0 records 87 Python tests, 99.29% branch-aware coverage, 11 TypeScript tests, 21 three-engine browser checks and all 576 finite configurations. Twenty-four scenario/seed metric-and-hash contracts retain both false positives and misses. Eight Validation jobs and both CodeQL analyses passed at source `702f0b74c96c374efc26e43b5833b68f992c0a4a`. These are source-linked historical measurements, not a claim of operational detection accuracy or new portfolio-site execution.

## Limitations

Statistical learning and heuristics, not a neural network, physical model, root-cause diagnosis or live spacecraft monitor. Threshold quality depends on the clean-prefix and characterized-context assumptions. Synthetic precision/recall does not establish real-mission performance. Missing data resets temporal state and reduces evidence. No command, hardware control, flight qualification or agency endorsement exists.
