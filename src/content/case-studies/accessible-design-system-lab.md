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

Hand-written order oracles cover mixed primitive values, missing keys and stable ties. Component and actual browser checks exercise focus, announcements, schema changes, RTL and mobile interaction; a clean consumer validates the packed public exports.

## Measured result

The change report records **23 TypeScript tests**, **99.28% line coverage**, **96.79% statement coverage** and **94.58% branch coverage**. Independent expected orders cover numbers, strings, mixed keys, ties, missing values and immutable inputs. Component tests exercise schema changes, invalid bounds, keyboard behavior and data-state announcements.

**10 desktop/mobile Chromium journeys** cover sorting, paging, caption focus, RTL and Axe. The packed-consumer smoke verifies seven exports. Library gzip measurements are **3,638 bytes JavaScript** against 36,000 and **2,020 bytes CSS** against 16,000; these are library measurements, not Storybook's vendor bundle. Full dependency audit, types, lint, builds and package checks passed.

Accepted source: [`56c6869b4a2d0accc11c5700968594cef3c12074`](https://github.com/JasonStys/accessible-design-system-lab/tree/56c6869b4a2d0accc11c5700968594cef3c12074). The [change report](https://github.com/JasonStys/accessible-design-system-lab/blob/56c6869b4a2d0accc11c5700968594cef3c12074/docs/reports/practical-workflows-20261109.md) records the executed scope and results. Exact-main workflow records passed: [CI](https://github.com/JasonStys/accessible-design-system-lab/actions/runs/42712082599), [CodeQL](https://github.com/JasonStys/accessible-design-system-lab/actions/runs/42712082126).

## Limitations

Automated Axe and keyboard checks do not establish WCAG conformance or replace testing with assistive-technology users. Ordering is deterministic code-unit/numeric ordering, not locale collation. Tables sort in memory; consumers own fetching, authorization, retries and large-data strategies. Earlier release downloads have not been rebuilt for this update; use the accepted source above.
