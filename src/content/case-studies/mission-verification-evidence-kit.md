---
title: "A passing test is not enough evidence"
repository: "https://github.com/JasonStys/mission-verification-evidence-kit"
summary: "A revision-aware traceability kit rejects stale and cherry-picked evidence, independently checks every requirement verdict in SQL and separates content identity from authenticity."
role: "Verification evidence and developer tooling"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Independent Python/SQL verdicts",
    "Latest-attempt and revision rules",
    "Actual fixed-suite JUnit adapter",
    "Explicit provenance boundaries",
  ]
---

## Problem

An old green result can survive a changed requirement or hide a newer failed attempt. A summary badge cannot show missing fault coverage, mismatched source revisions or what release metadata the evidence actually describes.

## Constraints

Require explicit requirement/test/fault links, bounded data and exact revisions. Never choose an older pass when the newest attempt fails or skips. Declare what a content hash proves and what it does not. Supplied evidence must never become a command to execute arbitrary code.

## Design

Python validates the complete graph and evaluates latest attempts, freshness, chronology and revision bindings. Independently formulated SQL checks every requirement verdict; disagreement suppresses the report. Every linked test and each declared requirement/fault obligation must be covered. A fixed-suite adapter maps actual authored JUnit into declared inputs. A separately scoped reused delivery verifier authenticates an existing signed demo release without executing its payload; it does not authenticate fictional mission results.

## Verification

Six deliberate gap/regression fixtures, randomized age/status mutations, record-order properties, hostile input/ZIP/identity cases, inert exports and immutable local-history tests cover different failure paths. Real recorder tests are captured, imported and gated in CI. The downloaded Windows app was tested again across three browser engines. See the [schema](https://github.com/JasonStys/mission-verification-evidence-kit/blob/main/docs/SCHEMA.md), [provenance distinction](https://github.com/JasonStys/mission-verification-evidence-kit/blob/main/docs/PROVENANCE.md) and [published exact-source evidence](https://github.com/JasonStys/mission-verification-evidence-kit/releases/tag/v1.0.0).

## Measured result

Release v1.0.0 records 174 Python tests at 97.98% branch-inclusive coverage, four TypeScript tests and 36 three-engine browser checks, repeated against the downloaded Windows app. Eight Validation jobs, both CodeQL analyses and all four release jobs passed at `40e2b8b10f985113ae915ba2e4e663f06fccfa95`. The separately scoped live delivery integration authenticated four existing demo assets. These historical results demonstrate the declared software contract—not flight qualification.

## Limitations

Traceability cannot discover omitted requirements, fabricated outcomes or inadequate assertions. SQL agreement is not independent truth about the input. Declared artifact digests are metadata unless bytes/authenticity are separately verified. Hashes are not signatures. The JUnit adapter accepts one reviewed suite, not every dialect. No mission authorization, compliance certification, hardware control or flight assurance is supplied.
