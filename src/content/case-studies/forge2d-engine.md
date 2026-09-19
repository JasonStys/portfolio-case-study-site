---
title: "Deterministic systems beneath a 2D engine"
repository: "https://github.com/JasonStys/forge2d-engine"
summary: "A C++20 engine lab centered on deterministic simulation, sparse-set data layout, pathfinding, collision broadphase, replay evidence, and defensive tooling."
role: "Game-engine and C++ systems engineering"
languages: ["C++", "C", "CMake"]
evidence: ["Sparse-set ECS", "Deterministic replay", "A* pathfinding", "Fuzzing and sanitizers"]
featuredOrder: 4
---

## Problem

Game-engine work must balance throughput, memory layout, determinism, debuggability, and iteration speed. A renderer alone does not show how entity lifetime, pathfinding, collision candidates, and replays behave under invalid or adversarial input.

## Constraints

- Simulation results must be reproducible across supported builds.
- Entity handles must detect stale generations instead of aliasing new objects.
- Broadphase work must avoid the naïve all-pairs cost for sparse scenes.
- The core remains testable without a graphics device.

## Design

The engine uses a sparse-set entity-component system for dense iteration and generation-checked handles. A uniform spatial grid reduces collision candidates, while A* uses a binary heap and deterministic tie-breaking. Fixed-step simulation and serialized inputs enable exact replay verification. SDL3 is an adapter around the headless core rather than a dependency of domain logic.

## Verification

Unit and property tests cover entity lifetime, pathfinding optimality, spatial queries, replay equivalence, and serialization boundaries. Sanitizer builds, fuzz targets, static analysis, and cross-platform CMake jobs probe memory and undefined-behavior risks.

## Measured result

Benchmarks record ECS iteration, pathfinding, broadphase candidate reduction, and replay throughput with explicit input sizes. The sample scene can be replayed headlessly and checked against a deterministic state digest.

## Limitations

This is an engineering lab rather than a commercial editor or complete rendering stack. Networking, asset hot reload, advanced physics, and console certification are deliberately outside the first release.
