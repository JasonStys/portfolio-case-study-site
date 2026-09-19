# Portfolio Case Study Site

[![CI and Pages](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/ci.yml/badge.svg)](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/ci.yml)
[![CodeQL](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/codeql.yml/badge.svg)](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/codeql.yml)

An evidence-first engineering portfolio that helps employers evaluate the design judgment behind the code—not just scan a repository list.

**Live site:** [jasonstys.github.io/portfolio-case-study-site](https://jasonstys.github.io/portfolio-case-study-site/)

![Portfolio preview](public/images/portfolio-preview.svg)

## Why this exists

A broad GitHub profile can make strong work harder to evaluate. This site creates one consistent navigation layer across software engineering, full-stack systems, AI/ML, analytics, cloud infrastructure, accessible web development, firmware, and game technology.

Six featured projects use the same employer-friendly narrative:

> problem → constraints → design → verification → measured result → limitations

The complete catalog remains searchable by role, language, domain, maturity, and free text.

## Sixty-second quick start

Requirements: Node.js 24 and npm 11 or newer.

```bash
git clone https://github.com/JasonStys/portfolio-case-study-site.git
cd portfolio-case-study-site
npm ci
npm run dev
```

Open `http://localhost:4321/portfolio-case-study-site/`.

For a release-equivalent local build:

```bash
npm run verify
npm run test:e2e
npm run lighthouse
```

## Major features

### Evidence-led overview

The home page explains how to evaluate the portfolio, shows derived breadth metrics, and presents six role-spanning case studies rather than a decorative résumé layout.

### Schema-validated case studies

Astro's content collection validates titles, repository URLs, summaries, languages, evidence lists, and featured order at build time. A malformed case cannot deploy.

### Reproducible repository metadata

`src/data/github-repositories.json` is a reviewed cache of public GitHub facts. Production builds never depend on GitHub availability. `npm run metadata:refresh` updates the cache intentionally; `npm run metadata:check` enforces freshness without network access.

### Precomputed search

`search-index.json` is generated during the static build. The browser downloads a versioned inverted index and performs deterministic intersections for keywords and exact facets. All project cards remain readable when JavaScript is unavailable.

### Accessible, resilient presentation

- Semantic landmarks, headings, labels, lists, and native controls.
- Skip navigation, visible focus, keyboard workflows, and live result counts.
- Minimum interactive target sizing and responsive single-column flow.
- Reduced-motion and forced-colors accommodations.
- Text alternatives for the architecture diagram and visible data instead of canvas-only charts.

### Discoverability and delivery

- Canonical metadata, Open Graph/Twitter cards, `ProfilePage` and `SoftwareSourceCode` JSON-LD.
- RSS project feed, sitemap, robots policy, manifest, favicon, and custom 404 page.
- GitHub Pages deployment only after quality, browser, and Lighthouse jobs pass.
- Exact dependency lock, reviewed install scripts, Dependabot, dependency review, CodeQL, and SHA-pinned Actions.

## Architecture

```text
Reviewed Markdown ─┐
                   ├─> schema validation ─> Astro static build ─> GitHub Pages
GitHub JSON cache ─┘                         ├─ HTML case studies
                                            ├─ search-index.json
                                            ├─ RSS + sitemap
                                            └─ versioned assets
```

The public site has no server, database, authentication, tracking script, or runtime GitHub API dependency. See [Architecture](docs/ARCHITECTURE.md) and [ADR-0001](docs/adrs/0001-static-astro.md) for alternatives and tradeoffs.

## Search behavior and complexity

Let `n` be projects, `t` unique indexed tokens, `q` query tokens, and `m` the current candidate set.

- Index construction: expected `O(total indexed tokens)` time and `O(total postings)` space.
- Query tokenization: `O(query length)`.
- Ordered posting intersections: `O(q × n)` in this small, deterministic implementation.
- Exact facets: one additional ordered intersection per selected facet.

The catalog is intentionally small, so predictable code is more valuable than compression or ranked retrieval. A synthetic 10,000-project benchmark protects the chosen implementation from accidental quadratic work inside index construction. See [Complexity](docs/COMPLEXITY.md) and [Performance report](docs/reports/PERFORMANCE.md).

## Testing and validation

| Layer            | Evidence                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| Content contract | Astro/Zod collection schema and catalog/cache validation                        |
| Unit             | Tokenization, postings, intersections, facets, URLs, XML, cache failure cases   |
| Browser          | Recruiter journey, filtering, URL restoration, keyboard flow, mobile layout     |
| Accessibility    | axe WCAG A/AA rules plus manual-contract assertions                             |
| Performance      | 10,000-project search benchmark, compressed asset budgets, three-run Lighthouse |
| Build            | Required routes, base-path links, discovery artifacts, metadata, static output  |
| Security         | npm audit, dependency review, CodeQL, header/action/secret/content validators   |
| Deployment       | Pages artifact is published only after all required CI jobs succeed             |

Coverage thresholds are enforced at 92% statements, functions, and lines and 88% branches for the core TypeScript library. Exact release results live in [Test summary](docs/reports/TEST_SUMMARY.md) and [Site quality](docs/reports/SITE_QUALITY.md).

## Repository structure

| Path              | Purpose                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| `.github/`        | Least-privilege CI, Pages, CodeQL, dependency review, and update policy.         |
| `src/components/` | Shared Astro layout, navigation, project, metric, and diagram components.        |
| `src/content/`    | Six schema-validated Markdown engineering case studies.                          |
| `src/data/`       | Reviewed public GitHub cache and employer-facing curation.                       |
| `src/lib/`        | Catalog validation, inverted search, URLs, XML, and domain types.                |
| `src/pages/`      | Static overview, catalog, case routes, feeds, sitemap, robots, and 404.          |
| `src/scripts/`    | The only browser-delivered TypeScript enhancement: catalog filtering.            |
| `src/styles/`     | Complete responsive visual system and accessibility preference support.          |
| `tests/`          | Unit, browser, accessibility, navigation, and layout checks.                     |
| `scripts/`        | Metadata refresh, benchmarks, validators, indexes, and Lighthouse orchestration. |
| `docs/`           | Architecture, ADR, operations, testing, security, reports, and exact indexes.    |
| `public/`         | Favicon, manifest, and social preview artwork.                                   |

Every authored file is summarized in the generated [File catalog](docs/FILE_CATALOG.md). Every code declaration is mapped to an exact one-based line in [Code index](docs/CODE_INDEX.md).

## Documentation index

- [Architecture](docs/ARCHITECTURE.md)
- [Architecture decision](docs/adrs/0001-static-astro.md)
- [Complexity](docs/COMPLEXITY.md)
- [Content maintenance](docs/CONTENT_GUIDE.md)
- [Testing strategy](docs/TESTING.md)
- [Security model](docs/SECURITY.md)
- [Operations and metadata refresh](docs/OPERATIONS.md)
- [Deployment and rollback checklist](docs/DEPLOYMENT_CHECKLIST.md)
- [Known limitations](docs/LIMITATIONS.md)
- [Research notes](docs/RESEARCH.md)
- [Test summary](docs/reports/TEST_SUMMARY.md)
- [Performance report](docs/reports/PERFORMANCE.md)
- [Site-quality report](docs/reports/SITE_QUALITY.md)

## Privacy and safety

Only public repository facts and deliberately authored portfolio content are committed. The site contains no visitor analytics, remote fonts, contact form, cookies, credentials, private repository names, customer data, or employer source code. Résumé PDFs are not copied automatically because public release should follow a separate personal-information review.

## Limitations

- GitHub facts are snapshots and can be stale until the explicit refresh command runs.
- Automated accessibility checks do not replace evaluation with assistive-technology users.
- Case studies summarize checked-in evidence but do not claim commercial production usage.
- GitHub Pages provides static hosting; contact, authentication, and dynamic personalization are out of scope.
- The social preview is SVG-first. Some social crawlers may prefer a raster asset in a future custom-domain release.

## License

Source code is available under the [MIT License](LICENSE). Project descriptions and personal profile content remain attributable to Jason Stys.
