---
title: "Reliable job control across process boundaries"
repository: "https://github.com/JasonStys/cloud-job-orchestrator"
summary: "A Rust and PostgreSQL control plane for dependency-aware jobs, leases, cancellation, retries, operator visibility, and reproducible cloud deployment."
role: "Cloud, backend, and distributed-systems engineering"
languages: ["Rust", "SQL", "TypeScript", "Bash"]
evidence: ["DAG validation", "PostgreSQL leases", "Failure recovery", "Kubernetes and Terraform"]
featuredOrder: 6
---

## Problem

Background work becomes difficult when jobs have dependencies, workers disappear, leases expire, retries overlap, and operators cannot tell whether a task is delayed or permanently stuck. A reliable control plane must make ownership and recovery explicit.

## Constraints

- Dependency graphs must reject cycles before execution.
- Work ownership must survive worker failure without allowing unbounded duplicates.
- Retries, concurrency, payloads, and logs need explicit limits.
- Local verification and cloud deployment must use the same service contracts.

## Design

Rust exposes a typed API and scheduler around PostgreSQL-backed jobs, edges, attempts, leases, and events. Topological validation protects the DAG boundary. Workers claim due tasks through expiring leases and heartbeat while running. Idempotency keys and terminal-state rules bound duplicate effects.

A small TypeScript operations interface presents dependency state, attempts, cancellation, and recovery. Containers, Kubernetes manifests, and Terraform document the deployment path without making cloud access a local-test requirement.

## Verification

Unit and property tests cover graph validation, retry schedules, state transitions, and lease semantics. PostgreSQL integration tests simulate contention and abandoned work. Browser tests cover operator workflows, while infrastructure checks validate manifests and plans.

## Measured result

The demonstration submits a dependency graph, runs ready jobs in parallel, simulates a lost worker, recovers after lease expiry, and preserves an ordered event history for review.

## Limitations

The project is a bounded reference implementation. It does not claim exactly-once execution, multi-region consensus, or the operational maturity of a managed workflow platform.
