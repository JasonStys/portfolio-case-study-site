---
title: "Player telemetry that can be trusted"
repository: "https://github.com/JasonStys/player-telemetry-analytics-platform"
summary: "A privacy-aware analytics system that turns synthetic gameplay events into validated timelines, funnels, cohorts, and anomaly reviews."
role: "Data engineering and product analytics"
languages: ["Python", "SQL", "TypeScript"]
evidence:
  [
    "SQL-first transformations",
    "Data-quality contracts",
    "Cohort and funnel tests",
    "Accessible analytics UI",
  ]
featuredOrder: 2
---

## Problem

Gameplay dashboards are only useful when event identity, ordering, session boundaries, and late data are handled consistently. A visually convincing chart can still be wrong if the underlying transformation silently duplicates players or shifts funnel denominators.

## Constraints

- Fixtures must be synthetic and contain no real player or employer data.
- Local development should remain lightweight while preserving production-shaped SQL.
- Every metric needs a traceable definition and a reproducible fixture.
- The interface must communicate uncertainty and data-quality failures.

## Design

Python validates ingestion envelopes and writes columnar fixtures. SQL transformations build canonical events, sessions, funnel stages, retention cohorts, and anomaly candidates in DuckDB locally, with PostgreSQL integration coverage for portability. A TypeScript dashboard exposes metric definitions beside the visual result.

Stable event keys and explicit time windows make reruns idempotent. Quality checks reject missing identifiers, impossible timestamps, duplicate events, and schema drift before analytical tables are published.

## Verification

Unit and property tests cover event normalization. Golden SQL fixtures assert exact funnel and cohort outputs. Integration tests compare supported database behavior, while browser and accessibility tests validate filtering, detail views, keyboard use, and chart alternatives.

## Measured result

The project produces repeatable player timelines and funnels from the same source fixture and makes rejected rows visible rather than hiding them. Query plans and benchmark evidence document the indexes and transformations that matter.

## Limitations

The workload is synthetic and intentionally bounded. It does not claim the throughput of a managed warehouse, and the anomaly review is a decision aid rather than an automated player classification system.
