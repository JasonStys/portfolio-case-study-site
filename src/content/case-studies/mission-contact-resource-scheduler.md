---
title: "A finite optimum, independently checked"
repository: "https://github.com/JasonStys/mission-contact-resource-scheduler"
summary: "An exact bounded contact optimizer with independently checked station-loss replanning, resource ledgers and explicit allocation changes."
role: "Optimization and resource-constrained software"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Exact finite optimization",
    "Station-loss replanning",
    "Independent exhaustive oracle",
    "Resource and request deltas",
  ]
---

## Problem

A locally attractive contact can prevent a better overall plan when stations, spacecraft and budgets compete. A station outage creates a further question: which requests can still be served under the same constraints, and which assignments must change?

## Constraints

Consider only bounded invented candidates under the original reservations, guard times, blackouts, deadlines, band rules and budgets. Tie breakers must be deterministic. A contingency is one full-window station loss; it cannot silently add contacts or relax feasibility constraints.

## Design

Python branch-and-bound optimizes a documented finite objective. A greedy policy provides a comparison, while independent exhaustive enumeration checks small cases. The model enforces station/spacecraft reservations, guard time, blackouts, deadlines, band compatibility, complete-delivery capacity and separate time/energy budgets.

The new contingency workflow removes one station for the full planning window and reoptimizes the original objective. Each station's loss is a separate alternative. The inspector lists retained, removed and added contacts, request assignments before/after, utility/service/energy differences and direct outage exclusions.

A planner can review a nominal or maintenance case, inspect a failed station's alternative and compare unscheduled requests without replacing the original timeline. JSON, HTML, CLI and local history retain the exact scenario and run identity. This makes the effect of scarce resources inspectable rather than promising that an old plan can always be preserved.

## Verification

Independent exhaustive subset enumeration checks the exact solver across nominal, greedy-trap, maintenance and unreachable cases. Browser journeys inspect allocation differences, preserve the original plan and verify exports, empty networks and error handling.

## Measured result

The report records **556 Python tests at 99.34% combined statement/branch coverage**, **12 TypeScript tests** and **27 Chromium/Firefox/WebKit browser journeys**. A separate exhaustive subset oracle covers nominal, maintenance, greedy-trap and unreachable cases, objective ties, guards, empty choices and existing blackout limits.

Real browser tests inspect removed allocations, verify that the original case remains intact, exercise a completely unavailable network and check downloads, failed requests, accessibility and restrictive headers. Sixteen existing exact/greedy summaries, solver counts and utility differences remained unchanged before refreshing expanded evidence hashes.

Accepted source: [`7658aa60ce9f953ad2f62a1c08d798942c46b5b1`](https://github.com/JasonStys/mission-contact-resource-scheduler/tree/7658aa60ce9f953ad2f62a1c08d798942c46b5b1). The [change report](https://github.com/JasonStys/mission-contact-resource-scheduler/blob/7658aa60ce9f953ad2f62a1c08d798942c46b5b1/docs/reports/PRACTICAL_WORKFLOWS_20261109.md) records the executed scope and results. Exact-main workflow records passed: [CodeQL](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/42698411010), [Validation](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/42698411022).

## Limitations

The optimizer considers bounded invented candidates, not physical visibility predictions or live ground-network dispatch. Station losses are separate full-window alternatives, not arbitrary timed or sequential outages. Reoptimization does not guarantee locked contacts or minimum changes. A finite optimum says nothing about omitted candidates or operational suitability. Earlier published downloads predate this workflow; use the accepted source.
