# Actions maintenance review — 2026-10-14

Reviewed by Jason Stys. Run 38463361380 failed because CodeQL init and analyze
used different releases (4.38.3 and 4.38.1). Both are now pinned to the same
official 4.38.3 commit; grouped proposals and repository validation prevent drift.
Run 38463361111 failed the dependency audit, not the browser application tests.

The exact npm lock graph now resolves patched source-map-js, sharp,
http-cache-semantics and smol-toml. No audit exceptions or weakened thresholds
were introduced. Local Node 24.18.1 verification passed: 12 unit tests, enforced
coverage, formatting/lint/types, search performance budgets, production build,
generated asset budgets, source index and file catalog. npm audit reported zero
known vulnerabilities. Browser engines, Lighthouse and Pages deployment remain
independent native CI gates and are not claimed as locally completed.

Final native workflow links will be appended after verification. Raw historical
evidence stays in a private PC archive, not in this repository.

Primary advisory references: [source-map-js](https://github.com/advisories/GHSA-68fv-2mgg-jv7q),
[sharp](https://github.com/advisories/GHSA-wq5f-xc86-pv6w),
[HTTP cache semantics](https://github.com/advisories/GHSA-ch52-4w7c-c8xp),
[smol-toml](https://github.com/advisories/GHSA-r4xh-jqrq-34v2).
