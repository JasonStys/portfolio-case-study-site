# Download and workflow review — 2026-11-09

By Jason Stys. This review covers only the 67 repositories created in this chat. The 66 domain records have exact-source passing main workflows; this hub is validated and deployed separately. No older or unrelated repository source was changed.

Fourteen portable applications were refreshed to 1.1.0. Source/version identity, bounded native archive extraction and actual embedded UI/export acceptance accompany each build. The draft-release API defect was reproduced and repaired with a complete authenticated listing followed by numeric-ID retrieval; existing public releases and failed/cancelled run history were preserved. Native product-version mismatches were corrected and guarded.

Secure Delivery 1.1.0 passed genuine keyless authentication and 19 lifecycle/security cases on the hosted build and an independent Windows download. AES keeps immutable 0.3.0 bytes while newer acceptance tooling verifies their encrypted UI on three operating systems. Both library packages now undergo actual installed-consumer tests; the Node-RED full graph audit exposed and repaired compatible development-tool vulnerabilities without ignored advisories.

| Project                                                                                                 | Release                                                                                       | Distribution / platforms             | Release evidence                                                                                                     |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [code-flow-studio](https://github.com/JasonStys/code-flow-studio)                                       | [0.4.0](https://github.com/JasonStys/code-flow-studio/releases/tag/v0.4.0)                    | desktop-app / macos, linux, windows  | [Passing native workflow](https://github.com/JasonStys/code-flow-studio/actions/runs/42727706376)                    |
| [business-knowledge-workbench](https://github.com/JasonStys/business-knowledge-workbench)               | [1.4.0](https://github.com/JasonStys/business-knowledge-workbench/releases/tag/v1.4.0)        | desktop-app / macos, linux, windows  | [Passing native workflow](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/42705706255)        |
| [personal-image-model-studio](https://github.com/JasonStys/personal-image-model-studio)                 | [0.3.0](https://github.com/JasonStys/personal-image-model-studio/releases/tag/v0.3.0)         | desktop-app / macos, linux, windows  | [Passing native workflow](https://github.com/JasonStys/personal-image-model-studio/actions/runs/42730050386)         |
| [secure-delivery-pipeline-lab](https://github.com/JasonStys/secure-delivery-pipeline-lab)               | [1.1.0](https://github.com/JasonStys/secure-delivery-pipeline-lab/releases/tag/v1.1.0)        | cli-zipapp / cross-platform          | [Passing native workflow](https://github.com/JasonStys/secure-delivery-pipeline-lab/actions/runs/42747854973)        |
| [applicant-evidence-studio](https://github.com/JasonStys/applicant-evidence-studio)                     | [0.3.0](https://github.com/JasonStys/applicant-evidence-studio/releases/tag/v0.3.0)           | desktop-app / macos, linux, windows  | [Passing native workflow](https://github.com/JasonStys/applicant-evidence-studio/actions/runs/42728346654)           |
| [spacecraft-flight-software-testbed](https://github.com/JasonStys/spacecraft-flight-software-testbed)   | [1.1.0](https://github.com/JasonStys/spacecraft-flight-software-testbed/releases/tag/v1.1.0)  | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/42752925223)  |
| [spacecraft-telemetry-anomaly-studio](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio) | [1.1.0](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/releases/tag/v1.1.0) | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/spacecraft-telemetry-anomaly-studio/actions/runs/42752936951) |
| [mission-contact-resource-scheduler](https://github.com/JasonStys/mission-contact-resource-scheduler)   | [1.1.0](https://github.com/JasonStys/mission-contact-resource-scheduler/releases/tag/v1.1.0)  | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/mission-contact-resource-scheduler/actions/runs/42753749258)  |
| [spacecraft-power-thermal-lab](https://github.com/JasonStys/spacecraft-power-thermal-lab)               | [1.1.0](https://github.com/JasonStys/spacecraft-power-thermal-lab/releases/tag/v1.1.0)        | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/spacecraft-power-thermal-lab/actions/runs/42752930728)        |
| [mission-verification-evidence-kit](https://github.com/JasonStys/mission-verification-evidence-kit)     | [1.1.0](https://github.com/JasonStys/mission-verification-evidence-kit/releases/tag/v1.1.0)   | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/mission-verification-evidence-kit/actions/runs/42753754176)   |
| [orbital-safety-workbench](https://github.com/JasonStys/orbital-safety-workbench)                       | [1.1.0](https://github.com/JasonStys/orbital-safety-workbench/releases/tag/v1.1.0)            | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/orbital-safety-workbench/actions/runs/42753530576)            |
| [ccsds-telemetry-integrity-lab](https://github.com/JasonStys/ccsds-telemetry-integrity-lab)             | [1.1.0](https://github.com/JasonStys/ccsds-telemetry-integrity-lab/releases/tag/v1.1.0)       | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/ccsds-telemetry-integrity-lab/actions/runs/42753917630)       |
| [delay-tolerant-mission-network-lab](https://github.com/JasonStys/delay-tolerant-mission-network-lab)   | [1.1.0](https://github.com/JasonStys/delay-tolerant-mission-network-lab/releases/tag/v1.1.0)  | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/delay-tolerant-mission-network-lab/actions/runs/42753516416)  |
| [earth-observation-change-studio](https://github.com/JasonStys/earth-observation-change-studio)         | [1.1.0](https://github.com/JasonStys/earth-observation-change-studio/releases/tag/v1.1.0)     | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/earth-observation-change-studio/actions/runs/42753277644)     |
| [mission-clock-integrity-lab](https://github.com/JasonStys/mission-clock-integrity-lab)                 | [1.1.0](https://github.com/JasonStys/mission-clock-integrity-lab/releases/tag/v1.1.0)         | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/mission-clock-integrity-lab/actions/runs/42753523098)         |
| [resilient-energy-microgrid-lab](https://github.com/JasonStys/resilient-energy-microgrid-lab)           | [1.1.0](https://github.com/JasonStys/resilient-energy-microgrid-lab/releases/tag/v1.1.0)      | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/resilient-energy-microgrid-lab/actions/runs/42754891928)      |
| [scientific-sensor-calibration-lab](https://github.com/JasonStys/scientific-sensor-calibration-lab)     | [1.1.0](https://github.com/JasonStys/scientific-sensor-calibration-lab/releases/tag/v1.1.0)   | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/scientific-sensor-calibration-lab/actions/runs/42753283075)   |
| [space-weather-impact-observatory](https://github.com/JasonStys/space-weather-impact-observatory)       | [1.1.0](https://github.com/JasonStys/space-weather-impact-observatory/releases/tag/v1.1.0)    | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/space-weather-impact-observatory/actions/runs/42753759022)    |
| [reactor-systems-simulator](https://github.com/JasonStys/reactor-systems-simulator)                     | [1.1.0](https://github.com/JasonStys/reactor-systems-simulator/releases/tag/v1.1.0)           | portable-gui / macos, linux, windows | [Passing native workflow](https://github.com/JasonStys/reactor-systems-simulator/actions/runs/42754641321)           |
| [drone-operations-console](https://github.com/JasonStys/drone-operations-console)                       | [0.3.0](https://github.com/JasonStys/drone-operations-console/releases/tag/v0.3.0)            | desktop-app / windows                | [Passing native workflow](https://github.com/JasonStys/drone-operations-console/actions/runs/42710910458)            |

The download page separates application source, release checks and separately versioned acceptance tooling. Hash prefixes in HTML are for navigation; full digests are in its public JSON. GitHub asset digests and sidecars establish bytes, not publisher authentication. The Secure Delivery trust workflow additionally authenticates keyless provenance. Packages remain unsigned/unnotarized unless their own documentation establishes otherwise.

Native tests cover the documented executable, CLI/API, embedded assets, browser journey and exports. They use synthetic inputs and owned disposable working directories/accounts. They do not establish clean-machine installer lifecycles, default OS browser opening, manual assistive-technology conformance, production readiness, native mobile support, real hardware safety or operational control. Existing private accounts, stored data, desktop shortcuts and OS protections were preserved.

All 130 required domain push workflows passed at their collected commits. The full [project update list](https://jasonstys.github.io/portfolio-case-study-site/updates/) explains each purpose, change and rationale, including source-first projects with no public native installer. Historical failed and cancelled iterations remain distinct from the current source-specific results; they are not represented as passing.

## Portfolio validation

Local Windows/Node 24 validation passed all 133 unit tests, with 97.68% line and
97.30% branch coverage and 100% functions. All 51 production browser executions
passed in Chromium, Firefox and WebKit without retries. Both no-script discovery
and a separate script-enabled axe scan cover the actual final download inventory;
WebKit keyboard activation respects the host's native link-tab preference. The
initial combined scanner/no-script harness was corrected rather than extending
its timeout or omitting accessibility checks.

All formatting, strict lint/types, metadata/README/index drift, route/link,
repository and search-budget gates passed. The full dependency audit found zero
known vulnerabilities. Three Lighthouse runs passed: performance 0.97 and all
other measured categories 1.00; worst total blocking time and layout shift were
zero. Observed output: 90 HTML routes and 101 files, 1,329 bytes compressed
JavaScript, 4,864 bytes compressed CSS, 53,866-byte largest HTML and 28,664-byte
search index. The existing 32 KB / 24 KB / 55 KB / 100 KB limits were retained.

The full released-byte/source evidence also passed independent review: exact
20-project/62-payload membership, frozen core hashes, all fourteen native source
and asset sets, the four authenticated delivery members, and the separate AES
application/verifier revisions. Eight anonymous public release/tag samples and
small checksum/manifest downloads confirmed availability and byte bindings.
Hosted CI, CodeQL and Pages must independently validate this portfolio revision;
these local observations are not a claim about an unrun deployment.
