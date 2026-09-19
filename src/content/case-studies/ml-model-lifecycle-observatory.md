---
title: "A model lifecycle beyond the notebook"
repository: "https://github.com/JasonStys/ml-model-lifecycle-observatory"
summary: "A reproducible ML service that treats calibration, promotion, drift, canary routing, artifact safety, and rollback as first-class engineering work."
role: "Machine-learning engineering and MLOps"
languages: ["Python", "SQL", "Bash"]
evidence: ["Reproducible training", "Promotion gates", "Drift monitoring", "Canary rollback"]
featuredOrder: 3
---

## Problem

A trained model is not a production system. Teams also need reproducible data splits, safe artifacts, evaluation thresholds, traceable promotion, monitored predictions, and a way to recover when live behavior diverges from validation results.

## Constraints

- Training and evaluation must run on deterministic synthetic data.
- Serialized artifacts must not rely on unsafe arbitrary-code loading.
- A candidate cannot become active without explicit quality gates.
- Monitoring must avoid storing sensitive raw features.

## Design

The Python pipeline creates deterministic datasets, trains calibrated candidates, records immutable metadata, and verifies checksums before serving. Promotion compares quality and calibration metrics against policy. Canary routing sends a bounded share of synthetic traffic to a candidate while drift and service-health signals remain observable.

The registry records lineage and state transitions in SQL. Rollback is an explicit operation that selects a previously verified artifact rather than rebuilding during an incident.

## Verification

Tests cover data validation, reproducibility, artifact integrity, promotion policy, drift math, concurrent routing, and rollback. API contracts and end-to-end scenarios exercise the path from training through canary failure and restoration.

## Measured result

The demonstration can train two candidates, reject one on a policy gate, promote the other, inject distribution shift, and roll back without losing lineage. Reports distinguish model metrics from service-level behavior.

## Limitations

The model and data are intentionally small. Drift signals indicate change, not cause, and cannot by themselves establish harm or justify automated decisions. The project is an engineering reference, not a regulated production deployment.
