# Test summary

## Scope

The release gate covers catalog/cache contracts, search behavior, URL/XML helpers, schema-validated content, cross-browser recruiter flows, filtering and URL state, keyboard navigation, WCAG rules, mobile layout, discovery artifacts, production links, static budgets, search scale, Lighthouse, dependency audit, and semantic security scanning.

## Acceptance targets

| Evidence         | Target                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Unit tests       | All pass; no skipped core cases.                                        |
| Coverage         | ≥92% statements/functions/lines; ≥88% branches in `src/lib`.            |
| Browser          | Chromium, Firefox, and WebKit production flows pass.                    |
| Accessibility    | No detectable WCAG A/AA violations in tested states.                    |
| Search benchmark | 10,000-project build ≤1,500 ms; p95 query ≤12 ms; artifact ≤12 MiB.     |
| Static assets    | JS ≤32 KiB gzip; CSS ≤24 KiB gzip; search index ≤100 KiB.               |
| Lighthouse       | Accessibility 1.00; performance ≥0.92; best practices ≥0.95; SEO ≥0.95. |
| Security         | Zero high/critical npm findings and zero unresolved CodeQL findings.    |

## Current synchronization: 2026-10-21

The catalog contains 60 ordered projects, six broad featured cases and nine
reference cases. All 14 Space & energy projects have exact subset/order tests;
four have new evidence-linked case studies. Local verification passed formatting,
lint, types/content schemas (zero diagnostics), README synchronization, generated
indexes, metadata freshness, all 17 unit tests, build/link/repository contracts,
original byte/search budgets, and the dependency audit (zero known findings).

Coverage: 98.46% statements (128/130), 97.43% branches (76/78), 100% functions
(35/35), 99.13% lines (114/115). No coverage threshold was lowered.
All 24 browser tests passed across Chromium, Firefox and WebKit, including the
14-project collection, four case studies without JavaScript, exact filtering,
URL restoration, keyboard navigation, axe WCAG checks and 390-pixel reflow.
Three local Lighthouse runs also passed with the browser sandbox enabled.

The source projects' 42 latest exact-main workflow results and 14 published
releases were inspected read-only; those projects were not re-executed or
recertified by this documentation update. See
[the synchronization evidence](portfolio-sync-2026-10-21.md) for source links.
Independent CI, CodeQL and Pages results are attached to the exact published
commit in [Actions](https://github.com/JasonStys/portfolio-case-study-site/actions).
Post-deployment checks must target that same published build.

## Historical release results

Earlier portfolio synchronization (2026-10-14): 46 ordered projects, six featured
and five reference cases. Local strict lint/type/content checks passed; 14 unit
tests passed, 99.18% statements, 97.36% branches, 100% functions, 99.09% lines.
All original search and byte budgets passed for 15 HTML routes and 90 authored
text files; npm audit found zero known vulnerabilities. Complete native browser,
Lighthouse, and deployment evidence is recorded in the exact candidate/main
[Actions runs](https://github.com/JasonStys/portfolio-case-study-site/actions).
The results below are retained first-release history.

Measured on Node.js 24.18.1 on 2026-09-19:

| Gate                        | Result                                                                   |
| --------------------------- | ------------------------------------------------------------------------ |
| Static analysis             | ESLint and Astro type/content checks passed with zero diagnostics.       |
| Unit tests                  | 12/12 passed across three files.                                         |
| Coverage                    | 99.10% statements, 97.10% branches, 100% functions, 99.00% lines.        |
| Chromium browser flow       | 5/5 passed, including axe WCAG A/AA analysis.                            |
| WebKit browser flow         | 5/5 passed, including axe WCAG A/AA analysis.                            |
| Firefox browser flow        | 5/5 passed in GitHub Actions on Ubuntu.                                  |
| Search benchmark            | All budgets passed; exact figures are in `PERFORMANCE.md`.               |
| Build and repository checks | 10 HTML routes and 82 authored text files passed their contracts.        |
| Dependency audit            | 0 vulnerabilities across the 501-package installed graph.                |
| Lighthouse                  | Accessibility 1.00, best practices 1.00, performance 0.99, and SEO 1.00. |

For that first release, GitHub Actions installed and executed checks independently
on Ubuntu because the local launchers were blocked. All 15 GitHub-hosted browser
tests and the three-run Lighthouse gate passed. This historical host limitation
does not describe the current local validation above.
