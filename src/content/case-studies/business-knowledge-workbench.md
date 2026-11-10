---
title: "Governed standards for business documents and data"
repository: "https://github.com/JasonStys/business-knowledge-workbench"
summary: "Owner-governed document and data standardization with consistent units, editable schemas and layouts, quantitative library search and authorized evidence packs."
role: "Full-stack, document, and data engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Owner-controlled standards",
    "Unit-aware numeric search",
    "Authorized document bundles",
    "Installed desktop workflow",
  ]
featuredOrder: 2
---

## Problem

Business files arrive with inconsistent names, measurements, layouts and formats. The purpose is to standardize their contents into an inspectable business-defined structure, then make those records searchable and reusable. For example, supplier measurements of 4.25 inches and 8.2 centimeters become 107.95 and 82 millimeters under the same selected standard.

## Constraints

Only the authorized owner may publish standards. Bare quantities need declared source units; unknown fields must be preserved with warnings or rejected. Search must compare one compatible cell, and exports must authorize every selection before generating plaintext output.

## Design

An authorized owner controls canonical field names, aliases, order, units, required fields, section headings, fonts, page layout and supported export policy. A draft preview precedes publication. Revision checks, immutable settings history and restore-as-new-revision prevent silent replacement. HTML is generated first; originals, warnings and the exact settings snapshot remain available.

The latest workflow searches standardized table values using inclusive numeric ranges with compatible units. Text and range conditions must match the same cell in the chosen column; missing, malformed or incompatible values do not become zero. Scientific notation is normalized as a complete number: 5e-3 V equals 0.005 V and 5 mV.

A user can publish a manufacturing standard, import supplier files, search millimeter values using centimeter bounds and select permitted documents for a ZIP. Each file follows its saved output policy. A manifest records order, byte counts and hashes; hidden selections fail authorization before generation. Searching and exporting do not rewrite originals or replay sales.

## Verification

Independent conversion examples check equivalent units, offsets, scientific notation, saved revisions and original preservation. Real owner journeys publish standards, import files, search ranges, inspect ZIP contents and lock/reopen the workspace; negative tests cover hidden selections, stale revisions and output budgets.

## Measured result

The change report records **228 Python tests at 89.87% statement coverage**, **10 private browser journeys** and **18 legacy/mobile journeys**. Independent cases cover manufacturing, renewable energy and calibration; mixed units, temperature offsets, exact decimals, schema revisions, malicious titles, stale publication and cross-account access.

Local Firefox startup failures were recorded as environment failures, not passes; the mandatory hosted browser lane subsequently passed. Exact-main validation, CodeQL and package workflows passed. The installed Windows application was exercised with a disposable account, including conversions, standards, filters, native ZIP download and encrypted lock/reopen.

Accepted source: [`a25887ac0e54f2afbe0e21e597c67b606890e8ad`](https://github.com/JasonStys/business-knowledge-workbench/tree/a25887ac0e54f2afbe0e21e597c67b606890e8ad). The [change report](https://github.com/JasonStys/business-knowledge-workbench/blob/a25887ac0e54f2afbe0e21e597c67b606890e8ad/docs/reports/practical-workflows-2026-11-09.md) records the executed scope and results. Exact-main workflow records passed: [Validate workbench](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/42704664864), [Desktop packages](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/42704664364), [CodeQL](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/42704664406).

[Version 1.4.0 downloads](https://github.com/JasonStys/business-knowledge-workbench/releases/tag/v1.4.0) include this update; its [release workflow](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/42705706255) passed three-OS package checks.

## Limitations

This is a local owner-account application, not shared business hosting or delegated team membership. Extraction is bounded to supported formats; OCR, image/equation understanding and arbitrary layouts are not universal. Range search inspects standardized cells with six-decimal canonical precision. Bundles contain 1–12 files within a 32 MiB content budget and remain plaintext, unsigned exports. A hash identifies content, not approval. Desktop packages are unsigned/not notarized.
