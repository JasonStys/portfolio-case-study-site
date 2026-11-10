# Code Flow Studio 0.4.3 portfolio synchronization

By Jason Stys. This update presents the published C# coverage correction in the
portfolio summary README, first featured project, searchable catalog, current
download metadata, project summary and full case study. Earlier native/shutdown
and 0.4.0 measurements retain their original sources and dates.

## Verified application evidence

These are Code Flow Studio results inspected for the portfolio; they are not
this site's test counts or a new local compiler execution claim.

- [Published v0.4.3](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.4.3),
  source `1d0b19ed589947ae45e93555d97331c95cad26cc`, release ID `440853004`.
  All six platform payloads and six checksum sidecars are publicly available.
- [Source validation](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062261)
  passed 419 tests and 28 subtests. Its 85.01% coverage measures controller/training
  code against the unchanged 80% minimum; it is not worker-source coverage.
- [Real compiler acceptance](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062235)
  passed both 70-scenario lanes, including twelve adapters and twelve encrypted
  private reports per lane surviving seal/logout/login/unlock/export replay.
- The current C# bridge observes actual instrumented exits `0, 1, 2, 7, 255, 2`
  with collector exit zero and measured coverage. Real argument rejection,
  post-target report-write failure and timeout remain blocked. The argument
  control actually returns collector zero without a valid target observation;
  the write failure returns 101 after target zero; timeout returns -9.
- [Source packages](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062323),
  [CodeQL](https://github.com/JasonStys/code-flow-studio/actions/runs/42891062291),
  the five-job [release build](https://github.com/JasonStys/code-flow-studio/actions/runs/42892088142)
  and all three [tag](https://github.com/JasonStys/code-flow-studio/actions/runs/42894070479)
  [compiler](https://github.com/JasonStys/code-flow-studio/actions/runs/42894070441)
  [package](https://github.com/JasonStys/code-flow-studio/actions/runs/42894070586)
  runs passed: eight application runs and 24 successful jobs.

The [protocol](https://github.com/JasonStys/code-flow-studio/blob/1d0b19ed589947ae45e93555d97331c95cad26cc/docs/csharp-coverage.md)
describes fresh source/case/input-bound observations, fixed executable/assembly
selection, strict evidence parsing and inherited worker deadlines. The
[fix checkpoint](https://github.com/JasonStys/code-flow-studio/blob/1d0b19ed589947ae45e93555d97331c95cad26cc/docs/reports/csharp-coverage-2026-11-10.md)
retains the earlier 410-test PR observation and original failed acceptance
assertion; it is not relabeled as the later 419-test release validation.

## Presentation and safety boundaries

The release catalog binds current links, six exact payload digests, sizes,
checksums, source and successful workflow identities to 0.4.3. Other projects'
download and upgrade records are preserved. Office-publication editions remain
historical documents with their actual publication sources.

Measured instrumentation is not 100% coverage or proof of correctness. Same-UID
file bindings are consistency checks, not hostile-target attestation. The older
0.4.2 compiler lane keeps its historical partial state. Unsigned native packages
on three operating systems are distinct from three installation transactions;
only a Windows upgrade was independently accepted. That acceptance used fresh
disposable accounts and did not exercise populated pre-existing vault upgrades
or replay real credentials. Private PC paths, account contents and backup data
are not published here. Local execution still requires the matching 0.4.3
isolated worker; this portfolio update changes neither apps nor Docker.

## Portfolio verification

Observed locally on Windows x64 with Node 24.18.1 on 10 November 2026:

- `npm run verify` passed formatting, lint, Astro types (zero errors/warnings),
  **269 unit tests**, benchmark gates, production build/output checks, repository
  contracts and README/source-index/file-catalog synchronization. All 67 reviewed
  project summaries remain represented.
- Core portfolio libraries measured **97.67% statements**, **97.66% branches**,
  **100% functions** and **97.98% lines**. All existing coverage gates passed.
- **57 production-browser journeys passed** across Chromium, Firefox and WebKit.
  The current Code Flow path checks C#/Coverlet/collector search, independent
  target/collector table values, real failure distinctions, immutable evidence
  links, six current payload/checksum links, historical sections, accessibility
  and both 390- and 320-pixel reflow. Existing documentation, download, business,
  space, drone, keyboard and no-JavaScript flows also passed.
- The unchanged five-cold-load Lighthouse policy passed with performance
  **0.97** and accessibility, best practices and SEO **1.00**. Representative FCP
  was **990.58 ms**, LCP **1,054.87 ms**, TBT **0 ms** and CLS **0**. Maximum observed
  FCP/LCP were **1,015.99 / 1,055.99 ms**; no budget exceedances were recorded.
- The synthetic 10,000-project / 500-query search check built in **106.864 ms**
  with **2.823 ms** query p95, passing the unchanged 1,500 / 12 ms gates. This is
  a machine-specific sample, not a universal timing or Big-O result.
- Output checks validated 102 generated files / 91 HTML routes: JavaScript gzip
  **1,329 B**, CSS gzip **4,963 B**, largest HTML **54,043 B** and search index
  **28,780 B**, all within existing budgets.
- Locked dependency audit reported **zero known vulnerabilities** at check time;
  metadata freshness covered all 67 projects. Other 19 download records and 65
  domain-upgrade records retained their previous values; historical Office
  publication inputs were not rewritten as current release evidence.

Initial browser attempts exposed an outdated title assertion and a four-pixel
mobile overflow. Table styling alone did not resolve the latter: an actual
element-geometry probe identified the full source SHA expanding the grid's
minimum-content track. The final `.prose` constraint and wrapping preserve the
entire source identity instead of clipping it, and the styled evidence table
remains readable at narrow widths. The unchanged overflow assertion now also
checks 320 pixels. Failed attempts are not counted as passing observations.

The [CI and Pages workflow](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/ci.yml)
and [CodeQL](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/codeql.yml)
check the exact published revision separately. Deployment and live-content
verification must be observed before completion; these local results alone do
not certify an unrun later revision.

## Storage and deployment

Actions storage was checked before work at 2026-11-10 20:44 UTC across 102
repositories: **186,891,961 artifact bytes**, with **16,300,328,276 cache bytes**
under a separate allowance. Quota percentage was unavailable. No runs, artifacts,
caches or previous backups were deleted; no billing/retention setting changed.

The existing GitHub Pages workflow requires quality, Chromium/Firefox/WebKit
journeys and five-run Lighthouse budgets before deployment. CodeQL remains
independent. Thresholds, dependency inputs and hosting are not changed for this
content update. Rollback is a normal revert through the same gates; no unverified
direct upload or alternate hosting account is introduced.
