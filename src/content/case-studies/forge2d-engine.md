---
title: "Deterministic systems beneath a 2D engine"
repository: "https://github.com/JasonStys/forge2d-engine"
summary: "A deterministic C++20 engine lab with collision category/mask layers, versioned scene migration and independently checked overlap inspection."
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

Filters select AABB query pairs. They do not stop bodies passing through one another, apply forces, create enter/exit callbacks or change navigation. Consumers own gameplay reactions and valid handles. This is a fictional 2D engine lab, not a complete commercial editor or real-world tracking/control system. Earlier downloads have not been rebuilt for this update; use the accepted source.
