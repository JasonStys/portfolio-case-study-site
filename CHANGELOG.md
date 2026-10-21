# Changelog

All notable changes use a simplified Keep a Changelog structure. Version numbers follow semantic versioning for the repository's public behavior and content contracts.

## [Unreleased] - 2026-10-21

### Added

- All 14 completed civilian space/energy projects in the now 60-repository catalog and README summary.
- Dedicated space/energy collection, homepage highlights, navigation, domain filtering and four evidence-linked case studies.
- Literal-AST README summary generation/check gate to prevent catalog drift.
- Browser coverage for the complete collection, no-script case access, mobile layout, accessibility and filter restoration.

### Improved

- Search schema 2 uses numeric dictionary postings and own-property lookup guards; schema/revision URLs avoid stale-schema cache reuse.
- Compact card markup preserves no-script access while retaining the original HTML, JavaScript, CSS, search and Lighthouse budgets.
- Sitemap includes all case studies and the new collection; cached public metadata refreshed after allowlist review.
- Lighthouse uses normal sandboxed Chromium instead of disabling its sandbox.

## [1.0.0] - 2026-09-19

### Added

- Static Astro portfolio with overview, project index, about page, and six engineering case studies.
- Checked-in public GitHub metadata cache and an intentional refresh command.
- Precomputed inverted search index with role, language, domain, and maturity facets.
- Responsive evidence-first design, keyboard navigation, reduced-motion support, RSS, sitemap, and structured data.
- Unit, cross-browser, accessibility, layout, performance, security, repository, and deployment quality gates.
- GitHub Pages deployment after all CI jobs pass.
