<!-- File: docs/reports/portfolio-sync-2026-10-22.md; Purpose: reviewed integration and validation trail by Jason Stys. -->

# Portfolio synchronization — 2026-10-22

## Content and acceptance scope

Adds the seven reviewed drone repositories to the canonical 67-project catalog,
README summary, search facets and a dedicated drone-safety collection. Four
highlights emphasize simulator integration, independent fault recovery, verified
video masking and evidence-bound maintenance. The first six broad featured cases
and all 14 space/energy entries retain their existing priority.

New checks cover exact collection membership/order, searchable evidence, restored
domain filters, no-JavaScript rendering, sitemap discovery, accessibility and
mobile overflow. Existing unit coverage, three-engine browser and performance
budgets remain enforced. Results are attached to the actual tested revision in
Actions rather than predeclared here.

The expanded catalog initially exceeded the existing 55,000-byte HTML budget.
Compact cards now combine order, language and maturity into one metadata line,
removing duplicated markup without hiding projects or raising the limit. All
projects remain rendered without JavaScript.

By Jason Stys. Source baseline: `fa300b1c0b6ab4331ce20daaa78e7f173ea7a47d`.

Reviewed original proposals: [#15](https://github.com/JasonStys/portfolio-case-study-site/pull/15), [#16](https://github.com/JasonStys/portfolio-case-study-site/pull/16), [#17](https://github.com/JasonStys/portfolio-case-study-site/pull/17). Their commit ancestry is retained in a combined integration candidate; a normal merge is permitted only after that exact candidate passes applicable native workflows. No branch protection, test threshold, security scan or failing step is bypassed. Historical references and intentionally separate experiments are preserved.

Dependency manifests are reconciled as the union of proposed dependency changes, not wholesale replacement with an older branch. Overlapping locks are mechanically resolved with the registry tools. Python package constraints and the actual installed CI/runtime locks are kept consistent; Vitest/coverage providers and CodeQL steps are coordinated. Runtime/data directories are not included in Git.

Validation is commit-specific: use this repository's [Actions](https://github.com/JasonStys/portfolio-case-study-site/actions) and integration PR checks. This record describes the reviewed work, not a claim that a future revision has already passed. Default-branch checks are verified again after merge. Private full audit and Actions backups stay on the owner's PC, outside public source.
