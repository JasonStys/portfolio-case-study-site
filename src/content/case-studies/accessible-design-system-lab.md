---
title: "Accessibility as a component contract"
repository: "https://github.com/JasonStys/accessible-design-system-lab"
summary: "Native-first React components with sortable, paginated tables, explicit data states, keyboard focus contracts and tested package boundaries."
role: "Frontend and design-system engineering"
languages: ["TypeScript", "JavaScript", "HTML", "CSS"]
evidence:
  [
    "Stable sorting and pagination",
    "Keyboard and RTL journeys",
    "Consumer package smoke",
    "Measured bundle budgets",
  ]
---

## Problem

A reusable table needs more than attractive rows. Sorting formatted text can put numeric values in the wrong order, paging can strand keyboard focus, and a changed dataset can leave users on an empty page. These defects spread into every application that adopts the component.

## Constraints

Native HTML, controlled state, keyboard access and existing static callers must remain compatible. Sort keys must be explicit rather than inferred from formatted cells. Missing values, invalid bounds and dataset/schema changes must not create misleading order or inaccessible pages.

## Design

The React library preserves native HTML semantics and explicit state ownership. DataTable now accepts primitive sort keys separately from displayed content, retains stable ties and places missing or nonfinite values last. Header buttons expose the current sort direction through accessible names and aria-sort.

A consumer can sort service latency, move through pages and distinguish loading, failure, empty data and no matching results. Sorting retains header focus and resets the page; paging focuses the caption. Shrinking data or changing columns cannot leave an invisible sort choice or phantom page. The catalog and Storybook demonstrate these states, including RTL layout.

This keeps domain formatting outside the ordering algorithm and gives application developers a reusable interaction contract. Existing static tables and the package's other components remain supported.

## Verification

Hand-authored order oracles and the original integrated browser suite remain. The final TGZ is now installed into an external, locked React/Vite consumer which imports only public runtime exports and shipped CSS, mounts the actual table in Chromium, and checks numeric sorting, stable ties, missing values, paging, focus, loading/error/empty states and hostile text. It uses no source aliases, adopts no existing server and blocks outside browser requests.

## Measured result

**23 unit tests**, **99.28% line / 94.58% branch coverage**, and all **10 existing desktop/mobile browser journeys** passed. The separate actual installed-package consumer resolved all seven exports, exercised the real component and CSS, and recorded zero automated axe violations and zero outside requests. Library gzip budgets remain 3,638 bytes JavaScript / 2,020 bytes CSS, with their existing limits unchanged. Missing integrity metadata for the same pinned scheduler version was restored from the official registry; a fresh locked install and full dependency audit passed with zero known findings.

Accepted source: [`bd689a5a8b119ed629905f65d90d097ae16acd0e`](https://github.com/JasonStys/accessible-design-system-lab/tree/bd689a5a8b119ed629905f65d90d097ae16acd0e). The [validation report](https://github.com/JasonStys/accessible-design-system-lab/blob/bd689a5a8b119ed629905f65d90d097ae16acd0e/docs/reports/installed-consumer-2026-11-09.md) records executed scope and conditions. Exact-source main checks passed: [CI](https://github.com/JasonStys/accessible-design-system-lab/actions/runs/42749658831), [CodeQL](https://github.com/JasonStys/accessible-design-system-lab/actions/runs/42749658810).

## Limitations

An installable component library and catalog, without automatic public npm publication or a native desktop installer. Automated axe, keyboard and synthetic consumer checks do not establish accessibility conformance or replace assistive-technology testing. Consumers own authorization, fetching and large-data behavior. Checksums identify tested bytes rather than independently authenticated publishers.
