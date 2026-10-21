---
title: "Polyglot AI development with verifiable revisions"
repository: "https://github.com/JasonStys/code-flow-studio"
summary: "Code Flow Studio v0.3.0 connects a typed editor and isolated CLI workers with original file/line diagnostics, language-specific coverage, unused-code review, and encrypted revision evidence."
role: "AI developer tools and full-stack engineering"
languages: ["Python", "TypeScript", "SQL", "Dockerfile"]
evidence:
  [
    "12 source-located CLI adapters",
    "Native coverage + unused candidates",
    "40 isolated worker scenarios",
    "Three-OS packaged launch checks",
  ]
featuredOrder: 1
---

## Problem

Developers need to distinguish plausible generated code from code that has actually compiled and passed relevant checks—and locate the source behind a finding. The earlier time-limited team capstone covered Python; this independent successor adds a polyglot workflow without claiming universal test generation. Version 0.3.0 extends source locations, real coverage and unused-code review to all eleven non-Python adapters while retaining Python support.

## Constraints

Submitted source must not execute directly on the host. Providers need explicit consent. Locations must refer to the analyzed revision, not a subsequently edited file. Missing toolchains, unloaded sources, partial results and unavailable measurements must remain visible. Timing and peak-memory samples must not be contaminated by added coverage instrumentation.

## Design

A TypeScript editor calls a Python controller that records versioned results in SQL. Fixed CLI adapters run only inside restricted, network-disabled Linux workers: Python, JavaScript, TypeScript, C, C++, Java, C#, Rust, PHP, Bash, SQLite SQL and GNU x86-64 assembly. Approved oracles and harnesses exercise bounded fuzz cases. Provider routing is configurable; private local accounts encrypt source/history with a separate browser-derived vault key.

Compiler/runtime references and native unused-code candidates retain original file and one-based line locations, tool columns/rules when available, and source hashes. The controller validates paths, ranges and hashes against the submitted snapshot before displaying findings. UI and HTML/JSON/ZIP exports expose per-file missed/executed lines, tool-specific branch evidence and explicit partial, blocked or not-measured states. Wrong answers without a genuine source reference remain unlocated; unused candidates require review and never trigger automatic deletion.

Native collectors include V8/TypeScript source maps, GCC/gcov, Rust/LLVM, JaCoCo, Coverlet, Xdebug, Bash command traces, SQLite statement anchors and DWARF/Callgrind. Baseline timing/RSS runs precede separate instrumented reruns. Read the [v0.3.0 measurement contracts](https://github.com/JasonStys/code-flow-studio/blob/v0.3.0/docs/polyglot-locations.md) for each denominator and supported rule set.

## Verification

Controller, account, cryptographic, provider and history regressions accompany independently authored native location oracles for every non-Python adapter. Imported JS/TS helper cases check original-source mapping; unloaded modules remain unknown. Malformed reports, source binding, Unicode source boundaries, escaped downloads and bounded parsers have explicit regressions.

The [verified v0.3.0 validation report](https://github.com/JasonStys/code-flow-studio/blob/2d837e558420e4d7a775affdecd3dfd401eb7e7b/docs/validation-polyglot.md) separates unit/mock checks from actual compiler/instrumentation evidence. Inspect [native acceptance records](https://github.com/JasonStys/code-flow-studio/blob/v0.3.0/docs/evidence/polyglot-locations.json), the [release-source validation run](https://github.com/JasonStys/code-flow-studio/actions/runs/39678356525) and the [three-OS release workflow](https://github.com/JasonStys/code-flow-studio/actions/runs/39679198552). This portfolio update cites those completed results; it does not rerun Code Flow's compiler tests.

## Measured result

- **148 unit tests** passed on Windows and Linux. Linux controller/training.dataset statement coverage was **84.28%**, above the retained 80% gate; native worker integration is outside that denominator.
- **40 isolated-worker scenarios** passed, covering all twelve baseline adapters, eleven native unused/missed-line oracles, JS/TS multi-file mapping, actual fuzzing and isolation probes. All twelve private-account adapter/history checks also passed.
- **24 browser/account checks** passed: 18 browser tests across Chromium, Firefox and WebKit plus six private-account journeys.
- Actual packaged Electron app and bundled-service launches passed on **Windows, macOS and Linux** before publication. Revision reports retain wall time, peak RSS, source size and readability proxies rather than pretending to prove Big-O complexity.

The [published v0.3.0 release](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.3.0) provides platform-specific downloads and SHA-256 records. They are unsigned development builds. Native checks require the separately built `code-flow-worker:0.2.0` image on a working, authorized Docker engine; there is no host-execution fallback.

## Limitations

Coverage metrics are not interchangeable: Bash measures command entries, SQLite measures completed top-level statement-start lines, and assembly measures debug-mapped instruction lines. A SQL error points to its statement start, not necessarily the failing token. C# unused checks cover selected locals/private fields, not general unused methods; assembly labels are review-only candidates, not unused-instruction proof. Missing/unloaded sources remain unknown. No universal bug detection, dead-code proof or complete branch coverage is claimed.

These are bounded flat CLI adapters, not every framework, dependency or architecture. Targets and tools share an unprivileged worker identity: hashes bind a snapshot, not trusted attestation against malicious targets. This is not a public hostile-code service. The 48-category catalog describes applicability, not 48 universal test engines. Tiny-model training proves mechanics, not general coding ability; external AI provider protocols are mocked. Local unlocked plaintext trusts the OS; no public multi-user host or native mobile installer is supplied.
