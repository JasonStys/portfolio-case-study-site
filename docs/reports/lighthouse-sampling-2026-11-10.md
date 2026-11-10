# Prospective Lighthouse sampling policy â€” November 10, 2026

By Jason Stys.

## Decision and comparison boundary

The performance gate now asks whether a fixed five-run batch has representative
load timings within its existing budgets. This is a prospective measurement
contract. It does not convert earlier failed three-run batches into passes, prove
an application performance improvement, or identify a GitHub runner fault.

The previous maximum-of-three policy was a valid conservative choice: every
observed timing had to meet its bound. A maximum is sensitive to an isolated slow
observation and does not, by itself, attribute that observation to a source change.
The new policy estimates central load timing while retaining every observation.
It does not bound worst-case performance, estimate p95, or guarantee any user's
experience. An isolated exceedance remains visible even when its metric's median
passes.

[Lighthouse CI documents distinct median, pessimistic and representative-run
aggregation choices](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html).
This implementation uses each timing metric's median, rather than selecting a
single report by another metric or using the most favorable run. The
[Lighthouse variability guide](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)
explains why repeated measurements and consistent test conditions matter even
without source changes. These sources inform the measurement choice; they do not
establish the cause of this project's individual slow observations.

## Fixed collection and unchanged numerical budgets

The script collects exactly five sequential audits. Each has a fresh owned Chrome
profile and a new blank page. The same blank page must complete its existing
lifecycle/two-frame readiness proof with no site HTTP requests before being passed
to Lighthouse. There are no extra runs, retries, replacements, discarded samples,
site preloads or warm-up page audits.

The fixed loopback URL, browser flags, readiness deadline, diagnostic limits and
device settings remain unchanged. The historical profile uses desktop scoring and
a 1350-by-940 desktop viewport with its inherited mobile user agent, Slow 4G
simulation and four-times CPU slowdown. This deliberately retained hybrid profile
is not described as a standard desktop preset. Source, browser and profile
identities must accompany comparisons.

| Selected result          | Five-run aggregation    | Required bound   |
| ------------------------ | ----------------------- | ---------------- |
| First Contentful Paint   | Median                  | At most 1,800 ms |
| Largest Contentful Paint | Median                  | At most 2,500 ms |
| Total Blocking Time      | Median                  | At most 200 ms   |
| Performance category     | Median                  | At least 0.92    |
| Cumulative Layout Shift  | Maximum across all five | At most 0.05     |
| Accessibility category   | Minimum across all five | Exactly 1        |
| Best Practices category  | Minimum across all five | At least 0.95    |
| SEO category             | Minimum across all five | At least 0.95    |

Any layout-shift or nonperformance category violation therefore remains fatal,
even if four other runs are perfect. A sustained majority timing regression also
remains fatal. Existing functional, browser, accessibility, source-security,
dependency and deterministic asset-budget gates remain independent requirements.
This sampling change does not authorize deployment when another required check
fails.

## Complete inputs and transparent evidence

The summary identifies `five-cold-loads-representative-v1` and retains all five
ordered samples, each with the four category scores and four numeric metrics.
It also records every metric's observed maximum and every per-run budget
exceedance, including its run, metric/category, observed value and limit. Those
diagnostics are never filtered merely because an aggregate passes.

Collection still saves each complete Lighthouse report and the bounded raw Trace,
DevTools log and diagnostic metadata before enforcing budgets. Existing network,
credential, file-path, byte-count and record-count guards remain in place. The
additional fourth and fifth reports use the same per-run limits.

Aggregation requires exactly five dense, complete successful reports. Missing or
sparse samples, runtime/audit errors, nonnumeric values, NaN, infinity, negative
metrics and category scores outside zero through one are fatal. No invalid run is
removed to obtain a usable median. The enforcement function independently checks
the summary's policy, count, values and ordered samples, then recomputes its
aggregates, maxima and exceedances. A forged passing aggregate or omitted outlier
diagnostic is rejected. This also closes the earlier JavaScript NaN-comparison
gap; that gap did not cause the finite historical budget failures.

## Historical evidence remains failed

For source
[`777bce758050aee13ed6779f70c5f8ace2c55e7e`](https://github.com/JasonStys/portfolio-case-study-site/tree/777bce758050aee13ed6779f70c5f8ace2c55e7e),
the [actual Lighthouse job](https://github.com/JasonStys/portfolio-case-study-site/actions/runs/42846303263/job/129934556922)
recorded the following three-run observations:

| Observation                           |    Run 1 |  Run 2 |  Run 3 |
| ------------------------------------- | -------: | -----: | -----: |
| Simulated TBT, ms                     |      320 |      0 |      0 |
| Browser startup, ms                   | 7,063.85 | 510.80 | 515.12 |
| Blank-page readiness, ms              | 2,690.89 |  75.41 |  72.15 |
| Largest target-renderer task, wall ms |   71.456 | 31.714 | 29.833 |
| Same task's thread CPU, ms            |   14.454 | 16.575 | 15.989 |

The old 200 ms maximum gate correctly failed. Artifact `13778766771` retains the
three reports and raw diagnostics; its ZIP SHA-256 is
`b6696766f8db61121ea30f02d8a93757ff8c2b5f37e2491307adc323ce5fa2d3`.
The target renderer was identified using navigation/frame events. The first
sample's large task includes layout work, with differing elapsed and thread-CPU
times. Those observations do not establish a particular scheduling, operating
system, hypervisor or application mechanism.

The report's six simulated long tasks are not six observed target-renderer tasks
above 50 ms. The [official throttling explanation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)
distinguishes simulated metrics from the initial observed trace. The
[TBT definition](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)
also distinguishes a task's full duration from its blocking portion. The raw trace
must be interpreted within those boundaries.

Earlier `[511.5, 0, 0]` and `[827.5, 0, 0]` ms failures remain documented in the
[prior investigation](lighthouse-variance-2026-11-10.md). All three historical
series are retained as incompatible three-run regression fixtures. They cannot
be padded, replayed or retrospectively summarized as a valid five-run batch.

## Local validation and remaining acceptance

| Check                                                        | Observed result                       |
| ------------------------------------------------------------ | ------------------------------------- |
| Focused Lighthouse diagnostics, lifecycle and sampling tests | 100 passed                            |
| Full unit suite                                              | 263 passed                            |
| Scoped ESLint                                                | Passed, zero warnings                 |
| Astro/TypeScript diagnostics                                 | 63 files, zero errors/warnings/hints  |
| New real five-run browser batch                              | Passed; all five TBT values were zero |

Independent fixtures check a visible isolated timing outlier with a passing
median, majority regressions that fail, any single CLS/nonperformance violation,
unchanged inclusive thresholds, malformed raw data, missing/sparse observations,
independently invalid summaries and hidden/forged exceedance evidence. A fifth-run
diagnostic fixture verifies complete raw evidence in the final planned slot.

The owner then ran the actual five-browser production audit locally on Windows
with Chrome 157, after the full verification/build completed and other browser
suites stopped. At `2026-11-10T16:10:42.061Z` the five TBT values were
`[0, 0, 0, 0, 0]` ms. Median FCP/LCP were 979.026/1,055.017 ms; observed maxima
were 996.315/1,056.246 ms. CLS was zero in every run. Median performance was 0.97;
the other category minima were 1.00. All twenty-one output files, including the
summary, were retained with byte hashes, and no individual exceedance was hidden.

This local working-tree observation is bound to script SHA-256
`a00dd83bcf0e3165a9e360c17b0f45d84d1a592ba8067814fb47d962cc0219c8`.
It is separate from the deterministic policy tests and does not claim a hosted
pass. The exact final source still requires its fresh five-run hosted audit and
all integration checks. No old failure is waived or relabeled by this report.
