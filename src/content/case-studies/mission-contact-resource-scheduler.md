---
title: "A finite optimum, independently checked"
repository: "https://github.com/JasonStys/mission-contact-resource-scheduler"
summary: "A bounded exact contact scheduler with independently checked station-loss comparisons and practical portable-app planning evidence."
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

A good baseline allocation can become unusable when a station is lost. Reviewers need to see which requests lose service, what alternative contacts replace them and whether a feasible empty plan is a legitimate result.

## Constraints

Finite invented candidate windows, station names and resource units; no real radio scheduling or mission dispatch. Station-loss replanning optimizes the existing objective and does not claim minimum changes to an earlier plan.

## Design

Retain the exact bounded solver and independent exhaustive oracle. Replan each full-horizon station loss while preserving the original case, budgets and other blackouts. Compare retained, removed and added contacts, per-request changes and utility/resource deltas without replacing the baseline timeline. The released 1.1.0 portable release includes the real comparison workflow, source-bound version identity and actual extracted-executable UI/export acceptance.

## Verification

The extracted app is checked against the hand-computable 60 + 60 versus 100 greedy trap. Losing ALPHA removes B1 and C1, gives zero utility with no selected contacts and preserves the 120-utility baseline. The UI download must equal the frozen API result; unreachable service remains an explicit feasible empty case. All 16 old exact/greedy/delta outputs were preserved, with only version-bound hashes refreshed after independent old-version restoration.

## Measured result

Recorded locally: 645 Python tests passed with 99.37% combined coverage against the unchanged 90% requirement; 12 TypeScript tests,27 real Chromium/Firefox/WebKit source journeys and16 deterministic scheduling contracts passed. Actual extracted Windows station-loss UI and exact JSON export passed, with 19 additional authenticated draft-API regression tests in the full suite.

Accepted source: [`4e5c7ecf87d8ac372a3a45cafc9b539a4fc660f3`](https://github.com/JasonStys/mission-contact-resource-scheduler/tree/4e5c7ecf87d8ac372a3a45cafc9b539a4fc660f3). The [validation report](https://github.com/JasonStys/mission-contact-resource-scheduler/blob/4e5c7ecf87d8ac372a3a45cafc9b539a4fc660f3/docs/reports/PORTABLE_REFRESH_20261109.md) records executed scope and conditions. Exact-source main checks passed: [CodeQL](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/42752427629), [Validation](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/42752427785).

[Version 1.1.0 downloads](https://github.com/JasonStys/mission-contact-resource-scheduler/releases/tag/v1.1.0) contain application source [`4e5c7ecf87d8ac372a3a45cafc9b539a4fc660f3`](https://github.com/JasonStys/mission-contact-resource-scheduler/tree/4e5c7ecf87d8ac372a3a45cafc9b539a4fc660f3). The [release workflow](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/42753749258) passed its documented native gates. See the [download index](/portfolio-case-study-site/downloads/) for actual platforms, file types, full checksums and runtime requirements. All three release jobs exercised their own freshly extracted application and real UI/export. The Windows download was independently checked and exercised again before publication; this does not certify an installer lifecycle or default OS browser opening.

## Limitations

The solver proves its declared finite optimization problem, not the adequacy of omitted contact options or real station availability. Reoptimization can change contacts away from the failed station. Unsigned portable archive acceptance is not installer or clean-machine proof; default desktop opener behavior remains manual.
