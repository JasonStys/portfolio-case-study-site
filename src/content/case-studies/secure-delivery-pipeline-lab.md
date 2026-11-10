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

Independent fixtures test authentication boundaries and inject atomic-write failures. Actual fixed-example staging and rollback use owned temporary roots; mocked external verifier replies remain explicitly separate from genuine hosted attestation checks.

## Measured result

The report records **114 tests with no skips**, **93.05% combined statement/branch coverage** and complete coverage of the receipt module. Independent cases verify unchanged state during impact review, every required staged authentication, wrong identities, modified candidates, verifier outages and output collisions.

Actual authored zipapp staging, fixed health probes, promotion and rollback run in temporary lab roots. Tests inject final-write failure, verify atomic preservation, exercise idempotent retries and legacy migration, and check bounded history after 25 transitions. External attestation responses in local unit fixtures are mocked and are not claimed as live cryptographic evidence.

The unchanged 10,000-row inventory benchmark measured a 23.914 ms p95 over 30 runs on its recorded machine. This excludes signature-service latency and does not measure deployment capacity.

Accepted source: [`9dd48002acfd8c277b5903cd4849c295bf551d81`](https://github.com/JasonStys/secure-delivery-pipeline-lab/tree/9dd48002acfd8c277b5903cd4849c295bf551d81). The [change report](https://github.com/JasonStys/secure-delivery-pipeline-lab/blob/9dd48002acfd8c277b5903cd4849c295bf551d81/docs/reports/operations-2026-11-09.md) records the executed scope and results. Exact-main workflow records passed: [CodeQL](https://github.com/JasonStys/secure-delivery-pipeline-lab/actions/runs/42699848608), [Validate](https://github.com/JasonStys/secure-delivery-pipeline-lab/actions/runs/42699848767).

## Limitations

This is a disposable teaching pipeline, not SLSA certification, malware analysis or production deployment authority. Only the fixed example is executed. Receipts contain local assertions rather than signed, tamper-proof audit evidence; impact review does not authorize deployment. A real environment needs independently chosen trust and operating procedures. Earlier release downloads have not been rebuilt for this source update.
