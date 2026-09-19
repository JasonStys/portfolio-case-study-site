# Architecture

## Context and goals

The portfolio must help an employer move from a role requirement to inspectable engineering evidence in under two minutes. It must remain fast, accessible, inexpensive to host, reproducible when GitHub is unavailable, and safe to publish.

## High-level design

```text
                            build-time trust boundary
┌──────────────────────┐   ┌────────────────────────────┐
│ reviewed case studies├──>│ Astro content schema       │
└──────────────────────┘   │ catalog/cache validators   │
┌──────────────────────┐   │ inverted-index builder     │
│ checked-in GitHub    ├──>│ RSS/sitemap generators     │
│ metadata cache       │   └─────────────┬──────────────┘
└──────────────────────┘                 │
                                      static files
                                         │
                               ┌─────────▼─────────┐
                               │ GitHub Pages CDN  │
                               └─────────┬─────────┘
                                         │
                                  browser request
                                         │
                         ┌───────────────▼────────────────┐
                         │ semantic HTML + CSS             │
                         │ optional project-filter module  │
                         │ precomputed search-index.json   │
                         └────────────────────────────────┘
```

## Components

### Content collection

Six Markdown files share one schema. The build rejects missing evidence, invalid repository URLs, out-of-range featured order, and underspecified summaries. Markdown remains readable outside the site.

### Repository cache and curation

The cache records selected public repository facts. A separate TypeScript curation file adds role alignment, problem domains, outcome copy, maturity, and case-study routing. Separation prevents an API refresh from overwriting editorial judgment.

### Catalog builder

`catalog.ts` treats both JSON and curation as untrusted build inputs. It rejects missing strings, duplicate names, duplicate facet values, unexpected GitHub URLs, missing cache entries, featured items without case studies, and duplicate featured order.

### Search index

The static endpoint runs `buildSearchIndex` at build time. It emits deterministic project order, token postings, and exact facet postings. Browser code fetches this same-origin file, intersects postings, hides nonmatches, updates an `aria-live` result count, and persists only filter values in the URL.

### Presentation

Astro components emit semantic HTML. CSS supplies the complete visual layer without runtime style injection or remote fonts. All catalog content exists in the initial HTML so a failed script or blocked JavaScript does not remove the work.

### Discovery

The build creates canonical metadata, JSON-LD, RSS, sitemap, robots policy, manifest, favicon, social artwork, and a static 404 route. Repository base-path handling is centralized in `url.ts`.

### Delivery

CI runs quality, browser, and performance jobs independently. The deployment job requires all three and uploads the exact generated `dist/` tree through GitHub's OIDC-backed Pages actions.

## Data flow

1. A maintainer edits reviewed Markdown, curation, or refreshes cached public metadata.
2. Astro validates content and TypeScript contracts.
3. The build merges repository facts with curation and precomputes search postings.
4. Output validation resolves every repository-base link and enforces asset budgets.
5. Playwright verifies production output across Chromium, Firefox, and WebKit.
6. Lighthouse samples three fresh Chromium sessions.
7. Only a green `main` push can upload and deploy the Pages artifact.

## Failure handling

- Invalid content, duplicate identifiers, stale indexes, missing routes, broken base paths, or oversized assets fail before deployment.
- A runtime search-index failure leaves all server-rendered project cards visible and logs one bounded diagnostic.
- A failed CI matrix prevents deployment; the previous Pages artifact remains active.
- A bad published release can be reverted and redeployed using the documented rollback procedure.

## Scale and reliability

The current catalog has 20 entries. A benchmark uses 10,000 deterministic synthetic projects to expose accidental algorithmic regressions. Static hosting removes server capacity planning. The largest foreseeable constraint is content review, not request throughput.

## Tradeoffs

- A checked-in cache can become stale, but builds remain reproducible and do not fail on API rate limits.
- Ordered array intersections are simpler than compressed postings or ranked search and are appropriate at this catalog size.
- Static Pages hosting removes server features. That is intentional for version one.
- No client framework reduces JavaScript and hydration risk, but interactive features require explicit DOM code.

## What to revisit

- Add a custom domain and raster social cards when branding and DNS are ready.
- Add signed release artifacts if the site becomes a primary professional domain.
- Replace ordered intersections only after catalog size or measured latency justifies it.
- Add user research with recruiters and assistive-technology users before expanding interaction patterns.
