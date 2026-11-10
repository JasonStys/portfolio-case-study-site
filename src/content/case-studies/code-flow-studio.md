---
title: "From a located finding to a verified source revision"
repository: "https://github.com/JasonStys/code-flow-studio"
summary: "Code Flow Studio 0.4.0 connects polyglot diagnostics and missed coverage to verified source snapshots, guarded draft navigation, private revision evidence and isolated compiler workers."
role: "AI developer tools and full-stack engineering"
languages: ["Python", "TypeScript", "SQL", "Dockerfile"]
evidence:
  - "Content-bound source navigation"
  - "48 three-engine web checks"
  - "12 private account journeys"
  - "Actual packaged Windows journey"
featuredOrder: 1
---

## Problem

A diagnostic is useful only when a developer can inspect the source that produced it. File names and line numbers alone can point to a subsequently edited draft, a generated harness or a different auxiliary file. Code Flow Studio's independent successor to an earlier Python team capstone already supported bounded polyglot compilation, tests, fuzzing, coverage and unused-code candidates. Version 0.4.0 makes the next step practical: filter a finding, verify its exact retained source, inspect the referenced line and navigate to a draft only when its content still matches.

## Constraints

Submitted programs must remain inside restricted workers, with no host-execution fallback. Coverage, unused-code candidates and proven correctness are different kinds of evidence. A reference must bind to the original UTF-8 bytes, physical line and source/generated artifact identity. Missing hashes, binary fixtures, malformed references and changed drafts must fail visibly. Private source/history and provider secrets must stay outside the repository; remote AI transmission requires explicit consent.

## Design

A TypeScript editor and Python controller retain versioned project/results in account-scoped SQL history. Twelve documented CLI adapters use network-disabled, unprivileged Linux workers with a read-only root, bounded CPU/memory/processes and one read-only project input. Coverage collection runs separately from baseline timing and memory measurements. Supported tool denominators and unknown states remain explicit.

The evidence view adds bounded file/category filters and clickable diagnostic/missed-line references. An inspector validates an exact SHA-256, one-based line bounds and explicit manifest/artifact identity before displaying an immutable read-only snapshot. It handles UTF-8, CR/LF/CRLF and Unicode without silently normalizing the fingerprint. Generated tests/harnesses are separate from similarly named project files; unknown legacy references never acquire guessed links.

Developers can browse nearby snapshot lines and open a matching editable draft. A second check after asynchronous hashing prevents a changed draft from being overwritten or misidentified. The editable Monaco integration also fixes reproduced rapid-typing data loss. Read-only inspection uses a native text area with exact selected-line offsets, avoiding additional Monaco editor/model lifecycles. Inspection views are released on close.

Private local accounts use a separate vault phrase and encrypted locked archives. The trusted local service receives the derived key while unlocked; source can exist as temporary plaintext on that device. No public hostile-code service, zero-knowledge hosting or protection against a compromised OS is implied. Worker secrets and private accounts are not published with the source. The worker image uses a matching modern Clang/ASan runtime and a required benign-startup plus deliberate-memory-error control without disabling ASLR, sanitizers or container restrictions.

## Verification

Local controller, account, source-binding and browser tests distinguish real analysis from UI-only coverage fixtures. Independent hash/physical-line oracles cover all twelve language manifests without pretending to run twelve compilers in a browser test. Real static review locates an auxiliary Python file, opens its retained source, preserves rapid edits and refuses a stale draft. Wrong hashes, out-of-range lines, generated artifacts, binary fixtures and legacy references have explicit cases. Each browser engine repeats 32 source/generated inspection open/close cycles.

The actual Windows packaged app and bundled frozen service exercise real registration, WebCrypto key derivation, revision/history, static review, source inspection, catalog and lock. Native account helpers now require the actual unlock HTTP 200 and session proof before the unchanged render assertion. A held genuine response verifies the UI remains locked/busy until acceptance; this uses no sleeps or blind retries. The 60-second native journey remains unchanged. This corrects an incomplete completion check; an earlier hosted Windows delay is not assigned a speculative cause.

Accepted-source evidence: [source validation report](https://github.com/JasonStys/code-flow-studio/blob/08e4194707fb0ab20b469e335ef9e081a34200d3/docs/reports/practical-workflows-2026-11-09.md), [hosted validation](https://github.com/JasonStys/code-flow-studio/actions/runs/42726748363), [real isolated-worker acceptance](https://github.com/JasonStys/code-flow-studio/actions/runs/42726748363/job/129534214045), [verified native release build](https://github.com/JasonStys/code-flow-studio/actions/runs/42727706376).

## Measured result

- **155 local controller tests** passed, with **84.48%** controller/training-dataset line coverage and the existing 80% minimum retained. This denominator does not include native worker integration.
- **48 web checks** passed across Chromium, Firefox and WebKit: 30 actual browser journeys and 18 repeated pure source-binding checks. The latter are not compiler acceptance results.
- **12 private account journeys** passed across those engines after the unlock-proof correction. The inspector stress case performs **32 open/close cycles per engine**, without adding editor models for the read-only view.
- The actual existing **Windows 0.4.0 packaged executable** passed the full native journey in **7.8 seconds**; its observed unlock HTTP/session proof took **171 ms**. This is one local observation, not a latency guarantee or reproduction of the earlier hosted delay.
- TypeScript/Vite, 70 exact source maps and release contracts passed locally. Separate locked desktop and worker JavaScript dependency graphs were audited; the separate hosted worker/compiler and three-platform native gates also passed at this accepted source, as linked above.

Published downloads: [new 0.4.0 downloads and checksums](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.4.0). Older published releases remain available. All three native package builds passed before this release was published; package hashes were checked against GitHub's asset digests.

## Limitations

Hashes bind a snapshot, not trusted attestation against a malicious target sharing an unprivileged worker identity. These are bounded flat CLI adapters, not every language framework/dependency/architecture. Coverage does not prove correctness or a bug's root cause. Unused candidates are not automatically deleted. Missing/unloaded coverage stays unknown; Bash, SQL, assembly and other native collectors have different denominators and location precision.

The 48-category catalog describes applicability rather than 48 universal engines. UI coverage fixtures are distinct from real instrumented collectors. Local worker/Docker execution was unavailable for this update; there was no host fallback or Docker repair. A native Firefox crash was reproduced during investigation, but no JavaScript/OS root cause was proven; diagnostic logs and unchanged fail gates were retained. The large Monaco bundle warning remains. Local unlocked data trusts the OS. There is no certified public multi-tenant sandbox, universal code generator, signed installer guarantee or native mobile installer. The linked exact-source hosted and three-platform package gates passed before publication; these checks do not certify every input or operating environment.
