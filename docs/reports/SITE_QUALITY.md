# Site-quality report

## Functional acceptance

- Overview communicates engineering focus and exposes six featured cases.
- Project index renders all 67 entries before JavaScript enhancement.
- Drone safety collection renders all seven entries, with four evidence-led highlights and explicit simulator/privacy/authorization limits.
- Space & energy collection renders all 14 entries, with four evidence-linked specialist highlights alongside the existing six broad highlights.
- Keyword and exact role/language/domain/maturity facets preserve catalog order.
- Filter state is shareable and restorable through bounded URL parameters.
- Case studies expose problem, constraints, design, verification, result, and limitations.
- Repository, LinkedIn, RSS, sitemap, robots, manifest, favicon, social, and 404 paths are present.

## Accessibility acceptance

- Semantic landmarks, labels, heading order, lists, output announcements, and native controls.
- Skip link and visible focus.
- Keyboard-operable navigation and filtering.
- Responsive reflow without horizontal page overflow at 390 CSS pixels.
- Reduced-motion and forced-colors accommodations.
- Automated axe WCAG A/AA checks on the overview and new collection.

## SEO and sharing acceptance

- Unique page titles and descriptions.
- Absolute canonical URLs under the repository Pages base.
- `ProfilePage` on overview and `SoftwareSourceCode` on case-study pages.
- Open Graph and Twitter metadata.
- RSS, sitemap, and permissive robots policy.

## Current acceptance scope: 2026-10-22

The 67-project build has 21 HTML routes. Tests cover both complete collections,
no-script rendering, exact reviewed order, restored URL filters, accessible
content and mobile overflow. Twenty unit tests and all local static contracts
passed; browser and Lighthouse results must be checked on the exact published
revision in Actions. No threshold is relaxed to accommodate the larger catalog.

## Previous synchronization: 2026-10-21

- Production output includes 20 HTML routes and all 15 case studies in the sitemap.
- All eight production-flow tests passed in each of Chromium, Firefox and WebKit (24 total locally).
- The overview and Space & energy collection passed configured axe WCAG A/AA checks and 390-pixel overflow checks.
- All 14 collection entries and four specialist cases remain readable without JavaScript.
- The complete catalog's Space systems facet preserves the exact 14-project reviewed order.
- Metadata, README table, source-line index and file catalog have deterministic drift checks.
- Original performance gates passed; exact observed measurements and unchanged limits are in [PERFORMANCE.md](PERFORMANCE.md).
- Civilian educational scope, source-data provenance, model limitations and historical release measurements are explicit; no agency endorsement or real mission experience is implied.

These checks are automated evidence, not a claim of exhaustive accessibility,
security or real-world scientific validation. The final release also requires
same-commit CI, CodeQL, Pages deployment and deployed-site acceptance.

## Historical first-release status

- Production build generated 10 HTML routes plus RSS, sitemap, robots, and search artifacts.
- Chromium and WebKit each passed five production-flow tests locally.
- Chromium, Firefox, and WebKit each passed all five production-flow tests in GitHub Actions.
- The populated overview produced zero axe violations for the configured WCAG A/AA rules.
- The 390-pixel mobile flow passed horizontal-overflow and reading-order assertions.
- JavaScript, CSS, HTML, and search artifacts passed their static size budgets with at least 38% headroom.
- Formatting, linting, types, content schemas, link validation, metadata freshness, and the dependency audit passed.
- Three-run Lighthouse scores were 1.00 accessibility, 1.00 best practices, 0.99 performance, and 1.00 SEO; worst-run FCP was 756 ms, LCP 906 ms, TBT 0 ms, and CLS 0.00.

The final release is complete only when these checks, Pages deployment, CodeQL, and the post-deploy smoke flow are green for the same commit.
