---
title: "Measured C# coverage without losing target exits"
repository: "https://github.com/JasonStys/code-flow-studio"
summary: "Code Flow Studio 0.4.3 separates C# target exits from collector status, measures approved nonzero returns and retains source-bound diagnostics, coverage and private history."
role: "AI developer tools and full-stack engineering"
languages: ["Python", "TypeScript", "C#", "SQL", "Dockerfile"]
evidence:
  - "Measured approved C# exits"
  - "419 tests and 28 subtests"
  - "Three collector faults blocked"
  - "Twelve isolated compiler adapters"
featuredOrder: 1
---

## Problem

An application can correctly reject malformed input with exit 2 and still deserve a usable coverage report. Coverlet 8.0.1 maps positive target exits to its own failure code, losing the distinction between the tested program and the collector. Code Flow Studio 0.4.2 honestly retained partial C# coverage when that distinction was unavailable. Version 0.4.3 fixes the measurement protocol while preserving real failures and the existing isolation boundary.

A diagnostic is useful only when a developer can inspect the source that produced it. File names and line numbers alone can point to a subsequently edited draft, a generated harness or a different auxiliary file. Code Flow Studio's independent successor to an earlier Python team capstone already supported bounded polyglot compilation, tests, fuzzing, coverage and unused-code candidates. Version 0.4.0 added the next practical step: filter a finding, verify its exact retained source, inspect the referenced line and navigate to a draft only when its content still matches.

## Constraints

Submitted programs must remain inside restricted workers, with no host-execution fallback. Coverage, unused-code candidates and proven correctness are different kinds of evidence. A reference must bind to the original UTF-8 bytes, physical line and source/generated artifact identity. Missing hashes, binary fixtures, malformed references and changed drafts must fail visibly. Private source/history and provider secrets must stay outside the repository; remote AI transmission requires explicit consent.

## C# coverage: measured approved nonzero exits

The worker gives Coverlet a trusted isolated Python bridge as its fixed target. The bridge verifies bounded stdin and the source/case/input binding, starts only the job's fixed .NET assembly, waits for the actual child to finish and exclusively publishes a fresh exit observation before returning success to the collector. It inherits the existing process group and deadline. It does not infer a target return from collector exit 1 or error-message text.

The controller records `target_exit_code` separately from `collector_exit_code`. It accepts measured coverage only when the collector completes successfully, the fresh observation passes validation, genuine source-bound coverage XML is present and the actual target return matches the independently approved case. Missing, inconsistent, truncated or timed-out evidence cannot become a passing measurement. See the immutable [C# coverage protocol](https://github.com/JasonStys/code-flow-studio/blob/1d0b19ed589947ae45e93555d97331c95cad26cc/docs/csharp-coverage.md).

| Hosted case                                               | Actual target exit          | Collector exit  | Coverage            |
| --------------------------------------------------------- | --------------------------- | --------------- | ------------------- |
| Approved success                                          | 0                           | 0               | measured            |
| Approved nonzero returns                                  | 1, 2, 7, 255                | 0 for each case | measured            |
| Approved malformed input                                  | 2                           | 0               | measured            |
| Target returns 7 when 2 was approved                      | 7                           | 0               | partial; case fails |
| Collector rejects an invalid option                       | No valid target observation | 0               | blocked             |
| Collector cannot write its report after target completion | 0                           | 101             | blocked             |
| Collector deadline expires                                | No valid target observation | -9 / timeout    | blocked             |

These are real .NET/Coverlet controls in a GitHub-hosted isolated worker. The argument rejection is particularly useful: this pinned collector can return zero without starting its target, so exit zero alone cannot prove successful collection. An authored unhandled exception also remains a failed case. The [coverage fix checkpoint](https://github.com/JasonStys/code-flow-studio/blob/1d0b19ed589947ae45e93555d97331c95cad26cc/docs/reports/csharp-coverage-2026-11-10.md) preserves the original failed acceptance assertion, its corrected independent oracle and the earlier 410-test fix checkpoint rather than rewriting that history as the later release result.

## Measured result

### 0.4.3 validation and release

The published [0.4.3 downloads and checksums](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.4.3) identify [source `1d0b19ed589947ae45e93555d97331c95cad26cc`](https://github.com/JasonStys/code-flow-studio/tree/1d0b19ed589947ae45e93555d97331c95cad26cc). The following observations apply to that released source:

- **419 tests and 28 subtests** passed in [full source validation](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062261). **85.01% controller/training coverage** passed the unchanged 80% floor; this is not worker-source coverage.
- Both [70-scenario compiler lanes](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062235) passed: twelve language adapters, independently approved outputs, wrong-oracle/compiler/runtime controls, exact unused/uncovered anchors and private-account API execution. Twelve complete reports per lane survived seal/logout/login/unlock/export replay. The pinned published 0.4.2 lane retains its historical C# partial state; the current lane requires measured approved C# exits.
- [Native packages](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062323), [CodeQL](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062291) and all five [release workflow jobs](https://github.com/JasonStys/code-flow-studio/actions/runs/42892088142) passed. All three processed full-main CodeQL categories had zero open alerts. Actual compiled Windows, Linux and macOS journeys verify bundled bridge/analyzer bytes, source identity and real application behavior.
- [Tag validation](https://github.com/JasonStys/code-flow-studio/actions/runs/42894070479), [tag compiler acceptance](https://github.com/JasonStys/code-flow-studio/actions/runs/42894070441) and [tag native packages](https://github.com/JasonStys/code-flow-studio/actions/runs/42894070586) also passed: eight source/release/tag workflow runs and **24 successful jobs** in total.
- The independently downloaded Windows installer passed a real per-user 0.4.2-to-0.4.3 upgrade and an installed-app native journey using disposable accounts. File/schema preservation and the Desktop shortcut were checked separately from hosted compiler execution. This does not establish replay of real pre-existing credentials or an upgrade of a populated vault; three-OS native journeys are distinct from three OS installation transactions.

The release gate now requires successful compiler acceptance, validation, native packages and all full-main CodeQL categories for the exact source. Independent negative response mutations block draft creation or final verification when compiler evidence is missing, failed, active, PR-only or belongs to another source/path/repository. Builds remain drafts until independent acceptance; six payloads and six checksum sidecars are bound to their published source and provider digests.

Measured coverage means complete instrumentation for the approved cases, not 100% line/branch coverage or proof of correctness. Same-UID worker programs can interfere with job files; bindings detect stale/inconsistent evidence and are not hostile-target tamper-proof attestation. Local compilation requires a working isolated engine and the matching `code-flow-worker:0.4.3` image. The PC upgrade did not repair, rebuild or otherwise change Docker. Packages remain unsigned.

## Design

A TypeScript editor and Python controller retain versioned project/results in account-scoped SQL history. Twelve documented CLI adapters use network-disabled, unprivileged Linux workers with a read-only root, bounded CPU/memory/processes and one read-only project input. Coverage collection runs separately from baseline timing and memory measurements. Supported tool denominators and unknown states remain explicit.

The evidence view adds bounded file/category filters and clickable diagnostic/missed-line references. An inspector validates an exact SHA-256, one-based line bounds and explicit manifest/artifact identity before displaying an immutable read-only snapshot. It handles UTF-8, CR/LF/CRLF and Unicode without silently normalizing the fingerprint. Generated tests/harnesses are separate from similarly named project files; unknown legacy references never acquire guessed links.

Developers can browse nearby snapshot lines and open a matching editable draft. A second check after asynchronous hashing prevents a changed draft from being overwritten or misidentified. The editable Monaco integration also fixes reproduced rapid-typing data loss. Read-only inspection uses a native text area with exact selected-line offsets, avoiding additional Monaco editor/model lifecycles. Inspection views are released on close.

Private local accounts use a separate vault phrase and encrypted locked archives. The trusted local service receives the derived key while unlocked; source can exist as temporary plaintext on that device. No public hostile-code service, zero-knowledge hosting or protection against a compromised OS is implied. Worker secrets and private accounts are not published with the source. The worker image uses a matching modern Clang/ASan runtime and a required benign-startup plus deliberate-memory-error control without disabling ASLR, sanitizers or container restrictions.

## Verification

Local controller, account, source-binding and browser tests distinguish real analysis from UI-only coverage fixtures. Independent hash/physical-line oracles cover all twelve language manifests without pretending to run twelve compilers in a browser test. Real static review locates an auxiliary Python file, opens its retained source, preserves rapid edits and refuses a stale draft. Wrong hashes, out-of-range lines, generated artifacts, binary fixtures and legacy references have explicit cases. Each browser engine repeats 32 source/generated inspection open/close cycles.

The actual Windows packaged app and bundled frozen service exercise real registration, WebCrypto key derivation, revision/history, static review, source inspection, catalog and lock. Native account helpers now require the actual unlock HTTP 200 and session proof before the unchanged render assertion. A held genuine response verifies the UI remains locked/busy until acceptance; this uses no sleeps or blind retries. The 60-second native journey remains unchanged. This corrects an incomplete completion check; an earlier hosted Windows delay is not assigned a speculative cause.

Accepted-source evidence: [source validation report](https://github.com/JasonStys/code-flow-studio/blob/08e4194707fb0ab20b469e335ef9e081a34200d3/docs/reports/practical-workflows-2026-11-09.md), [hosted validation](https://github.com/JasonStys/code-flow-studio/actions/runs/42726748363), [real isolated-worker acceptance](https://github.com/JasonStys/code-flow-studio/actions/runs/42726748363/job/129534214045), [verified native release build](https://github.com/JasonStys/code-flow-studio/actions/runs/42727706376).

## Earlier 0.4.2 native reliability

The subsequent review added Python, JavaScript/TypeScript and Actions CodeQL analysis. Actual full-main scans exposed an ambiguous demo-contract regex and unbounded worker-report reads; subsequent PR analysis found Actions checkout-reference mistakes. The corrected regex uses disjoint alternatives; worker reports use one regular-file descriptor and an eight-MiB actual-read limit. The distributed worker and native package carry matching version metadata, with exact source and worker hashes checked before release uploads.

A later real Windows native check reached the shutdown response but left its Python service running. Investigation reproduced Uvicorn's unlimited pre-lifespan wait with both a held handler and a partial request body. The fix gives HTTP work a five-second drain budget, then cancels and joins the owned HTTP tasks before normal lifespan cleanup. Real local file, vault and provider-state transitions retain ownership until their underlying work completes, even if their HTTP task receives repeated cancellation. Existing workspace locks remain held through those transitions. This protects sealing and state consistency; a critical local operation can outlive the HTTP budget, so five seconds is not a universal process-exit guarantee.

The [native drain investigation and validation](https://github.com/JasonStys/code-flow-studio/blob/7d2158a57bb49e8f837fffbfe23b301902465412/docs/reports/native-http-drain-2026-11-10.md) records the reproduced mechanism and the remaining limit: the particular held connection from the original failed hosted run was not identified. The unchanged 60-second native journey now requires actual HTTP-drain, workspace-sealing and service/thread/main milestones, plus disappearance of the owned service processes. It does not accept an Electron window closing as proof that the backend exited.

## Earlier native reliability measurements

The earlier native-runtime evidence remains separate from both 0.4.3 and the original 0.4.0 baseline:

- **265 Python tests and 28 subtests** passed at the [runtime-fix source](https://github.com/JasonStys/code-flow-studio/tree/7d2158a57bb49e8f837fffbfe23b301902465412), with **85.12%** measured coverage and the unchanged 80% minimum. The later documentation integration adds separate Office-publication checks.
- **48 web checks and 18 private account journeys** passed across Chromium, Firefox and WebKit. Pure source-binding checks remain separate from actual compiler acceptance.
- [Source validation](https://github.com/JasonStys/code-flow-studio/actions/runs/42823802584), [three-platform SDK and compiled native acceptance](https://github.com/JasonStys/code-flow-studio/actions/runs/42823802633) and [full-main CodeQL](https://github.com/JasonStys/code-flow-studio/actions/runs/42823802503) passed at that same runtime source. The three processed CodeQL categories reported zero findings and no analysis errors; positive rule counts and actual extraction were inspected separately from the green workflow result.

The subsequent 0.4.1 candidate passed all three compiled platform builds, then stopped at the final draft-metadata lookup. That verifier had content-read permission, which does not provide GitHub's required push access for draft visibility. The [release visibility correction](https://github.com/JasonStys/code-flow-studio/blob/eb9b1cd0c3e3fd1e70e397edeffb059073464f74/docs/reports/draft-release-visibility-2026-11-10.md) gives only that main-only manual job the needed permission, preserves the verifier's read-only operations, and tests actual workflow scope, comment and duplicate-block mutations. The original command wrapper did not retain an HTTP status, so none is inferred. Version 0.4.2 uses fresh source-bound builds; the unpublished candidate's assets remain unchanged. The report records the separate 286-test local source gate and its limits.

## Earlier 0.4.0 measurements

These measurements describe the linked earlier source and release, rather than the later runtime or documentation integration:

- **155 local controller tests** passed, with **84.48%** controller/training-dataset line coverage and the existing 80% minimum retained. This denominator does not include native worker integration.
- **48 web checks** passed across Chromium, Firefox and WebKit: 30 actual browser journeys and 18 repeated pure source-binding checks. The latter are not compiler acceptance results.
- **12 private account journeys** passed across those engines after the unlock-proof correction. The inspector stress case performs **32 open/close cycles per engine**, without adding editor models for the read-only view.
- The actual existing **Windows 0.4.0 packaged executable** passed the full native journey in **7.8 seconds**; its observed unlock HTTP/session proof took **171 ms**. This is one local observation, not a latency guarantee or reproduction of the earlier hosted delay.
- TypeScript/Vite, 70 exact source maps and release contracts passed locally. Separate locked desktop and worker JavaScript dependency graphs were audited; the separate hosted worker/compiler and three-platform native gates also passed at this accepted source, as linked above.

Historical downloads: [0.4.2 downloads and checksums](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.4.2). The [earlier 0.4.0 release](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.4.0) retains its original assets. The current download catalog selects 0.4.3 with its exact source, passing checks, release build and checksums; historical results above retain their own revision.

## Limitations

Hashes bind a snapshot, not trusted attestation against a malicious target sharing an unprivileged worker identity. These are bounded flat CLI adapters, not every language framework/dependency/architecture. Coverage does not prove correctness or a bug's root cause. Unused candidates are not automatically deleted. Missing/unloaded coverage stays unknown; Bash, SQL, assembly and other native collectors have different denominators and location precision.

The 48-category catalog describes applicability rather than 48 universal engines. UI coverage fixtures are distinct from real instrumented collectors. Local worker/Docker execution was unavailable for this update; there was no host fallback or Docker repair. A native Firefox crash was reproduced during investigation, but no JavaScript/OS root cause was proven; diagnostic logs and unchanged fail gates were retained. The large Monaco bundle warning remains. Local unlocked data trusts the OS. There is no certified public multi-tenant sandbox, universal code generator, signed installer guarantee or native mobile installer. The linked exact-source hosted and three-platform package gates passed before publication; these checks do not certify every input or operating environment.
