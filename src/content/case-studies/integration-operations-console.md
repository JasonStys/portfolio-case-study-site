---
title: "Reliable integration operations, made observable"
repository: "https://github.com/JasonStys/integration-operations-console"
summary: "A Java and TypeScript integration lab with complete job search, coherent audit snapshots, exact review downloads and deterministic connector discovery."
role: "Full-stack and reliability engineering"
languages: ["Java", "TypeScript", "SQL"]
evidence:
  [
    "Complete filtered job search",
    "Captured audit review",
    "Real API/browser journeys",
    "Deterministic discovery order",
  ]
---

## Problem

Pagination, throttling, transient faults and duplicate requests make integrations difficult to support. A recent-activity feed is insufficient when an operator needs an older job, its retry state and the exact audit evidence behind a recovery decision.

## Constraints

All providers and accounts are fictional. Retries, request keys and new audit windows need explicit bounds; changed request intent must not duplicate work. Downloads must match their captured review, and a stable discovery order must not depend on unspecified hash-map iteration.

## Design

Spring Boot persists fictional accounts, jobs, idempotency keys and append-only audit events. Deterministic providers reproduce bounded failure sequences. OpenAPI-generated types connect the Java API to a responsive TypeScript console.

Users can search the complete job database by account and status, move through query-bound keyset pages and capture current job state with a bounded audit window in one read transaction. Older events can be inspected without pretending they reconstruct historical job state. Download returns the displayed snapshot exactly.

Visible provider references and request keys distinguish several accounts, a retry of one submission and a new sync. Changed idempotency intent is rejected. Tests exposed and corrected the real client's unbound Run-next call, SQL timestamp rounding, omitted required-null fields and populated mobile overflow.

A further correction separates immutable discovery metadata from the hash lookup: connectors are listed by ID, independent of JVM map iteration or Spring discovery order. Lookup remains expected O(1); metadata is sorted once.

## Verification

JDBC/Flyway and HTTP tests check filtering, cursor boundaries, snapshots and idempotency. React/real-browser journeys test user input, failure recovery and exact downloads. The ordering correction adds an independent permutation oracle and a real HTTP assertion rather than controlling JVM hash seeds.

## Measured result

The latest correction records **36 passing Java tests**, **87.43% line coverage**, full registry line/branch coverage and zero Checkstyle violations. Its independent oracle checks **120 permutations**, colliding IDs, duplicates, input/output immutability and actual HTTP order.

The [original workflow report](https://github.com/JasonStys/integration-operations-console/blob/2563b4154d2e7755516d12911d68c4a32d654905/docs/reports/practical-workflows-2026-11-09.md) records **25 frontend tests** and **14 actual desktop/mobile browser journeys**. These exercise complete paging, exact audit-window membership, unchanged downloads, role failures, hostile text, stale responses, accessibility and owned-port isolation. Latest-source CI passed, including PostgreSQL, browser and container gates; CodeQL passed separately.

Accepted source: [`2563b4154d2e7755516d12911d68c4a32d654905`](https://github.com/JasonStys/integration-operations-console/tree/2563b4154d2e7755516d12911d68c4a32d654905). The [change report](https://github.com/JasonStys/integration-operations-console/blob/2563b4154d2e7755516d12911d68c4a32d654905/docs/reports/connector-order-2026-11-09.md) records the executed scope and results. Exact-main workflow records passed: [CI](https://github.com/JasonStys/integration-operations-console/actions/runs/42731432193), [CodeQL](https://github.com/JasonStys/integration-operations-console/actions/runs/42731432433).

## Limitations

Providers and accounts are fictional; demo role headers are not authentication. The scheduler is single-instance. Keyset pages are live, older review requests capture new current state, and legacy account/audit routes remain unbounded. No exactly-once or commercial-provider compatibility claim is made. Earlier downloads have not been rebuilt for this update; use the accepted source.
