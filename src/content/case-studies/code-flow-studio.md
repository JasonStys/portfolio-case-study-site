---
title: "Polyglot AI development with verifiable revisions"
repository: "https://github.com/JasonStys/code-flow-studio"
summary: "A local-first successor to a team capstone that connects a typed editor, isolated compiler workers, bounded fuzzing, AI adapters, and encrypted revision evidence."
role: "AI developer tools and full-stack engineering"
languages: ["Python", "TypeScript", "SQL", "Dockerfile"]
evidence:
  [
    "12 fixed language adapters",
    "Isolated worker execution",
    "Revision and performance evidence",
    "Local private accounts",
  ]
featuredOrder: 1
---

## Problem

Developers need to distinguish plausible generated code from code that has actually compiled and passed relevant checks. The earlier time-limited team capstone covered Python; this independent successor expands the workflow without claiming universal test generation.

## Constraints

Arbitrary source must not execute directly on the host. Providers need explicit consent. Test applicability and unavailable toolchains must remain visible. Performance measurements must describe what they actually measure.

## Design

A TypeScript editor calls a Python controller that records versioned results in SQL. Fixed compiler adapters run only inside the isolated worker image. Approved oracles and harnesses exercise bounded fuzz cases. Provider routing is configurable rather than tied to a single API; private local accounts lock source/history with a separate browser-derived vault key.

## Verification

Controller, account, cryptographic, provider, and history regressions accompany real isolated compiler scenarios. Browser journeys exercise actual registration, editor save, lock/reopen, and report downloads. Three-OS packages test the actual bundled service and executable. See the [validation report](https://github.com/JasonStys/code-flow-studio/blob/main/docs/validation-v0.2.md).

## Measured result

The recorded Windows validation passed 87 tests at 83.01% statement coverage. Release CI exercised 24 compiler/fuzz/isolation scenarios and 12 private-account compiler/oracle jobs—one per adapter. Reports compare wall time, peak RSS, source size, and readability proxies across revisions.

## Limitations

The 48-category catalog describes applicability; it is not 48 universal test engines. Tiny-model training proves mechanics, not useful general coding ability. External provider protocols are mocked in tests. Installers are unsigned; local unlocked plaintext trusts the OS. No public multi-user host or automatic proof of Big-O complexity is claimed.
