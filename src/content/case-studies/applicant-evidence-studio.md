---
title: "Source-linked skills review with explicit uncertainty"
repository: "https://github.com/JasonStys/applicant-evidence-studio"
summary: "Private evidence review and career coaching with a two-record comparison, exact citations, preserved unknowns and downloadable human observations."
role: "Privacy-aware full-stack and evidence-system engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Same-rubric evidence comparison",
    "Browser-held vault key",
    "Exact private snapshot export",
    "Three-OS portable release",
  ]
featuredOrder: 6
---

## Problem

Keyword screening can miss strong project evidence or invent conclusions about transfers, unfinished programs and ambiguous education records. Reviewers need to see the supporting work and what remains unknown. Applicants need factual coaching that does not manufacture qualifications.

## Constraints

Only authorized records may be processed. Identity and sensitive traits must not affect scores, and education must not become inferred degrees or paid years. Private comparison must use the unlocked browser workspace without exporting plaintext to a service or changing account data.

## Design

Normalized records keep skills, sources, education and employment separate. A constrained rubric produces advisory evidence coverage and coaching. Identity changes do not improve scores, and coursework never becomes fictional paid experience.

The new workflow captures exactly two authorized records against the same rubric. A reviewer sees criterion targets, strongest reviewed citations, source warnings, excluded unreviewed claims and clarification prompts. Original applications remain available for inspection. Optional observations and an exact JSON snapshot can be downloaded; selection order is preserved without choosing a winner.

Private-account comparison uses one cloned, unlocked browser workspace, with no plaintext comparison endpoint, outside AI request or workspace write. Legacy developer mode reads both revisions and the rubric in one SQLite snapshot. Context changes, edits, locks and stale asynchronous results invalidate the view. Opening an original record clears observations, so the UI advises exporting first.

## Verification

Independent rubric calculations and concurrent SQLite fixtures test evidence and revision consistency. Real account journeys check encryption, isolation, exact downloads, malicious source text, stale context and lock behavior using disposable synthetic records.

## Measured result

The report records **79 Python tests at 88.70% branch-inclusive coverage**, three independently calculated compiled-domain tests, **36 legacy browser journeys** and **28 private-account journeys** across Chromium, Firefox, WebKit and mobile Chromium. Final version and hostile-source checks repeated 12 targeted journeys.

Tests cover concurrent snapshot reads, processing authorization, exact citations and exports, identity/chronology invariance, markup rendered as text, account isolation and unchanged ciphertext revisions. Comparison/export sends no plaintext or save request in private mode. The synthetic 10,000-record ranking benchmark measured approximately **0.315 seconds** in process; it excludes parsing, database, network and concurrent-user costs.

Accepted source: [`71d51b1fcd228f89d3ff81ee166bee2ce37d7a60`](https://github.com/JasonStys/applicant-evidence-studio/tree/71d51b1fcd228f89d3ff81ee166bee2ce37d7a60). The [change report](https://github.com/JasonStys/applicant-evidence-studio/blob/71d51b1fcd228f89d3ff81ee166bee2ce37d7a60/docs/reports/practical-workflows-20261109.md) records the executed scope and results. Exact-main workflow records passed: [Validate](https://github.com/JasonStys/applicant-evidence-studio/actions/runs/42727340441).

[Version 0.3.0 downloads](https://github.com/JasonStys/applicant-evidence-studio/releases/tag/v0.3.0) include this source. The [successful desktop release](https://github.com/JasonStys/applicant-evidence-studio/actions/runs/42728346654) passed genuine Windows, macOS and Linux package checks.

## Limitations

Human hiring decisions and original-source review remain essential. Coverage is neither suitability nor a fairness or legal-compliance certification. Comparison exports are unencrypted private files: evidence summaries, labels and observations can identify people despite omitted names. No new sharing or reviewer roles are supplied. Portable binaries are unsigned; vault security depends on the local OS and retained recovery material. Public hosting is not provisioned.
