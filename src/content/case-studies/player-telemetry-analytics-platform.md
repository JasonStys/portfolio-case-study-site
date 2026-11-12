---
title: "Player telemetry that can be trusted"
repository: "https://github.com/JasonStys/player-telemetry-analytics-platform"
summary: "Import event batches and inspect cohorts, sessions and retention with explicit receipt cutoffs and mature-window denominators."
role: "Data engineering and product analytics"
languages: ["Python", "SQL", "TypeScript"]
evidence:
  [
    "SQL quality contracts",
    "Receipt-time cohort review",
    "Independent retention oracle",
    "Actual analyst browser journey",
  ]
---

## Current usable application — 12 November 2026

The desktop app imports real supported event batches into DuckDB, retains accepted data and exposes cohort, session and player analyses. Receipt-time cutoffs and mature versus censored retention denominators remain explicit, and exact Parquet exports are checked by an independent reader.

Makes product analysis repeatable while keeping the observation window and missing follow-up visible.

The current [version 1.1.0 release](https://github.com/JasonStys/player-telemetry-analytics-platform/releases/tag/v1.1.0) identifies [its packaged runtime source](https://github.com/JasonStys/player-telemetry-analytics-platform/tree/9307b4aee75c7304ac9971dd502f5191d7fefe07). The matching [illustrated Windows guide](https://github.com/JasonStys/player-telemetry-analytics-platform/blob/f816035917f28092efe7ea67d4ab89651db7651e/docs/reports/windows-application-guide-1.1.0.docx) and [guide identity record](https://github.com/JasonStys/player-telemetry-analytics-platform/blob/f816035917f28092efe7ea67d4ab89651db7651e/docs/reports/windows-application-guide-1.1.0.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows x64, a local web browser and a writable owner-local workspace. Verify the matching checksum and keep the complete distribution/notices. Runtime is bundled; no system Python/Node or Docker setup is needed for prepared workflows.

**Current limits.** Supplied or synthetic events do not establish population-wide behavior. The local session is not a hosted multiuser identity service or permission to collect real player data.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

## Problem

A retention chart can mislead when late-arriving events change what was known at an earlier time or when recent players are counted as failures before their follow-up window matures. Acquisition filters must also remain consistent with later activity across platforms.

## Constraints

Use synthetic records and explicit UTC receipt cutoffs. Acquisition filters must not exclude later cross-platform follow-up. Only mature members belong in a retention denominator; missing follow-up opportunity is not a measured zero or proof of churn.

## Design

Python ingestion validation and SQL transformations produce canonical events, timelines, funnels and analytics from synthetic fixtures. DuckDB keeps local review lightweight; a separate PostgreSQL integration path checks supported portability.

A dedicated analyst panel now defines acquisition membership using the first visible event under a UTC receipt cutoff. Date, platform and version filters describe that acquisition event; later cross-platform activity still counts. One read transaction keeps membership, totals and exact-day D0/D1/D7 rates coherent.

An analyst can compare what was known at two cutoffs, inspect mature, retained and censored counts, and distinguish a measured zero from an unknown rate. Fully immature windows remain null. Empty filters, future dates and request failures are explicit rather than leaving an old chart visible. Other dashboard panels remain labeled as global.

## Verification

A hand-calculated event oracle checks late arrival, cutoff membership, maturity and exact retention. Timezone mutation tests preserve UTC results. Actual isolated API/browser journeys compare table contents with responses and exercise null, empty, invalid-date and stale-result states.

## Measured result

The report records **32 non-PostgreSQL tests at 97.60% branch-inclusive coverage**. A hand-calculated event fixture checks cutoff membership, cross-platform follow-up, later-arriving data, a D7 rate of 0.5, censored windows and exact filters. Changing the database session timezone leaves UTC results unchanged.

**10 frontend tests** cover null versus zero, no matches, failures and stale results; line, statement and function coverage is 100%, with 89.83% branches. **Three actual Chromium/API journeys** use fresh disposable data and test the populated cohort table, request reconciliation, Axe, narrow-screen focus and existing drilldown navigation. No mocked HTTP response substitutes for the backend.

Accepted source: [`f83161e7ce500027fe5313bb08e36e9716a94be2`](https://github.com/JasonStys/player-telemetry-analytics-platform/tree/f83161e7ce500027fe5313bb08e36e9716a94be2). The [change report](https://github.com/JasonStys/player-telemetry-analytics-platform/blob/f83161e7ce500027fe5313bb08e36e9716a94be2/docs/reports/practical-workflows-20261109.md) records the executed scope and results. Exact-main workflow records passed: [CI](https://github.com/JasonStys/player-telemetry-analytics-platform/actions/runs/42720166549), [CodeQL](https://github.com/JasonStys/player-telemetry-analytics-platform/actions/runs/42720166520).

The accepted CI also passed its mandatory PostgreSQL and container checks; those are distinct from the local test counts above.

## Limitations

Only synthetic local data is supported here; the application has no authentication for real player records. Receipt cutoffs do not establish completeness, causality or statistical confidence. Review uses retained accepted data, not a historical database-revision archive. This source-first project is built and exercised through its documented package/service gates; no native desktop release is supplied.
