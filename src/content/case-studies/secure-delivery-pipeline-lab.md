---
title: "Delivery gates that verify identity and recovery"
repository: "https://github.com/JasonStys/secure-delivery-pipeline-lab"
summary: "A defensive delivery lab with authenticated release comparison, atomic deployment receipts and independently verified rollback trust."
role: "DevSecOps and software supply-chain engineering"
languages: ["Python", "Bash", "Dockerfile"]
evidence:
  [
    "Independent trust checks",
    "Non-executing impact review",
    "Atomic transition receipts",
    "Authenticated rollback",
  ]
featuredOrder: 5
---

## Problem

A green build does not prove the identity of deployed bytes. Recovery can become a trust bypass when an older artifact is accepted merely because it was present before. Operators also need to understand a candidate's changes without executing it.

## Constraints

Bind trust to the intended repository, source, workflow and exact bytes. Active and candidate releases require independently selected trust, including during rollback. Failed review or transition writes must preserve active state, and impact inspection must never execute a candidate.

## Design

A dependency-free Python inventory example produces deterministic bundles and an SBOM. Pinned delivery gates, independent identity verification, fixed health probes and staged promotion preserve the boundary between trusted source and active bytes. Rollback reauthenticates the previous artifact under explicitly chosen trust.

The new impact review authenticates both active and candidate snapshots before comparing manifests, members and assets. It writes a new report without executing either candidate or changing the active pointer. Byte differences are evidence for review, not a compatibility or security verdict.

Promotion and rollback now persist the active pointer and successful transition receipt atomically. Receipts retain asserted operator/change context and the newest 20 transitions. Legacy pointers migrate without invented history; repeated successful requests do not duplicate receipts. An operator can inspect impact, perform a separately authorized transition and review its retained evidence.

## Verification

Independent fixtures retain atomic-write failures and asserted-receipt boundaries. The tagged release rebuilds the exact green main, creates keyless provenance for the allowlisted bundle and SBOM, authenticates both the new candidate and the separately trusted 1.0.1 baseline, and runs the real promotion/recovery journey before publication. Mock verifier unit fixtures remain separate from these genuine hosted and Windows cryptographic checks.

## Measured result

The corrected source passed **140 tests with no skips**, **93.05% combined statement/branch coverage** and complete receipt-module coverage. The release and independently downloaded Windows bundle each passed **19 genuine cryptographic and native cases**: non-executing impact, preserved pointer/receipt bytes, promotion and idempotency, manifest-bound local receipts, valid/invalid/over-limit probe execution, tamper and wrong-identity rejection, and explicitly separately authenticated rollback. A three-SKU demo correctly returned 46 units and $1,727.40.

Accepted source: [`e37b189fa604bb0d6951e4a926d20ed9606298a1`](https://github.com/JasonStys/secure-delivery-pipeline-lab/tree/e37b189fa604bb0d6951e4a926d20ed9606298a1). The [validation report](https://github.com/JasonStys/secure-delivery-pipeline-lab/blob/e37b189fa604bb0d6951e4a926d20ed9606298a1/docs/reports/release-refresh-2026-11-09.md) records executed scope and conditions. Exact-source main checks passed: [Validate](https://github.com/JasonStys/secure-delivery-pipeline-lab/actions/runs/42746536402), [CodeQL](https://github.com/JasonStys/secure-delivery-pipeline-lab/actions/runs/42746536395).

[Version 1.1.0 downloads](https://github.com/JasonStys/secure-delivery-pipeline-lab/releases/tag/v1.1.0) contain application source [`e37b189fa604bb0d6951e4a926d20ed9606298a1`](https://github.com/JasonStys/secure-delivery-pipeline-lab/tree/e37b189fa604bb0d6951e4a926d20ed9606298a1). The [release workflow](https://github.com/JasonStys/secure-delivery-pipeline-lab/actions/runs/42747854973) passed its documented native gates. See the [download index](/portfolio-case-study-site/downloads/) for actual platforms, file types, full checksums and runtime requirements. The downloadable zipapp is the small inventory example; its trusted verification and promotion manager remains reviewed source, not an embedded desktop installer.

## Limitations

Disposable educational delivery, without SLSA certification, production deployment authority or OS code signing. Impact compares bytes rather than compatibility or safety. Receipts contain local asserted operator aliases, not authenticated humans or signed audit records. Actual verification requires independently selected repository/source/workflow/version trust and official GitHub CLI; checksums alone cannot replace authentication. Older public releases remain available unchanged.
