# Testing strategy

## Quality goals

The site must remain understandable without JavaScript, navigable by keyboard, correct under its repository base path, reproducible without GitHub API access, and inexpensive to load. Tests focus on those risks rather than framework internals.

## Test pyramid

```text
          Lighthouse / Pages smoke       few, environment-sensitive
       Cross-browser journeys + axe      focused, production output
    Unit + schema + artifact contracts   fast, broad boundary coverage
```

## Risk matrix

| Risk                                | Test layer                          | Evidence                                                   |
| ----------------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| Incorrect case-study frontmatter    | Astro content schema                | Build fails before route generation.                       |
| Missing/duplicate repository data   | Unit and build contract             | Cache and curation failure cases.                          |
| Search returns wrong intersection   | Unit                                | Text AND behavior and four exact facets.                   |
| C++ or C# token is lost             | Unit                                | Punctuation-preserving token case.                         |
| JavaScript failure hides work       | Architecture and no-script contract | Cards are server-rendered; enhancement only sets `hidden`. |
| Filter state cannot be shared       | Browser                             | Query and facet survive reload through URL parameters.     |
| Keyboard user cannot reach content  | Browser                             | Skip link focus and activation.                            |
| Automated accessibility regression  | Browser + axe                       | WCAG A, AA, 2.1 AA, and 2.2 AA tags.                       |
| Mobile overflow or column collision | Browser layout regression           | 390-pixel viewport width and card geometry assertions.     |
| Repository base breaks links        | Generated-output validator          | Every base-prefixed `href` and `src` resolves in `dist`.   |
| Oversized client assets             | Generated-output validator          | Compressed JS/CSS and HTML/index budgets.                  |
| Slow search at larger scale         | Benchmark                           | 10,000 projects and 500 deterministic queries.             |
| Performance/accessibility drift     | Lighthouse                          | Three independent production-preview runs.                 |
| Vulnerable dependency/change        | Audit, dependency review, CodeQL    | Push, PR, and scheduled analysis.                          |
| Bad release replaces good site      | Deployment dependency graph         | Pages job requires all quality/browser/performance jobs.   |

## Coverage targets

Core TypeScript library thresholds:

- Statements: 92%
- Branches: 88%
- Functions: 92%
- Lines: 92%

Generated Astro markup is validated through build contracts and browser behavior rather than line coverage.

## Local sequence

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run benchmark:check
npm run build
npm run dist:check
npm run repository:check
npm run code-index:check
npm run file-catalog:check
npm run test:e2e
npm run lighthouse
npm run audit
```

## CI sequence

- `quality` runs deterministic checks, build validation, metadata freshness, and audit.
- `browser` runs the same production flows independently in Chromium, Firefox, and WebKit.
- `lighthouse` installs Chromium and evaluates three fresh sessions.
- `deploy` runs only for a green push to `main` and rebuilds the exact artifact.
- `CodeQL` runs on changes and a weekly schedule.
- `dependency-review` rejects risky pull-request dependency changes.

## Manual checks before release

- Read every changed case study for unsupported claims and confidential details.
- Navigate at 200% zoom and with a keyboard.
- Inspect forced-colors and reduced-motion rendering.
- Verify external GitHub and LinkedIn destinations.
- Confirm the live Pages URL and the newest sitemap after deployment.

## Known test gaps

- No automated screen-reader speech-output assertion.
- No real recruiter comprehension study.
- Pixel screenshots are not used because OS text rasterization creates noisy cross-platform diffs; deterministic layout geometry is checked instead.
- External links are allowlisted and reviewed but not fetched during every build, avoiding rate-limit and network flakiness.
