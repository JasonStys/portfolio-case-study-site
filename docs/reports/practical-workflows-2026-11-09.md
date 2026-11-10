# Practical portfolio workflows — 2026-11-09

## Scope and result

The review improved the 66 domain repositories in the approved 67-project
portfolio, then updated this hub. Older projects outside the approved list were
excluded. All 66 accepted main commits passed their 129 required main-push
workflows. Reviewed and merged trees, committed report paths and freshly fetched
main references were checked before collecting public evidence.

The [public evidence snapshot](../../src/data/project-upgrades.json) contains
the exact source, review, report and workflow links, plus project-specific
limitations. Every project has a static detail page explaining its purpose,
practical changes and rationale. The [updates index](https://jasonstys.github.io/portfolio-case-study-site/updates/)
retains the complete curated order. Six featured and nine reference case studies
were refreshed; their original URLs remain available.

The hub's checks and deployment are separate from domain acceptance. This report
records local portfolio validation; its publication must also pass the existing
PR/main workflows and Pages deployment. It does not manufacture a self-referential
commit hash or infer a site outcome from another repository's results.

## Practical changes

- Integrated apps gained source inspection, unit-aware search, authorized export
  bundles, private evidence comparison, dataset review and coherent support
  snapshots. Reference systems retain their explicit authentication boundaries.
- Security and operations labs gained owner work queues, revision-bound reviews,
  reproducible comparisons, evidence minimization and visible coverage gaps.
- Space, energy and drone simulations gained contingency planning, episode and
  continuity analysis, uncertainty accounting and bounded replay inspection.
  Their educational models do not become operational control or authorization.
- This hub makes those improvements discoverable through 67 static project
  pages and an updates index without enlarging the client search payload.

Five applications have current native releases: Workbench 1.4.0, Drone Operations
0.3.0, Code Flow 0.4.0, Applicant Evidence 0.3.0 and Image Model 0.3.0. Their
project cases/repositories distinguish actual native acceptance, installation,
source-only updates and historical downloads. Old binaries elsewhere are not
presented as containing new features. Packages remain unsigned; checksums identify
bytes rather than publisher identity.

## Defects found and corrected in the hub

1. Sentence-final words were indexed with trailing dots. An isolated
   `Inspect cached drafts.` fixture and the actual `matching drafts` Code Flow
   query reproduce the failure. Terminal dots are now removed while `.NET`,
   `C++`, `C#` and internal version dots are preserved. A tokenizer semantic
   revision participates in cache identity, invalidating the old catalog-only
   identity even without a wire-schema change.
2. Existing mobile navigation clipped links in a horizontally scrolling row.
   All six links now remain visible within two rows at 320 and 390 pixels, with
   independent element geometry and keyboard activation checks.
3. Browser preview reuse and Lighthouse HTTP polling could validate an unrelated
   listener. Both now use an owned production-build socket; binding must succeed
   before readiness. An occupied listener remains untouched and receives no HTTP
   probe. Literal traversal, realpath escape, host/method checks, GET/HEAD, MIME,
   real 404s and bounded stalled-response failure are exercised independently.
4. Validation-tool dependencies contained known advisories. Scoped minimatch and
   fast-uri patches and a compatible Puppeteer refresh produce a clean full npm
   audit. No advisory, browser engine, security control or budget was suppressed.

## Executed local validation

Environment: Windows x64, Node 24.18.1, the exact npm lock, Playwright 1.64.1 and
its Chromium, Firefox and WebKit builds. Test stores, browser contexts, listeners
and screenshots were isolated from real application accounts.

| Check                           | Recorded result                                                              |
| ------------------------------- | ---------------------------------------------------------------------------- |
| Unit tests                      | 84 passed; no skipped core cases                                             |
| Library coverage                | 188/189 lines (99.47%); 144/146 branches (98.63%); 52/52 functions           |
| Browser acceptance              | 15 scenarios × 3 engines = 45 passed; zero retries                           |
| Static output                   | 89 HTML routes; 98 generated files; all base-qualified local links valid     |
| Largest HTML                    | 52,288 B / 55,000 B                                                          |
| Total JavaScript gzip           | 1,329 B / 32,000 B                                                           |
| Total CSS gzip                  | 4,611 B / 24,000 B                                                           |
| Production search index         | 28,588 B / 100,000 B                                                         |
| Search scale                    | 10,000 synthetic projects, 500 queries; 116.778 ms build, 2.751 ms query p95 |
| Lighthouse, three real sessions | Median performance 0.97; accessibility, best practices and SEO 1.00          |
| Worst Lighthouse timing         | FCP 1,006.31 ms; LCP 1,056.61 ms; TBT 0 ms; CLS 0                            |
| Dependency audit                | Zero known findings across the installed dependency graph                    |

Browser journeys cover recruiter and specialist reading paths, exact source and
report links, all 67 static details, the separate hub state, no-script browsing,
unknown-project 404s, sitemap membership, real search/facets, URL restoration,
keyboard navigation, mobile reflow and automated WCAG checks. Outside resources
were blocked and their absence verified in the new evidence journey. Root-owned
desktop/mobile screenshots were also inspected visually.

Early exact-text test assertions mishandled decorative markers and formatted
whitespace. Their expected labels were corrected while retaining exact evidence
URLs and source values; no product failure was hidden with retries. The search
defect above was fixed in the implementation, not bypassed with a weaker query.

Formatting, lint, Astro/TypeScript diagnostics, repository contracts, README
synchronization, metadata freshness, source index and file catalog must pass the
final `npm run verify` gate before the reviewed commit is published.

## Interpretation and remaining limits

These are measured results under documented conditions, not universal latency,
correctness, security or accessibility guarantees. There is no manual screen-reader,
physical mobile-device or recruiter-comprehension study. GitHub run history can
expire or be deleted; immutable committed reports preserve source context.
The portfolio serves public static evidence, not the applications' private
services or user data. Application and simulation limits remain visible on every
project page. See [Project upgrades](../PROJECT_UPGRADES.md) for maintenance rules.
