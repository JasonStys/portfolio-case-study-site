# Space & energy portfolio synchronization — 2026-10-21

## Scope and selection

Updated the existing README summary and GitHub Pages site, as requested. No
separate summary repository was found or created. The public catalog now has 60
projects, including all 14 completed space-related projects at positions 7–20.
The original six broad highlights and profile pins were preserved; no stars,
branches, releases, accounts or source projects were changed.

Four specialist highlights emphasize different engineering strengths:

- **Flight-software testbed:** deterministic C++ execution, deadlines, checkpoints,
  recovery and independent replay, rather than a dashboard alone.
- **Telemetry anomaly studio:** causal scoring, frozen training, missing-data
  handling and held-out comparisons, rather than an unexplained AI score.
- **Contact/resource scheduler:** an exact solver, resource constraints, greedy
  comparison and an independent exhaustive oracle.
- **Verification evidence kit:** revision-bound requirements/test/fault evidence,
  stale-evidence rejection, actual JUnit ingestion and independent SQL verdicts.

Each now has a detailed case study. The other ten remain fully searchable and
linked, with concrete outcomes and source limitations. Selection is editorial,
not a certification, seniority score or statement that lower-ranked work is poor.

## Public source evidence

Read-only snapshot at 2026-10-21 16:30 UTC: each project had a published v1.0.0
release and successful latest Validation, CodeQL and Portable release workflows
for its exact current main revision (42 successful workflow conclusions total).
These are inspected historical results, not 14 newly executed simulations.
Release pages identify the immutable source revision and downloadable evidence.

| Project                                                                                                                     | Validation                                                                                          | CodeQL                                                                                              | Portable release                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [spacecraft-flight-software-testbed](https://github.com/JasonStys/spacecraft-flight-software-testbed/releases/tag/v1.0.0)   | [Passed](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/39504596496)  | [Passed](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/39504596526)  | [Passed](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/39504921345)  |
| [spacecraft-telemetry-anomaly-studio](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/releases/tag/v1.0.0) | [Passed](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/39508315122) | [Passed](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/39508315194) | [Passed](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/39508643931) |
| [mission-contact-resource-scheduler](https://github.com/JasonStys/mission-contact-resource-scheduler/releases/tag/v1.0.0)   | [Passed](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/39512450186)  | [Passed](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/39512450193)  | [Passed](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/39512690926)  |
| [spacecraft-power-thermal-lab](https://github.com/JasonStys/spacecraft-power-thermal-lab/releases/tag/v1.0.0)               | [Passed](https://github.com/JasonStys/spacecraft-power-thermal-lab/actions/runs/39536279913)        | [Passed](https://github.com/JasonStys/spacecraft-power-thermal-lab/actions/runs/39536279916)        | [Passed](https://github.com/JasonStys/spacecraft-power-thermal-lab/actions/runs/39536616074)        |
| [mission-verification-evidence-kit](https://github.com/JasonStys/mission-verification-evidence-kit/releases/tag/v1.0.0)     | [Passed](https://github.com/JasonStys/mission-verification-evidence-kit/actions/runs/39566993126)   | [Passed](https://github.com/JasonStys/mission-verification-evidence-kit/actions/runs/39566993174)   | [Passed](https://github.com/JasonStys/mission-verification-evidence-kit/actions/runs/39567343128)   |
| [orbital-safety-workbench](https://github.com/JasonStys/orbital-safety-workbench/releases/tag/v1.0.0)                       | [Passed](https://github.com/JasonStys/orbital-safety-workbench/actions/runs/39491095891)            | [Passed](https://github.com/JasonStys/orbital-safety-workbench/actions/runs/39491096085)            | [Passed](https://github.com/JasonStys/orbital-safety-workbench/actions/runs/39491531944)            |
| [ccsds-telemetry-integrity-lab](https://github.com/JasonStys/ccsds-telemetry-integrity-lab/releases/tag/v1.0.0)             | [Passed](https://github.com/JasonStys/ccsds-telemetry-integrity-lab/actions/runs/39522665889)       | [Passed](https://github.com/JasonStys/ccsds-telemetry-integrity-lab/actions/runs/39522665887)       | [Passed](https://github.com/JasonStys/ccsds-telemetry-integrity-lab/actions/runs/39522950132)       |
| [delay-tolerant-mission-network-lab](https://github.com/JasonStys/delay-tolerant-mission-network-lab/releases/tag/v1.0.0)   | [Passed](https://github.com/JasonStys/delay-tolerant-mission-network-lab/actions/runs/39531699860)  | [Passed](https://github.com/JasonStys/delay-tolerant-mission-network-lab/actions/runs/39531699881)  | [Passed](https://github.com/JasonStys/delay-tolerant-mission-network-lab/actions/runs/39532067954)  |
| [earth-observation-change-studio](https://github.com/JasonStys/earth-observation-change-studio/releases/tag/v1.0.0)         | [Passed](https://github.com/JasonStys/earth-observation-change-studio/actions/runs/39541059421)     | [Passed](https://github.com/JasonStys/earth-observation-change-studio/actions/runs/39541059447)     | [Passed](https://github.com/JasonStys/earth-observation-change-studio/actions/runs/39541610286)     |
| [mission-clock-integrity-lab](https://github.com/JasonStys/mission-clock-integrity-lab/releases/tag/v1.0.0)                 | [Passed](https://github.com/JasonStys/mission-clock-integrity-lab/actions/runs/39545764424)         | [Passed](https://github.com/JasonStys/mission-clock-integrity-lab/actions/runs/39545764507)         | [Passed](https://github.com/JasonStys/mission-clock-integrity-lab/actions/runs/39546015001)         |
| [resilient-energy-microgrid-lab](https://github.com/JasonStys/resilient-energy-microgrid-lab/releases/tag/v1.0.0)           | [Passed](https://github.com/JasonStys/resilient-energy-microgrid-lab/actions/runs/39553834914)      | [Passed](https://github.com/JasonStys/resilient-energy-microgrid-lab/actions/runs/39553834872)      | [Passed](https://github.com/JasonStys/resilient-energy-microgrid-lab/actions/runs/39554072755)      |
| [scientific-sensor-calibration-lab](https://github.com/JasonStys/scientific-sensor-calibration-lab/releases/tag/v1.0.0)     | [Passed](https://github.com/JasonStys/scientific-sensor-calibration-lab/actions/runs/39558562158)   | [Passed](https://github.com/JasonStys/scientific-sensor-calibration-lab/actions/runs/39558561969)   | [Passed](https://github.com/JasonStys/scientific-sensor-calibration-lab/actions/runs/39558921996)   |
| [space-weather-impact-observatory](https://github.com/JasonStys/space-weather-impact-observatory/releases/tag/v1.0.0)       | [Passed](https://github.com/JasonStys/space-weather-impact-observatory/actions/runs/39526521459)    | [Passed](https://github.com/JasonStys/space-weather-impact-observatory/actions/runs/39526521366)    | [Passed](https://github.com/JasonStys/space-weather-impact-observatory/actions/runs/39526740666)    |
| [reactor-systems-simulator](https://github.com/JasonStys/reactor-systems-simulator/releases/tag/v1.0.0)                     | [Passed](https://github.com/JasonStys/reactor-systems-simulator/actions/runs/39498399965)           | [Passed](https://github.com/JasonStys/reactor-systems-simulator/actions/runs/39498399675)           | [Passed](https://github.com/JasonStys/reactor-systems-simulator/actions/runs/39498819527)           |

## Portfolio verification

Local Windows x64 / Node 24.18.1 checks passed: strict formatting/lint/types,
17 unit tests (98.46% statements, 97.43% branches, 100% functions, 99.13% lines),
24 production-browser tests, schema/content/link contracts, metadata freshness,
README/table drift, generated file/symbol indexes, dependency audit and all
original search/static-size budgets. Three local Lighthouse sessions passed:
accessibility/best practices/SEO 1.00; median performance 0.98; worst FCP/LCP
1,002.74 ms; TBT 0 ms; CLS 0.00. Browser sandboxing stayed enabled.

Adding 14 entries initially exceeded size gates. Schema-2 integer search postings
and compact server-rendered cards resolved that without removing catalog data,
disabling JavaScript-free access or raising budgets. Final local sizes:
JavaScript gzip 1,305 B, CSS gzip 4,360 B, largest HTML 52,766 B, index 25,499 B.
The search-index request includes schema/revision parameters to avoid stale
schema-1 cache reuse. Unknown inherited-object keys have a regression test.

During a repeat local check, one browser discovery test received temporary 404s
at 16:37:47 UTC while a concurrent verification build was replacing `dist/`.
The request trace and build log matched that timestamp. This was validation
orchestration interference, not evidence of a deployed route defect; repeat
browser checks must run against a stable output directory, with no concurrent
build. The operations runbook now states this explicitly. CI uses separate
runner checkouts, not a shared local build directory.

Public deployment is gated independently by the exact commit's
[CI and Pages](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/ci.yml)
and [CodeQL](https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/codeql.yml).
The same 24 browser acceptance checks can target the deployed URL with
`PORTFOLIO_BASE_URL`, without starting a local server. Workflow results remain
the authoritative evidence for that published commit, not an evergreen claim
about future commits. No retention, cache or artifact-deletion policies changed.

## Limits and provenance

These are civilian educational engineering demonstrations. Synthetic scenarios,
public Sentinel-2 observations and frozen NOAA records are identified separately.
There is no weapon guidance, operational mission control, live reactor monitoring,
flight qualification, agency endorsement or claim of military employment/clearance.
Historical source-release test counts are explicitly labeled, not represented as
new experiments. Automated accessibility/security tests are bounded checks, not
proof that every possible defect has been excluded.
