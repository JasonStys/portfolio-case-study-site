---
title: "Reliable integration operations, made observable"
repository: "https://github.com/JasonStys/integration-operations-console"
summary: "A production-shaped full-stack lab for third-party synchronization, with deterministic provider failures and operator-facing recovery controls."
role: "Full-stack and reliability engineering"
languages: ["Java", "TypeScript", "SQL"]
evidence:
  [
    "Idempotent delivery",
    "Bounded retry policy",
    "PostgreSQL integration tests",
    "Playwright operator flows",
  ]
featuredOrder: 1
---

## Problem

Third-party connectors fail in ways that are more subtle than a simple unavailable response. Providers paginate, rate-limit, redeliver webhooks, change schemas, and sometimes accept a request while the caller times out. Operators need to understand what happened without reading application logs or creating duplicate work.

## Constraints

- The public project cannot use real customer data, credentials, or provider APIs.
- Every retry must be bounded, observable, and safe to repeat.
- Audit history must explain state transitions without exposing token material.
- Backend and frontend contracts must evolve together.

## Design

The Spring Boot service models connector work as explicit states and persists job, attempt, idempotency, and audit records in PostgreSQL. Deterministic fake providers reproduce pagination, throttling, transient faults, and schema changes. An OpenAPI contract connects the Java API to a TypeScript operations interface.

The scheduler uses priority ordering for due work, while idempotency keys prevent duplicate effects. Exponential backoff includes jitter and a maximum attempt count. Exhausted work moves to a reviewable dead-letter state instead of retrying indefinitely.

## Verification

JUnit covers domain transitions and retry calculations. Property tests exercise state-machine invariants. PostgreSQL integration tests validate migrations and concurrent delivery, provider contract tests reproduce failure sequences, and Playwright follows an operator from account setup through failure inspection and replay.

## Measured result

The repository demonstrates a complete recovery story: inject a rate limit, observe scheduled backoff, exhaust a bounded retry policy, inspect the correlated audit trail, and safely replay the failed operation.

## Limitations

The providers and secrets are synthetic. The system demonstrates integration patterns, not compatibility with a specific commercial API. Horizontal scheduling at very large scale would require partitioning and lease-tuning work beyond this portfolio scope.
