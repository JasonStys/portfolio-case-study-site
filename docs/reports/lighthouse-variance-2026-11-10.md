# Lighthouse variance investigation — 2026-11-10

By Jason Stys. This report separates an observed performance failure from its
unconfirmed cause and describes the diagnostic capture added to investigate it.

## Observed failure

The actual [PR validation run 42784647958](https://github.com/JasonStys/portfolio-case-study-site/actions/runs/42784647958)
tested source `1e508ee20d892c7a0a7e29d15600c75b6a308cab` using Lighthouse 13.5.0
and the disposable runner's Chrome 156. The source change declared two foreground
colors explicitly; no application JavaScript was added.

| Recorded observation                   |       Run 1 |     Run 2 |     Run 3 |
| -------------------------------------- | ----------: | --------: | --------: |
| Total blocking time, simulated ms      |       511.5 |         0 |         0 |
| First contentful paint, simulated ms   |  1213.27225 |  904.2784 |  904.5689 |
| Largest contentful paint, simulated ms | 1380.408375 | 1054.2784 | 1054.5689 |
| Cumulative layout shift                |           0 |         0 |         0 |
| Raw main-thread task time, ms          |      427.33 |     54.02 |    51.286 |
| Lighthouse CPU benchmark index         |      1715.5 |      2473 |    2468.5 |

The strict maximum-of-three TBT check correctly failed its unchanged 200 ms
limit. The other two zero values do not invalidate or remove the first result.
Aggregate category scores were accessibility 1, best practices 1, performance
0.97 and SEO 1.

All three reports recorded the same four loopback requests, resource sizes,
291 DOM elements, zero loaded application scripts and zero fonts. The document
was 21,434 resource bytes and its single stylesheet 17,622 resource bytes.
No third-party requests or source-attributed forced reflows were reported.
Run 1's seven simulated long tasks were attributed to `Other`, without an
application JavaScript stack. Its raw total task time was roughly eight times
the later runs, with a lower CPU benchmark and broadly slower initial rendering.

These observations are consistent with cold-start browser work, host contention
or browser nondeterminism. They do **not** establish a GitHub runner fault or a
deterministic regression caused by the two color declarations. The saved original
Lighthouse reports do not contain the raw trace or OS process telemetry needed
to distinguish those possibilities. The original failed reports remain evidence;
this change does not relabel them as passing.

## Bounded diagnostic capture

`scripts/lighthouse.mjs` now reads the installed Lighthouse result's public
`artifacts.Trace` and `artifacts.DevtoolsLog` fields. After each measured audit,
before evaluating the existing aggregate gates, it writes:

- `run-N.trace.json`: the complete raw trace, including the original event order;
- `run-N.devtoolslog.json`: the complete raw DevTools log;
- `run-N.diagnostics.json`: artifact byte counts and SHA-256 hashes, exact resolved
  profile, Lighthouse environment/timing entries and monotonic browser-startup,
  audit and artifact-write durations;
- the existing `run-N.json` Lighthouse report and final `summary.json` remain.

Each of the three runs still launches a fresh Chrome profile. Diagnostic URL
checks require the requested and final main document to equal the fixed owned
loopback target. Actual DevTools network URL fields must stay within that site's origin and
base path; credential-bearing URLs, query strings, fragments, authorization/cookie
headers, request bodies and cookie records are refused before diagnostic writes.
Raw Trace also retains browser-internal `chrome:` / `chrome-untrusted:` source labels from the
fresh owned profile, and bounded nonnavigable V8 source labels;
these are not accepted as network destinations. Secret-like values are refused.
This validates captured evidence; it is not a network sandbox or an interception
mechanism. No user browser session or profile is attached.

Hard limits per run are 100,000 trace events and 12 MiB of trace JSON, 10,000
DevTools entries and 2 MiB of DevTools JSON, and 256 KiB of metadata JSON.
Nested inspection is also bounded. An excessive or unexpected artifact fails
explicitly instead of being silently truncated or presented as complete.
No full Lighthouse artifact object, user browser history or request-body capture
is exported. Only the owned static site's fresh-profile trace/log is retained
under ignored `.runtime/lighthouse/`; the existing CI artifact retention policy
is unchanged.

The resolved profile is deliberately recorded as it actually exists: desktop
scoring and a 1350 by 940 desktop viewport, with Lighthouse's default mobile user
agent, slow-4G simulation and 4x CPU slowdown. Setting `formFactor: "desktop"`
alone does not select the complete desktop preset. This historical hybrid
profile is unchanged by the diagnostic update; switching to an easier preset
would change the comparison baseline.

## Validation and limits

Twenty focused tests passed locally. Real temporary filesystem checks roundtrip
raw JSON and independently verify exported byte counts and hashes. Negative
fixtures cover foreign/redirected/file/credential/query/fragment URLs,
authorization/cookie headers, bodies/cookie records, UTF-8 byte and record-count
caps, invalid run identifiers and non-finite timings. The regression fixture
`[511.5, 0, 0]` still fails the 200 ms TBT budget. Scoped ESLint passed with zero
warnings.

The complete 90-route production build and final local three-fresh-profile audit
passed using the existing Windows system Chrome 157.0.8103.50 and the same profile
and gates. The final recorded values were:

| Local observation                      |      Run 1 |      Run 2 |     Run 3 |
| -------------------------------------- | ---------: | ---------: | --------: |
| First contentful paint, simulated ms   | 1076.14065 | 1006.65104 | 1046.6938 |
| Largest contentful paint, simulated ms | 1076.14065 | 1055.30208 | 1055.3876 |
| Total blocking time, simulated ms      |          0 |          0 |         0 |
| Cumulative layout shift                |          0 |          0 |         0 |
| Browser startup, ms                    |    518.351 |   516.0734 |  528.2273 |
| Overall measured audit, ms             |  8203.0834 |  7149.9566 | 7486.8841 |
| Raw trace events                       |       7989 |       7266 |      7492 |
| DevTools records                       |         52 |         52 |        52 |

All six raw artifact byte counts and SHA-256 hashes were independently reread
and verified against their metadata. Trace files were about 1.38–1.51 MB and
DevTools logs about 25.6 KB, below the stated caps. Aggregate category scores
were 1 / 1 / 0.96 / 1. This is an observation of the uncommitted diagnostic
candidate, not proof about the later final Git commit or hosted runner.

Integration first exposed two local launch problems before any measurement
(the sandbox-remapped cache executable was absent, and the explicit cached
Chromium could not spawn). Existing system Chrome worked without changing
browser flags or OS settings. The initial raw-artifact scope implementation
also incorrectly treated browser startup resources and V8 source labels as
page network URLs. These instrumentation failures were corrected against the
installed API; retained intermediate Lighthouse reports remain private diagnostic
evidence and are not substituted into the final acceptance sample. The earliest
instrumentation attempt stopped before its report write; report persistence now
precedes diagnostic validation so a capture failure cannot erase a measured LHR.
No failed performance sample was retried or dropped from the final three-run gate.
The original hosted failure is still preserved independently.

Before final data integration, a separate documentation-hub branch temporarily
had no source-bound publication manifest; this produced two unrelated Astro
import diagnostics. The owner isolated that incomplete work before the build
above. No provisional manifest or fabricated commit link was substituted.
Final hosted validation of the committed source remains required separately.

No performance/category budget, throttle/profile setting, three-run count,
maximum-of-three metric aggregation, deadline, retry policy or sample inclusion
rule changed. A later failed measurement must remain a failure. Further diagnosis
should compare the captured raw tasks and, if needed, an independently authorized
same-environment baseline before changing page code.

## Primary references

- [Lighthouse score variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)
  explains client contention and browser nondeterminism.
- [Lighthouse throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)
  describes simulation from observed traces and the CPU benchmark index.
- [Lighthouse emulation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/emulation.md)
  distinguishes scoring form factor from user-agent and device emulation.
- [Lighthouse Node API](https://github.com/GoogleChrome/lighthouse#using-programmatically)
  documents programmatic audit results. The locked installed 13.5.0
  `types/artifacts.d.ts` declares `Trace` and `DevtoolsLog` as public gatherer
  artifacts, and `core/runner.js` returns them alongside the report.

## Hosted instrumentation correction

The [next hosted validation, run 42789393013](https://github.com/JasonStys/portfolio-case-study-site/actions/runs/42789393013)
tested `22e481a` and stopped during diagnostic capture. Its preserved first LHR
reported FCP 906.7652 ms, LCP 1056.7652 ms, TBT 0 ms and CLS 0. This was an
instrumentation failure, not a failed performance metric: a browser-internal
`chrome:` source label in raw Trace was incorrectly rejected by a platform-specific
startup-host allowlist. The artifact contains the LHR only; no raw trace was
written, so the exact internal label and any underlying browser scheduling cause
cannot be recovered from that artifact. No full three-run hosted pass is claimed.

Trace source labels and actual network destinations now have separate validation
semantics. In Trace only, `chrome:` and `chrome-untrusted:` resource labels with a
host and without credentials, port, query or fragment are retained as raw browser
content. Their host names are not treated as a cross-platform startup inventory.
Bounded nonnavigable V8 labels are also retained, while absolute filesystem labels
and file URLs remain refused. These allowances never apply to DevTools network
records or the requested/final main document. Their exact owned-target scope,
foreign-HTTP rejection and credential/body/secret checks are unchanged.

Twenty-eight focused tests now exercise both accepted browser-internal schemes
in Trace and refusal of the same schemes as network destinations, separate
credential/query/fragment negatives, absolute-path negatives and the original
strict-performance regression. The full unit suite passed 161 tests with 97.68%
line coverage, 97.30% branch coverage and 100% function coverage of the configured
library scope. Scoped ESLint and Astro type checking passed with zero diagnostics.
This does not expand that coverage claim to the raw-trace code or prove the
cause of the original 511.5 ms performance observation.
