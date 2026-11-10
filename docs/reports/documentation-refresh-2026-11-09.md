# Documentation refresh — 2026-11-09

By Jason Stys.

This documentation-only edition describes source `25b7f796b0ca267d4338fefca070dc07642d071d`. It does not change application behavior, accounts, private data, installers or published releases.

## Published editions and completed review

| File                                     | Bytes | SHA-256                                                            | Reviewed scope                     |
| ---------------------------------------- | ----: | ------------------------------------------------------------------ | ---------------------------------- |
| [project-guide.docx](project-guide.docx) | 50117 | `10cceb2bb70c6fa10b2b5184b65ad7948e0add8197f07e8e5d4d7c0444264705` | 10 pages, each viewed individually |

Word review checked plain black titles, readable pagination, whole table rows, source references, practical limits and absence of clipping or overflow. Render receipts were matched to the current DOCX digest before approval. Workbook review inspected both tab previews and actual exported Table/autoFilter elements; recalculated success/failure summaries were compared independently with workflow metadata. Static previews do not draw Excel dropdown arrows; the exported workbook contains the actual filters.

## Evidence and change boundary

- Functional baseline: `25b7f796b0ca267d4338fefca070dc07642d071d`.
- Workflow observation: `2026-11-10T05:25:40.628667+00:00`; exact run URLs and source identities remain in [publications.json](publications.json).
- Local document-package validation verifies exact copied bytes, Office ZIP integrity, approved page/tab identities and internal documentation links. Repository-specific documentation and source-policy commands are run separately and recorded in the integration handoff.
- Source/index metadata is regenerated using the repository’s existing tools. Existing privacy, security, coverage and workflow gates are retained.
- PR and later main workflows must pass independently. This record does not claim future or unrun integration CI success.

## Interpretation

The Word files document the cited source; dated source reports retain their original execution scope. A passing workflow is distinct from completed analysis with zero findings, and neither establishes production suitability. The Excel source inventory is not a per-test execution report. Checksums identify exact bytes, not a signature or publisher attestation.

Use the [handbook](../handbook.md) to choose usage, design, security and test documentation. Keep editable Markdown and reviewed editions together; do not replace historical measurements with undated claims.

## Integration-local validation

Every one of the ten final Word pages was individually reviewed, with the
current DOCX digest matching its render receipt. Exact Office bytes, ZIP integrity,
source/workflow identities and handbook/report links passed independent checks.
`npm run verify` passed formatting, lint, Astro/TypeScript, 133 unit tests,
benchmark/build/output budgets, repository/content checks and regenerated
source/file inventories. Measured unit coverage was 97.34% statements, 97.30%
branches, 100% functions and 97.68% lines under the unchanged configured gates.

This guide is an explicitly labeled snapshot of the cited baseline. It does not
claim that a later documentation hub or future portfolio update already exists.
No linked application, account store, installed software or release bytes change.
Later PR/main browser, Lighthouse, deployment and security checks remain separate
requirements.
