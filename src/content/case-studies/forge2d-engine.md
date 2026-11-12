---
title: "Deterministic systems beneath a 2D engine"
repository: "https://github.com/JasonStys/forge2d-engine"
summary: "Edit game scenes, inspect collisions and replay real engine inputs with reproducible state and reusable project exports."
role: "Game-engine and C++ systems engineering"
languages: ["C++", "C", "CMake"]
evidence:
  [
    "Sparse-set ECS and replay",
    "Bilateral collision filters",
    "Independent geometry oracle",
    "Scene migration and fuzzing",
  ]
featuredOrder: 4
---

## Current usable application — 12 November 2026

Collision layers, scene migration and deterministic state evidence are exposed through an editable native scene workspace. Users can inspect entities, play or pause the real engine, record and replay inputs, recover projects and export scene, replay and render evidence.

Turns collision and replay diagnostics into a practical game-development workflow with reproducible inputs and visible state changes.

The current [version 1.1.0 release](https://github.com/JasonStys/forge2d-engine/releases/tag/v1.1.0) identifies [its packaged runtime source](https://github.com/JasonStys/forge2d-engine/tree/4ba77538f5d3025677c51dc3948c1870d2aff963). The matching [illustrated Windows guide](https://github.com/JasonStys/forge2d-engine/blob/60e0633fe70170194bfeff64e37d3eddc1348573/docs/reports/windows-application-guide-1.1.0.docx) and [guide identity record](https://github.com/JasonStys/forge2d-engine/blob/60e0633fe70170194bfeff64e37d3eddc1348573/docs/reports/windows-application-guide-1.1.0.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows x64 and a writable owner-local workspace. Verify the matching release checksum and retain the complete distribution and notices. The application runtime is bundled; no system Python, Node or Docker setup is needed for its prepared workflows.

**Current limits.** This is a bounded educational engine and owner-local editor, not a complete commercial game engine, multiplayer platform or signed installer.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

## Problem

A headless game engine must handle entity lifetime, deterministic replay, collision queries and invalid scenes consistently. Collision layers add a practical need: an actor should match another only when both sides permit the interaction, without confusing filtering with physical response.

## Constraints

Entity lifetime must remain generation-checked and simulation deterministic without a graphics device. Both actors must opt into a query match. Legacy scenes retain their defaults, invalid filter fields fail explicitly, and selecting collision pairs must not silently change movement or response.

## Design

The C++ core uses a sparse-set ECS with generation-checked handles, fixed-step simulation, deterministic A* and a spatial broadphase. SDL3 remains an adapter rather than a dependency of domain logic.

Bodies now carry a category bit and an inclusion mask. Both actors must include the other's category; a zero mask deliberately disables matching. The optimized query and independent quadratic reference implement their own predicates. World passes body metadata into queries without changing drawing or movement.

A developer can create player, character and zone layers, inspect initial/final overlap CSVs and replay the same scene headlessly. Scene version 2 stores filters, while version 1 imports retain their previous defaults. Filter words now participate in state hashing, so old numeric fingerprints intentionally change even though the replay-input grammar remains compatible.

## Verification

An independently implemented quadratic reference checks the optimized broadphase. Hand-authored pair matrices, generated scenes, actual CLI outputs, migration cases and replay fingerprints exercise different contracts; compiler, sanitizer and fuzz lanes retain their existing gates.

## Measured result

The change report records a fresh warnings-as-errors MSVC build and **10 native test groups**. **150 seeded scenes of 50 items** match an independent all-pairs oracle. Hand-written pair matrices exercise reverse order, high bits, zero masks, invalid categories, World propagation, failed-spawn atomicity and scene round trips.

Both CLI demonstrations completed 360 ticks. The filtered example produced exactly two initial and zero final pairs, with inspected CSV, scene, replay and rendered output. Source indexes, install/consumer checks, formatting and focused Clang-tidy passed. Existing benchmark budgets were retained; machine-specific timings do not establish real-time performance. Accepted CI supplies the additional compiler, sanitizer, fuzz and coverage lanes.

Accepted source: [`43fd93f79043231230a4c19346bdb8a4c356d9ce`](https://github.com/JasonStys/forge2d-engine/tree/43fd93f79043231230a4c19346bdb8a4c356d9ce). The [change report](https://github.com/JasonStys/forge2d-engine/blob/43fd93f79043231230a4c19346bdb8a4c356d9ce/docs/reports/practical-workflows-20261109.md) records the executed scope and results. Exact-main workflow records passed: [CI](https://github.com/JasonStys/forge2d-engine/actions/runs/42714064217), [CodeQL](https://github.com/JasonStys/forge2d-engine/actions/runs/42714064589).

## Limitations

Filters select AABB query pairs. They do not stop bodies passing through one another, apply forces, create enter/exit callbacks or change navigation. Consumers own gameplay reactions and valid handles. This is a fictional 2D engine lab, not a complete commercial editor or real-world tracking/control system. This source-first project is built and exercised through its documented package/service gates; no native desktop release is supplied.
