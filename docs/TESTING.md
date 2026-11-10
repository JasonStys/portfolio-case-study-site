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

| Risk                                        | Test layer                          | Evidence                                                                                                            |
| ------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Incorrect case-study frontmatter            | Astro content schema                | Build fails before route generation.                                                                                |
| Missing/duplicate repository data           | Unit and build contract             | Cache and curation failure cases.                                                                                   |
| Missing or contradictory portfolio ordering | Unit, route build, browser          | Exact 67-name coverage, all 14 space and seven drone projects, six broad featured mappings, and reset-order checks. |
| Search returns wrong intersection           | Unit                                | Text AND behavior and four exact facets.                                                                            |
| C++ or C# token is lost                     | Unit                                | Punctuation-preserving token case.                                                                                  |
| JavaScript failure hides work               | Architecture and no-script contract | Cards are server-rendered; enhancement only sets `hidden`.                                                          |
| Filter state cannot be shared               | Browser                             | Query and facet survive reload through URL parameters.                                                              |
| Keyboard user cannot reach content          | Browser                             | Skip link focus and activation.                                                                                     |
| Automated accessibility regression          | Browser + axe                       | WCAG A, AA, 2.1 AA, and 2.2 AA tags.                                                                                |
| Mobile overflow or column collision         | Browser layout regression           | 390-pixel viewport width and card geometry assertions.                                                              |
| Repository base breaks links                | Generated-output validator          | Every base-prefixed `href` and `src` resolves in `dist`.                                                            |
| Oversized client assets                     | Generated-output validator          | Compressed JS/CSS and HTML/index budgets.                                                                           |
| Slow search at larger scale                 | Benchmark                           | 10,000 projects and 500 deterministic queries.                                                                      |
| Performance/accessibility drift             | Lighthouse                          | Five fixed fresh-browser runs; timing medians and worst layout/accessibility results.                               |
| Vulnerable dependency/change                | Audit, dependency review, CodeQL    | Push, PR, and scheduled analysis.                                                                                   |
| Bad release replaces good site              | Deployment dependency graph         | Pages job requires all quality/browser/performance jobs.                                                            |

## Reviewed documentation editions

The documentation catalog has a closed public schema and requires the exact 67-project
order, 91 Word editions and 24 workbooks. Negative cases reject private extra fields,
foreign projects, mutable revisions, malformed dates/digests, duplicate or traversing
filenames, invalid byte/page counts and invented workbook pagination. Links are built
from the fixed owner, project, immutable commit and three permitted filenames.

The production-output check independently inspects all 67 rendered project pages for
their actual documentation section, exact Office links, SHA-256 values and documented
source revision. Browser journeys exercise the real navigation path, full and Word-only
editions, mobile wrapping, axe accessibility and JavaScript-disabled use. They do not
execute Office files, infer compiler results from workbook inventories, or treat a
checksum as a publisher signature.

The Office files themselves have separate all-page/all-tab visual review receipts and
byte identities in each repository's publication manifest. Word editions cite their
documented source and dated observations; a later documentation integration, security
fix or released application has a separate revision. Tests keep these boundaries
explicit instead of relabeling an older observation as a new execution result.

The Code Flow v0.4.2 content regression follows the real featured card → keyword
search → case-study journey, checks immutable validation/acceptance and release
links, verifies the coverage denominator and measurement caveats, and scans the
full case for accessibility and mobile overflow in all three browser engines.
It preserves the explicitly historical 0.4.0 measurements while requiring the
separate accepted runtime-fix counts, 18 private journeys, native drain evidence
and the limit that five seconds is not a universal process-exit guarantee.
Unit checks retain its first-place priority and searchable source-evidence terms.
The README synchronization gate checks the same outcome text. These portfolio
checks validate presentation; Code Flow's compiler results remain separately
linked, previously completed evidence rather than newly executed site tests.

The project-upgrade contract additionally checks exact approved domain coverage,
source/report commit agreement, repository-bound review/workflow URLs, bounded
text, and explicit project limitations. Static route/browser checks exercise the
67 project pages and update index without requiring JavaScript. Preview servers
must own their loopback listener; an occupied port fails before any HTTP probe,
never reusing an unrelated app. Browser failures are reported without CI retries.

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
npm run summary:check
npm run code-index:check
npm run file-catalog:check
npm run test:e2e
npm run lighthouse
npm run audit
```

## CI sequence

- `quality` runs deterministic checks, build validation, metadata freshness, and audit.
- `browser` runs the same production flows independently in Chromium, Firefox, and WebKit.
- `lighthouse` identifies the runner's installed Google Chrome and evaluates exactly five fresh sandboxed sessions, recording the browser version in its job log.
- `deploy` runs only for a green push to `main` and rebuilds the exact artifact.
- `CodeQL` runs on changes and a weekly schedule.
- `dependency-review` rejects risky pull-request dependency changes.

The [sampling policy](reports/lighthouse-sampling-2026-11-10.md) is prospective:
FCP, LCP and blocking time use the median of all five complete reports at the
unchanged 1,800/2,500/200 ms limits. Layout shift keeps its 0.05 maximum; accessibility,
best-practices and SEO keep minimum-score checks across every report. Performance
score uses the median. Every sample, maximum and exceedance is retained. Missing,
sparse, nonfinite or malformed data fails instead of disappearing into aggregation.
There is no adaptive run count, site preloading, sample replacement or retry.
The three historical slow-first series remain failed observations under their
original maximum-of-three policy, not retrospective five-run successes.

Browser setup keeps the existing 20-minute job deadline and zero test retries.
The disposable Ubuntu 24.04 x64 runner uses the two official HTTPS Ubuntu mirrors
with one APT acquire retry and 15-second HTTP/HTTPS transport waits. Its suites,
components, archive keyring and signature checks stay unchanged. OS dependencies
and locked browser binaries have separate 10- and 5-minute setup deadlines; a
setup failure cannot count as an application-test pass. The first download-refresh
PR attempt timed out in APT before Firefox/WebKit tests started; completed logs
identified the stalled Azure HTTP mirror and package-index acquisition.
[GitHub's runner configuration](https://github.com/actions/runner-images/blob/main/images/ubuntu/scripts/build/configure-apt.sh)
explains the acquire-key names and configuration precedence; its
[mirror source](https://github.com/actions/runner-images/blob/main/images/ubuntu/scripts/build/configure-apt-sources.sh)
defines the official archive endpoints. These CI-only changes do not edit a
developer's OS or relax application, accessibility or performance checks.

## Published downloads

The download validator has independent fixtures for the fixed 20-project/62-payload inventory, source/verifier separation, real platform requirements, checksum URL boundaries, unknown/private fields, wrong versions and incomplete package sets. Two production-page journeys run under all three existing browser engines. The no-script case checks actual metadata, all payload/checksum links, Windows-only Drone Operations, Secure Delivery's signed manifest, keyboard focus and 320-pixel reflow. A separate normal JavaScript context runs the asynchronous axe scanner. Both block outside resources; no-script browsing is not confused with a disabled scanner runtime.

Chromium/Firefox exercise Tab traversal between package and checksum links. WebKit follows the host's native link-tab preference, so its case explicitly focuses and activates the local project-detail link by keyboard, consistent with the existing navigation tests. [Apple documents the distinction between Tab and Option-Tab](https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac); these headless tests do not establish a user's particular Safari preference.

The portfolio does not execute downloaded binaries in browser tests. Each project's source-bound release workflow and the separate native acceptance records establish that scope. Passing native extraction/UI checks does not establish signed installation, a clean-machine lifecycle or default OS browser opening. Source quality, coverage, asset, performance and accessibility thresholds remain unchanged.

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
