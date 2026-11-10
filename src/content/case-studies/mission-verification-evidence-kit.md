---
title: "A passing test is not enough evidence"
repository: "https://github.com/JasonStys/mission-verification-evidence-kit"
summary: "Revision-aware requirement traceability with independent SQL verdicts and a prioritized revalidation queue for stale, missing or mismatched evidence."
role: "Verification evidence and developer tooling"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Independent Python/SQL verdicts",
    "Latest-attempt revision rules",
    "Revalidation work queue",
    "Explicit provenance limits",
  ]
---

## Problem

An old green result can survive a changed requirement or hide a newer failure. A badge also cannot tell a reviewer which evidence to refresh, which fault links are missing or which source revision the next test must describe.

## Constraints

Require explicit bounded links and exact revisions. The newest attempt governs even when an older one passed. Supplied evidence must not execute arbitrary commands, and an action queue must not override the gate or present declared metadata as authenticated mission truth.

## Design

Python validates bounded requirement/test/fault links, latest attempts, chronology, freshness and revision bindings. Independently formulated SQL checks each requirement verdict; disagreement suppresses the report. Older passes cannot override a newer failure or skip. A fixed-suite JUnit adapter imports reviewed test results without executing arbitrary supplied code.

The new revalidation queue turns these findings into concrete human work. It prioritizes blocked critical requirements and supplies expected source, definition and component revisions, procedure references and inclusive freshness deadlines. Missing procedures or fault links, chronology investigations and release-source reconciliation remain distinct actions.

A reviewer can open a deliberate gap fixture, inspect the required evidence and export the same checklist through the UI, JSON, HTML or CLI. The queue does not weaken or replace the independent gate. It helps plan the next review without fabricating a rerun or granting a waiver.

## Verification

Independent SQL evaluates requirement verdicts separately from Python. Boundary and mutation fixtures check freshness, revisions, latest attempts and work priority; actual UI/export journeys exercise the resulting checklist, structural gaps and stale/error states.

## Measured result

The report records **177 Python tests at 98.05% combined statement/branch coverage**, **four TypeScript tests** and **39 Chromium/Firefox/WebKit browser journeys**. Independent cases check the exact valid-age boundary and next invalid second, required revisions, critical priority, configured/unconfigured fault links and separation of chronology from release-source work.

Browser journeys inspect queue priority and structural work, actual downloads, stale/error handling and mobile accessibility. Six existing gate summaries remain unchanged. Accepted-source CI also retains SQL, actual fixed-suite recording, security and portable-build checks.

Accepted source: [`048dd33a041fa53d7ecfc8cdab369137812a47ed`](https://github.com/JasonStys/mission-verification-evidence-kit/tree/048dd33a041fa53d7ecfc8cdab369137812a47ed). The [change report](https://github.com/JasonStys/mission-verification-evidence-kit/blob/048dd33a041fa53d7ecfc8cdab369137812a47ed/docs/reports/PRACTICAL_WORKFLOWS_20261109.md) records the executed scope and results. Exact-main workflow records passed: [CodeQL](https://github.com/JasonStys/mission-verification-evidence-kit/actions/runs/42702154070), [Validation](https://github.com/JasonStys/mission-verification-evidence-kit/actions/runs/42702154127).

## Limitations

The queue uses a supplied fixed observation time; it is not a live reminder or automatic rerun system. Traceability cannot discover omitted requirements, fabricated results or weak assertions. SQL agreement is not external truth; hashes are not signatures. Separately verifying a signed demo delivery does not authenticate fictional mission results. No mission authorization, compliance certification or flight assurance is supplied. Older downloads predate this queue; use the accepted source.
