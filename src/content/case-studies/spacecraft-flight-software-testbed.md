---
title: "Software recovery you can replay and inspect"
repository: "https://github.com/JasonStys/spacecraft-flight-software-testbed"
summary: "A C++20 software-only executive makes watchdog resets, validated checkpoints, lost volatile work and deliberate recovery visible through independently checked replay."
role: "Flight-software concepts and systems verification"
languages: ["C++", "Python", "TypeScript", "SQL"]
evidence:
  [
    "756 native configurations",
    "Independent recovery oracles",
    "ASan + UBSan",
    "Three-platform portable builds",
  ]
---

## Problem

A nominal demonstration can conceal what happens when a task hangs, a checkpoint is corrupt or a downlink disappears. A reviewer needs an inspectable sequence of failure, bounded recovery and explicitly lost work—not just a reassuring mode label.

## Constraints

The executive must be deterministic and software-only. Logical ticks and invented sensor/power indices are not physical telemetry. Corrupt commands must not bypass mode/health checks; missing telemetry must remain missing. SAFE is a simulated state, not a real safety guarantee.

## Design

A C++20 executive models boot, standby, science and latched SAFE modes. An independent watchdog checks deadlines. Explicit endian-independent checkpoints carry version, bounds and CRC checks. A fixed native worker feeds a Python evidence service; a TypeScript console distinguishes onboard truth from received-only downlinks. Every replay is paired with a nominal run under identical settings.

## Verification

Native command/codec contracts, independent Python deadline/recovery assertions, cross-build replay hashes, hostile-byte cases, HTTP boundaries and real three-engine browser flows complement one another. CI also runs Clang sanitizers and GCC coverage. Inspect the [published exact-source evidence](https://github.com/JasonStys/spacecraft-flight-software-testbed/releases/tag/v1.0.0), [validation report](https://github.com/JasonStys/spacecraft-flight-software-testbed/blob/main/docs/VALIDATION.md) and [source commit](https://github.com/JasonStys/spacecraft-flight-software-testbed/commit/7b117359e4568f2bb97d3576f1df8114538d13e7).

## Measured result

The v1.0.0 release records 78 Python tests at 99.43% branch-aware application coverage, 12 TypeScript tests and 21 browser checks. Native tests exercise 756 finite configurations and 5,000 seeded malformed spans. Recorded native executed line coverage is 209/209; branch coverage is separately reported as 350/485 (72.2%), not described as complete. Ten Validation jobs, three CodeQL jobs and three OS bundle builds passed at the recorded source. These are historical release measurements, not new runs performed by this portfolio site.

## Limitations

Not an RTOS, operational spacecraft controller, real-time scheduling guarantee, hardware interface or flight-qualified component. CRC detects accidental corruption, not authenticated authorship. The checkpoint model does not qualify durable device storage. Synthetic fault/replay checks demonstrate software-contract behavior, not actual mission safety, radiation tolerance or agency endorsement.
