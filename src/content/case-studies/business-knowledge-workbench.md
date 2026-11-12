---
title: "Governed standards for business documents and data"
repository: "https://github.com/JasonStys/business-knowledge-workbench"
summary: "Standardize, preview and search business files with authorized formats, consistent units and same-cell numeric filters."
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

## Current usable application — 12 November 2026

Configurable units, fields, structure and exports are paired with previews, authorized document downloads and numeric searches that keep related conditions on the same cell. The private desktop edition retains each authenticated user's workspace and standards, with corrected scientific notation and readable interface symbols.

Makes records easier to compare and reuse while keeping formatting choices, measurement meaning and access rules attached to the data.

The current [version 1.4.1 release](https://github.com/JasonStys/business-knowledge-workbench/releases/tag/v1.4.1) identifies [its packaged runtime source](https://github.com/JasonStys/business-knowledge-workbench/tree/ba3cf3cfc6f2d443747f7350af06ca0329b1fcc4). The matching [illustrated Windows guide](https://github.com/JasonStys/business-knowledge-workbench/blob/6f1eaa4aa288722420c993513921357da33a1198/docs/reports/windows-application-guide-1.4.1.docx) and [guide identity record](https://github.com/JasonStys/business-knowledge-workbench/blob/6f1eaa4aa288722420c993513921357da33a1198/docs/reports/windows-application-guide-1.4.1.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows and the matching installer/checksum; no system Python is required. Use authorized supported files and your own local account plus separate vault phrase. Back up the complete stopped account archive and keep recovery material private.

**Current limits.** Supported parsers have explicit fidelity limits. Private account workspaces and role previews do not constitute an enterprise staff-directory system or universal document understanding. The trusted local OS/service can access active plaintext while the owner unlocks a vault. Keep account backups and vault phrases private; unsupported layouts or embedded objects may lose fidelity.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

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
