---
title: "Private document workflows with traceable conversions"
repository: "https://github.com/JasonStys/business-knowledge-workbench"
summary: "A modular local workbench that keeps document blocks, units, provenance, product views, and analytical reports connected through HTML-first conversion and encrypted workspaces."
role: "Full-stack, document, and data engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "15 supported extensions",
    "Dimension-safe unit conversions",
    "HTML-first provenance",
    "Cross-platform desktop packages",
  ]
featuredOrder: 2
---

## Problem

Business information often mixes incompatible file types, units, document structure, and reporting needs. A generic conversion tool can lose evidence or create misleading interpretations when it pretends every document has been fully understood.

## Constraints

Conversions must preserve warnings and source references. Financial values use exact arithmetic. Private data must not leave the local app by default. Unsupported or oversized inputs must fail explicitly rather than silently truncate.

## Design

Bounded converters normalize supported inputs into HTML-first semantic blocks. Decimal-based dimension checks prevent incompatible unit operations; product and report modules reuse provenance-aware records. Role views preview an individual workspace. A Python service, TypeScript UI, and SQL persistence share an independently locked local vault; optional AI uses explicit source consent.

## Verification

Tests cover converter dispatch, malformed/oversized inputs, dimensions, exact financial values, rich exports, account isolation, and asynchronous response races. Actual frozen converter resources and packaged executables are tested on three operating systems. See [validation history](https://github.com/JasonStys/business-knowledge-workbench/blob/main/docs/validation-v1.1.md).

## Measured result

Recorded version 1.1 Windows validation passed 114 tests at 88.65% statement coverage. A synthetic 500-row/189-document benchmark measured 41.327 ms import p95 and 3.455 ms search p95 on the recorded machine. Patch 1.1.1 adds a delayed-response regression for stale asynchronous views.

## Limitations

Supported extraction is bounded to 15 extensions, 4 MiB inputs, and 200 documents—not arbitrary file understanding. Images, equations, and charts may require explicit interpretation warnings. Role previews are not shared-tenant permissions. Forecasts are baselines, not business predictions. Desktop builds are unsigned; active plaintext trusts the local OS.
