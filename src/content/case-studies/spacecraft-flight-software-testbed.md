---
title: "Software recovery you can replay and inspect"
repository: "https://github.com/JasonStys/spacecraft-flight-software-testbed"
summary: "A deterministic C++ recovery executive with received-witness review and source-bound portable downloads exercised after extraction."
role: "Flight-software concepts and systems verification"
languages: ["C++", "Python", "TypeScript", "SQL"]
evidence:
  [
    "Independent recovery oracles",
    "Received-witness comparison",
    "Native sanitizers",
    "Cross-platform source validation",
  ]
---

## Problem

A simulated onboard transition can be missed by downlink or confirmed only by a later cumulative counter. Reviewers need to distinguish the software truth from what the received stream actually supports, and downloadable builds should expose the same practical review as current source.

## Constraints

Software-only synthetic scenarios and logical ticks; no flight hardware, guidance, operational SAFE assertion or mission qualification. Portable builds remain unsigned extracted folders rather than installers. Native automation drives an owned loopback URL with --no-browser; default desktop browser opening remains a manual OS check.

## Design

Keep the original C++ executive and Python recovery oracles. Review full-run onboard changes, separate actual received witnesses and export complete replay evidence. The released 1.1.0 distribution binds Python/npm/CMake/runtime/UI/health identity to an exact source manifest, preserves native POSIX links in tar.gz and accepts only the actual extracted app. Release lookup uses a complete bounded authenticated list and numeric-ID reread; a published-only tag endpoint cannot stand in for a draft.

## Verification

The original recovery, native sanitizer, coverage and source browser gates remain intact. Local extracted-Windows acceptance checks a hand-expected watchdog reset, onboard-to-received witness ordering, compiled assets and an actual Chromium JSON download equal to the frozen API response. Independent metadata/archive/API fixtures reject failed or ambiguous checks, changed source/version, draft collisions, tampered archives, path/link escape and list/detail identity swaps. Public release and workflow evidence below bind to the reviewed source.

## Measured result

Recorded locally: 171 Python tests passed with 99.53% combined statement/branch coverage against the unchanged 90% requirement; 12 TypeScript tests,24 real Chromium/Firefox/WebKit source journeys,3 native build contracts and7 original deterministic replay contracts passed. The actual extracted Windows feature/export journey passed. These local results do not substitute for the final clean-source three-OS release jobs.

Accepted source: [`5f9dc95ad5df564373d1304b13e4bb2464d13842`](https://github.com/JasonStys/spacecraft-flight-software-testbed/tree/5f9dc95ad5df564373d1304b13e4bb2464d13842). The [validation report](https://github.com/JasonStys/spacecraft-flight-software-testbed/blob/5f9dc95ad5df564373d1304b13e4bb2464d13842/docs/reports/PORTABLE_REFRESH_20261109.md) records executed scope and conditions. Exact-source main checks passed: [CodeQL](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/42752160159), [Validation](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/42752160117).

[Version 1.1.0 downloads](https://github.com/JasonStys/spacecraft-flight-software-testbed/releases/tag/v1.1.0) contain application source [`5f9dc95ad5df564373d1304b13e4bb2464d13842`](https://github.com/JasonStys/spacecraft-flight-software-testbed/tree/5f9dc95ad5df564373d1304b13e4bb2464d13842). The [release workflow](https://github.com/JasonStys/spacecraft-flight-software-testbed/actions/runs/42752925223) passed its documented native gates. See the [download index](/portfolio-case-study-site/downloads/) for actual platforms, file types, full checksums and runtime requirements. All three release jobs exercised their own freshly extracted application and real UI/export. The Windows download was independently checked and exercised again before publication; this does not certify an installer lifecycle or default OS browser opening.

## Limitations

Received counter confirmation is not the exact event timestamp; an absent witness does not prove no event. Numerical replay and native launch checks are educational validation, not flight assurance. Default OS opener behavior and clean-machine installation are not established by the --no-browser portable acceptance.
