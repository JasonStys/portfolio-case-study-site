# Code Flow Studio portfolio update — 2026-10-21

## Scope and source evidence

Updated the existing README portfolio summary, leading featured card, searchable
catalog and Code Flow case study for v0.3.0. The other 59 project outcomes, all 14
space/energy projects, six featured selections and canonical order are preserved.
No Code Flow application source, private account data, pins or stars were changed.

The case explains original file/line diagnostics, snapshot hashes, language-native
coverage, review-only unused candidates, separate baseline performance measurements
and UI/export evidence. It lists all twelve fixed CLI adapters and distinguishes
implementation languages from the languages the worker can execute. Only Code
Flow's public metadata entry was refreshed; the cache-envelope fetch timestamp
was not advanced as though every repository had been fetched again.

Previously completed Code Flow results were inspected, not rerun by this task:

- [Published v0.3.0](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.3.0),
  source `c09877827991fd20fe13d98dd5ee4c91d54e819f`.
- [Release-source validation](https://github.com/JasonStys/code-flow-studio/actions/runs/39678356525)
  and [three-OS release workflow](https://github.com/JasonStys/code-flow-studio/actions/runs/39679198552),
  both successful for that source.
- [Final validation report](https://github.com/JasonStys/code-flow-studio/blob/2d837e558420e4d7a775affdecd3dfd401eb7e7b/docs/validation-polyglot.md)
  and [native acceptance records](https://github.com/JasonStys/code-flow-studio/blob/v0.3.0/docs/evidence/polyglot-locations.json).

The recorded 148 unit tests, 40 worker scenarios, twelve account-mode adapters and
24 browser/account checks are Code Flow results, not this site's test counts.
Its 84.28% Linux statement coverage applies to controller/training.dataset, not the
entire worker integration suite. The case documents SQLite statement-start and
Bash command-entry semantics, limited C# unused rules, assembly label candidates,
unknown sources, unsigned apps and the required isolated worker. It does not
promise universal bug detection, dead-code proof or hostile-code attestation.

## Portfolio verification on Windows / Node 24.18.1

- Exact lockfile installation and dependency audit passed: **0 known vulnerabilities**
  at check time. No dependency or lockfile change was required.
- `npm run verify` passed formatting, lint, strict types, **19 unit tests**, build,
  output/schema/safety contracts, README sync and generated source/file indexes.
  Core library coverage: **98.47% statements**, **97.43% branches**, **100% functions**,
  **99.13% lines**, with all thresholds preserved.
- **30 production-browser cases passed** across Chromium, Firefox and WebKit,
  including actual Code Flow keyword filtering, navigation, immutable evidence
  URLs, release link, test counts, measurement caveats, full-case accessibility
  and 390-pixel mobile overflow checks. Existing workbench and space collection
  journeys also passed.
- Three Lighthouse samples passed unchanged budgets: performance median **0.98**;
  accessibility, best practices and SEO **1.00**; worst FCP/LCP **908.34705 ms**,
  TBT **0 ms**, CLS **0**.
- Synthetic 10,000-project / 500-query search: build **147.9149 ms**, query p95
  **2.9988 ms**; unchanged 1,500 ms / 12 ms gates. These are machine-specific samples.
- Production output: JavaScript gzip **1,305 B**, CSS gzip **4,366 B**, largest
  HTML **52,961 B**, search index **25,634 B**. No output budget was increased.
- Public metadata freshness and diff-whitespace checks passed. New evidence links
  resolve through GitHub's API. Diff review checked claim accuracy, public-only
  data, supported measurement scope, preserved ordering and unchanged runtime
  security boundaries; no new client script or external tracker was introduced.

The first restricted dependency install hit Windows EPERM; normal process
permissions completed it. Initial browser attempts could not launch because the
PC cache contained older browser revisions. Exact locked revisions were installed
in ignored `.runtime/browsers`, preserving the existing cache; the full rerun
passed without disabling browser sandbox settings. A Lighthouse preview readiness
attempt timed out during concurrent checks; a serial rerun passed all three audits.
These failed setup attempts are not represented as passing tests.

## Deployment and storage gates

The unchanged [CI and Pages workflow](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/ci.yml)
requires quality, all three browser engines and Lighthouse before Pages deployment.
[CodeQL](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/codeql.yml)
also runs on the published commit. These exact-commit remote results and a full
deployed-site browser rerun must be verified before reporting completion; the
local observations above alone do not prove a future deployment. The preceding
successful Pages source was `e113bc397d8fb3c22e31b18a13ca5c918acc7afb`;
rollback uses a normal revert and the same gates, never an unverified upload.

Actions storage was checked first at **2026-10-21 21:49 UTC** across 95 owned
repositories: **61,385,326 artifact bytes**, with **13,547,949,690 cache bytes**
under a separate allowance. Billing quota percentage was unavailable. No runs,
artifacts or caches were deleted; no billing or retention setting was changed.
Only public facts and authored text are published; runtime browser/test data stays
ignored and local. Fresh cleanup approval remains required.
