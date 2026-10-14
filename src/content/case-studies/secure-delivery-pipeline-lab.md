---
title: "Delivery gates that verify identity and recovery"
repository: "https://github.com/JasonStys/secure-delivery-pipeline-lab"
summary: "A defensive supply-chain lab connecting reproducible bundles, SBOMs, independent build-identity verification, staged promotion, and authenticated rollback under tampering."
role: "DevSecOps and software supply-chain engineering"
languages: ["Python", "Bash", "Dockerfile"]
evidence:
  [
    "Independent attestation checks",
    "Tamper-negative scenarios",
    "Staged promotion",
    "Authenticated rollback",
  ]
featuredOrder: 5
---

## Problem

Successful builds do not establish that a deployed artifact came from the intended source and workflow. Recovery can also become a trust bypass if a previous artifact is accepted merely because it was once present.

## Constraints

Verification must bind exact repository, commit/tag, workflow, identity, and bytes. Failure must preserve the active release. Recovery must reauthenticate the previous artifact. The example must not execute unknown payloads.

## Design

A dependency-free Python inventory example produces deterministic bundles and an SBOM. Least-privilege, pinned delivery gates apply scanners, non-root execution, and keyless GitHub attestations. An independent verifier validates identity and manifest bindings before fixed health probes, atomic promotion, or explicitly authenticated rollback.

## Verification

Four OS/Python lanes exercise the source while independent Linux/Windows scenarios test cryptography, identity, tampering, promotion, and recovery. Scanning results retain their exact scope. See [validation 1.0.1](https://github.com/JasonStys/secure-delivery-pipeline-lab/blob/main/docs/reports/validation-1.0.1.md).

## Measured result

The recorded suite passed 95 tests with 91.58% combined statement/branch coverage, plus nine live cryptographic scenarios on Linux and Windows. Invalid identity or modified bundles are expected-negative checks, not waived failures.

## Limitations

This is a disposable teaching pipeline, not a SLSA certification, production malware sandbox, or assurance that every dependency is safe. Only the fixed example is executed. A genuine deployment still needs its own environment, signing trust, approvals, and incident procedures.
