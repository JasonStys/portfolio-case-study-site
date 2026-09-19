# Site-quality report

## Functional acceptance

- Overview communicates engineering focus and exposes six featured cases.
- Project index renders all 20 entries before JavaScript enhancement.
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
- Automated axe WCAG A/AA checks in the populated overview state.

## SEO and sharing acceptance

- Unique page titles and descriptions.
- Absolute canonical URLs under the repository Pages base.
- `ProfilePage` on overview and `SoftwareSourceCode` on case-study pages.
- Open Graph and Twitter metadata.
- RSS, sitemap, and permissive robots policy.

## Release-candidate status

- Production build generated 10 HTML routes plus RSS, sitemap, robots, and search artifacts.
- Chromium and WebKit each passed five production-flow tests locally.
- The populated overview produced zero axe violations for the configured WCAG A/AA rules.
- The 390-pixel mobile flow passed horizontal-overflow and reading-order assertions.
- JavaScript, CSS, HTML, and search artifacts passed their static size budgets with at least 38% headroom.
- Formatting, linting, types, content schemas, link validation, metadata freshness, and the dependency audit passed.

A release is complete only when the GitHub-hosted Firefox and Lighthouse jobs, Pages deployment, CodeQL scan, and post-deploy smoke flow are green for the same commit.
