# Business standardization portfolio update — 2026-10-21

## Scope

Updated the existing portfolio README summary, featured card, searchable catalog,
and detailed Business Knowledge Workbench case. It remains project #2; the other
59 project entries remain unchanged. The six featured selections and their order,
profile pins and stars are preserved. This task does not modify the workbench
application or private data.

The case now leads with its primary purpose: consistent units, canonical table
fields, document structure/layout, and selected output file types. It describes
owner/admin-controlled standards, draft preview, revision publication/restoration,
preserved evidence, current-standard copies, and the local-owner boundary.
Universal OCR, arbitrary semantic understanding, hosted team membership, delegated
staff permissions and native mobile installers are explicitly not claimed.

Only the workbench's public cache entry was refreshed from GitHub. The original
cache-envelope timestamp remains intact; it is not represented as a new fetch of
every repository. The catalog's content-bound search identity handles this update.

## Inspected workbench release evidence

The public [v1.2.0 release](https://github.com/JasonStys/business-knowledge-workbench/releases/tag/v1.2.0)
targets `ae04e12310be67ca53c14b5b1df8f9801b405e9c`. These source workflows were
confirmed successful, not newly executed by this portfolio update:

- [Validation](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/39654236500).
- [CodeQL](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/39654236609).
- [Three-OS packages](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/39654236461).
- [Gated native release](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/39654875902).

The case attributes 150 Python tests, 88.82% statement coverage, 36 browser cases,
and the synthetic 500-row/189-document performance results to the published
versioned validation report. Those are not portfolio test counts or hosted SLAs.

## Completed local portfolio checks

Windows x64 / Node 24.18.1 verification passed:

- Formatting, lint, strict types, metadata freshness, schema/content safety,
  README summary synchronization and generated source/file inventories.
- **18 unit tests**: 98.47% statements, 97.43% branches, 100% functions and 99.13%
  lines; all existing coverage thresholds preserved.
- **27 production-browser cases** across Chromium, Firefox and WebKit. The new
  journey checks the featured summary, actual filtered result, case content,
  versioned evidence links and full-case accessibility. Discovery checks bind
  the requested search revision to the actual index's `generatedFrom` value.
- Three Lighthouse runs: median performance **0.98**; accessibility, best practices
  and SEO **1.00**; worst FCP/LCP **973.0434 ms**, TBT **0 ms**, CLS **0**.
- 10,000-project/500-query benchmark: build **113.8272 ms**, query p95 **3.076 ms**;
  unchanged 1,500 ms / 12 ms budgets. Machine-specific observations only.
- Production sizes: JavaScript gzip **1,305 B**, CSS gzip **4,366 B**, largest HTML
  **52,903 B**, index **25,512 B**. No size budget was raised.
- Dependency audit: **0 known vulnerabilities** at check time.

The first full-case accessibility scan found the existing small coral footer label
at a 3.35:1 contrast ratio on teal. The scoped fix uses the existing dark ink
token; no accessibility rule was suppressed. The new navigation test waits for
enhancement and the debounced query result before following a moving card link.
Failed development attempts are not counted as passed verification.

Search URL revisions now use a build-only SHA-256 of reviewed catalog content and
the metadata timestamp. A curation-only edit or ordering change therefore
invalidates cached search without inventing a metadata refresh. Unit regressions
cover stability and editorial/order/timestamp changes. This is cache identity,
not an approval signature; Node crypto does not enter the browser bundle.

## Deployment and privacy boundary

[CI and Pages](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/ci.yml)
and [CodeQL](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/codeql.yml)
remain the authoritative exact-commit remote gates. After deployment, the same
27 acceptance cases can target the live Pages URL through `PORTFOLIO_BASE_URL`.
Local results above do not by themselves prove a successful future deployment.

Only public repository facts and authored portfolio text are published. No real
account, document, credential or private test archive is included. Actions bytes
were inspected first; billing percentage was unavailable during this task.
No runs/artifacts/caches were deleted and no retention policy was changed.
