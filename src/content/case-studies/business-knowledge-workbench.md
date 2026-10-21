---
title: "Governed standards for business documents and data"
repository: "https://github.com/JasonStys/business-knowledge-workbench"
summary: "A private local application that standardizes supported business files into common units, field schemas, document layouts, and export types through owner-controlled, versioned HTML-first workflows."
role: "Full-stack, document, and data engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Owner-controlled output standards",
    "Schema and unit normalization",
    "Versioned HTML-first provenance",
    "Three-OS packaged-app checks",
  ]
featuredOrder: 2
---

## Problem

Business information arrives with inconsistent field names, units, document structures, and file types. The primary purpose is to standardize that information into an inspectable business-defined format—not simply display a catalog or dashboard. Search, product views, and reporting make the standardized records useful.

For example, an owner can map supplier fields `length` and `Width` to a canonical `width` field, choose millimeters, and publish a consistent document layout and PDF delivery policy. Supported tables then share field order and units: `4.25 in → 107.95 mm` and `8.2 cm → 82 mm`.

## Constraints

Only an authorized owner/admin may publish standards; a client role label must not grant authority. Conversions must preserve originals, extraction warnings, and settings evidence. Bare measurement values require an explicit source-unit declaration rather than guessing. Extra fields are preserved with a warning or rejected, never silently discarded. Financial values use exact arithmetic; private data must not leave the app by default.

## Design

- **Safe, data-only standards:** named settings define target units, canonical table keys/aliases/order, required or optional fields, section order/headings, fonts, paper/orientation, and preferred or optionally restricted HTML/JSON/Markdown/CSV/DOCX/PDF exports. HTML is always generated first; fonts and page layout do not apply to JSON/CSV.
- **Governed revisions:** a non-persistent CSV draft preview precedes publication. SQLite immediate transactions, optimistic revision checks, immutable history, and restore-as-new-revision prevent silent overwrites. Server-side checks protect these operations.
- **Preserved evidence:** each conversion retains source bytes, pre-normalization blocks, warnings, the settings snapshot, revision, and digest. Current-standard copies and mixed-revision compilations apply one selected standard without rewriting originals, chaining rounding, or replaying sales.
- **Private delivery:** Python converters, the TypeScript editor, SQL persistence, and an Electron shell share a locally encrypted workspace. Report exports follow the active standard. Optional AI remains read-only and requires explicit source consent.

See the [version 1.2 standards guide](https://github.com/JasonStys/business-knowledge-workbench/blob/v1.2.0/docs/standards.md) and [original-purpose review](https://github.com/JasonStys/business-knowledge-workbench/blob/v1.2.0/docs/requirements-review-v1.2.md) for exact contracts and deliberately unsupported capabilities.

## Verification

Regression tests cover equivalent CSV/TSV/JSON/DOCX/XLSX/HTML tables, actual PDF/DOCX page dimensions, invalid units and schemas, HTML escaping, immutable originals, stale/concurrent publication, history restoration, cross-account isolation, export restrictions, and sales idempotency. Same bytes with different input formats cannot reuse the wrong parser result; text-only CSV export fails explicitly.

The actual owner journey previews, publishes, imports, exports, changes units, creates a copy, verifies the original, and restores history. Browser checks cover Chromium, Firefox, WebKit, accessibility, and mobile layout. Frozen services and actual packaged apps are exercised on Windows x64, macOS arm64, and Linux x64. See [version 1.2 validation](https://github.com/JasonStys/business-knowledge-workbench/blob/v1.2.0/docs/validation-v1.2.md) and the [published v1.2.0 release](https://github.com/JasonStys/business-knowledge-workbench/releases/tag/v1.2.0).

## Measured result

Recorded v1.2.0 Windows validation passed **150 Python tests at 88.82% statement coverage**, **36 browser cases**, and an actual packaged-app journey. The synthetic 500-row/189-document benchmark measured **42.079 ms import p95** and **8.438 ms search p95** on its recorded machine—not a hosted SLA or a cross-version speed comparison.

Validation, CodeQL, three-OS packaging, and release workflows passed for source commit `ae04e12`. The [release workflow](https://github.com/JasonStys/business-knowledge-workbench/actions/runs/39654875902) gates publication on tested packages. These are inspected source-release results; updating this portfolio does not claim to rerun the workbench's entire suite or certify every possible input.

## Limitations

Supported extraction is bounded to 15 extensions, 4 MiB inputs, and 200 documents per business profile—not universal file understanding or OCR. Graph/equation meaning and complex layouts still require source review. The private edition's authority is its own unlocked account owner; role previews are not shared-business membership or delegated coworker permissions. Hosted team accounts and native mobile installers are not supplied. Forecasts are baselines, not causal business predictions. Desktop packages are unsigned/not notarized; unlocked plaintext trusts the local OS. A settings digest proves identity, not approval or authenticity.
