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

## Release result

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

The GitHub Actions run for the deployed commit is the authoritative release result. The Windows host blocks the downloaded Firefox and Lighthouse launchers, so GitHub installs and executes those checks independently on Ubuntu. All 15 GitHub-hosted browser tests and the three-run Lighthouse gate passed.
