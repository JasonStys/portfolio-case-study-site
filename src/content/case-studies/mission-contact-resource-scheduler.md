---
title: "A finite optimum, independently checked"
repository: "https://github.com/JasonStys/mission-contact-resource-scheduler"
summary: "An exact contact-allocation optimizer makes resource tradeoffs visible through a greedy comparison, constraint ledgers and an independent exhaustive oracle."
role: "Optimization and resource-constrained software"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "432 finite control combinations",
    "Independent exhaustive oracle",
    "Explicit deterministic tie breakers",
    "542 Python tests",
  ]
---

## Problem

Choosing a locally attractive contact can prevent a better overall plan when stations, spacecraft and limited budgets compete. A reviewer should see why a plan is feasible, what alternatives lost and what the word optimal actually covers.

## Constraints

Only fixed, invented contact candidates are considered. The model enforces station/spacecraft reservations, guard time, blackouts, deadlines, band compatibility, full-delivery capacity and separate time/energy budgets. Relative ticks and invented units are not physical contact predictions. Tie breakers must be deterministic.

## Design

A Python branch-and-bound search optimizes the documented finite objective, while a greedy policy provides a comparison—not an oracle. Independent exhaustive enumeration checks small candidate sets. A TypeScript station timeline, decision inspector and resource ledger expose the accepted and rejected requests. Strict JSON input, reproducible exports and optional immutable SQL history carry the complete context.

## Verification

All 432 finite controls, generated cases, analytic interval boundaries and independent exhaustive results are checked. Every selected plan is audited separately for violations. Three real browser engines exercise timeline/filter/ledger behavior, downloads, retries, keyboard use and accessibility. See the [model](https://github.com/JasonStys/mission-contact-resource-scheduler/blob/main/docs/MODEL.md), [validation](https://github.com/JasonStys/mission-contact-resource-scheduler/blob/main/docs/VALIDATION.md) and [exact-source release](https://github.com/JasonStys/mission-contact-resource-scheduler/releases/tag/v1.0.0).

## Measured result

The release records 542 Python tests at 99.32% branch-inclusive core coverage, 12 TypeScript tests and 24 three-engine browser checks. The independent oracle includes 100 generated cases. All eight Validation jobs, both CodeQL analyses and the three OS portable builds passed at source `f1a45fe6412bfb2d219a76ab7535b2ae34771014`. These are historical release results; this portfolio update does not rerun or newly certify the scheduler.

## Limitations

Optimal only over the supplied finite candidates, constraints and objective—not every possible contact or real mission need. Worst-case exact search remains exponential. There is no orbital propagation, live station/radio connection, hardware command, targeting output or physical energy model. A real scheduler would require qualified inputs, operational procedures and its own validation.
