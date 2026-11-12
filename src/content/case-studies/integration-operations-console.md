---
title: "Reliable integration operations, made observable"
repository: "https://github.com/JasonStys/integration-operations-console"
summary: "Search persistent integration jobs, inspect complete audit pages and export exact results through the local Java and React app."
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

## Current usable application — 12 November 2026

A bundled Java/Spring and React app provides persistent H2 storage, account/state search, complete pagination and exact review downloads. Request-key intent, real-client binding, timestamp precision, connector ordering and mobile layout were corrected using real API and browser workflows.

Lets support users investigate older or filtered work coherently instead of relying on a recent-activity feed.

The current [version 1.1.0 release](https://github.com/JasonStys/integration-operations-console/releases/tag/v1.1.0) identifies [its packaged runtime source](https://github.com/JasonStys/integration-operations-console/tree/8646ee63608448651beeaa734ff3a055d17149d7). The matching [illustrated Windows guide](https://github.com/JasonStys/integration-operations-console/blob/90cf1f8fdde1dc1b45812fd03ecb8c88b22b4efc/docs/reports/windows-application-guide-1.1.0.docx) and [guide identity record](https://github.com/JasonStys/integration-operations-console/blob/90cf1f8fdde1dc1b45812fd03ecb8c88b22b4efc/docs/reports/windows-application-guide-1.1.0.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows x64, a local web browser and a writable owner-local workspace. Verify the matching checksum and keep the complete distribution/notices. Runtime is bundled; no system Python/Node or Docker setup is needed for prepared workflows.

**Current limits.** Fictional providers and simulated actor roles are not a production identity provider. The unsigned Windows app-image stores trusted-owner local data.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

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

Providers and accounts are fictional; demo role headers are not authentication. The scheduler is single-instance. Keyset pages are live, older review requests capture new current state, and legacy account/audit routes remain unbounded. No exactly-once or commercial-provider compatibility claim is made. This source-first project is built and exercised through its documented package/service gates; no native desktop release is supplied.
