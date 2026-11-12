# Portfolio reader delivery evidence

The portfolio's own delivery has a separate HTML page at
`/downloads/portfolio/` and complete JSON at `/downloads/portfolio/index.json`.
The ordered 66 other applications remain in `/downloads/index.json`; their
six static pages and the dated 20-project/62-payload history retain their
original identities and budgets.

`src/data/portfolio-delivery.json` is the only input for the own delivery page.
Its closed schema is validated by `src/lib/portfolio-delivery.ts`. A null
`delivery` carries no release or current-guide claims. A populated record needs
all five verified release assets, the GitHub publication timestamp, complete
provider IDs, sizes and SHA-256 values, released-source workflow observations,
and the independently published Word, paired JSON and Markdown report. The
Word and paired JSON each retain their Git blob, full SHA-256 and byte count.
No Markdown sibling is inferred from a Word filename.

The five release roles are the Windows x64 portable ZIP, its checksum,
`package-integrity.json`, `LICENSE.txt` and `INSTALL.txt`. Only the ZIP is an
application payload. `SOURCE.json` is inside the ZIP's verified static site;
it is not a sixth release asset. Asset IDs and publication time must come from
an actual published release readback. A local observation timestamp is not a
substitute for GitHub's `published_at`.

The immutable native snapshot is built at runtime source M. After its actual
downloaded/installed acceptance, guide commit A first publishes the approved
Word, paired JSON and report. Website metadata commit B refers to A's complete
immutable Git identity. A merge commit must preserve A as an ancestor of the
final integration; if the repository cannot preserve that history, publish the
guide and website changes in two reviewed integrations instead. Neither A nor
B rebuilds or relabels the application at M. Its About panel continues to read
the actual packaged identity.

Unit mutations cover the closed schema and independent asset, source, guide
and timestamp bindings. The browser journey reads only actual source data,
checks its null or complete state, all applicable links and full hashes,
separate JSON, original 66-app scope, keyboard-accessible static navigation and
the original 320 px bound. It never downloads a public application or substitutes
fictional metadata into the site.

Repository privacy checks read the earlier `docs/reports/project-guide.docx` and
the independently approved `docs/reports/windows-application-guide-1.1.0.docx`
through `scripts/publication-text.mjs`. Only these exact paths receive bounded
ZIP handling. The reader verifies local/central records, sizes and CRCs; caps
compressed bytes, actual inflation, member count, XML depth and tokens; refuses
macros, embedded objects, DTDs and custom entities; and scans every XML and
relationship part declared by the package's bounded content-type table, including
uppercase or unusual suffixes. Case-equivalent part collisions and unsupported
present binary types are refused. Raw XML plus safely decoded attribute and
displayed text expose numeric references and pretty-printed split runs to the
existing privacy patterns, while preserving literal text-node spaces. No
package content executes or extracts. Other source uses strict UTF-8 admission;
another Word filename is refused. These are source inspection guards, not an
Office exploit scanner or a general hostile-OS-owner security claim.

The paired JSON uses the project's ordinary UTF-8/LF and formatting rules.
Schema, identities, actual Word/JSON hashes and repository privacy checks all
apply; no pair-specific text-conversion or formatting exception is needed.

## Standalone reader layout validation

The first [PR37](https://github.com/JasonStys/portfolio-case-study-site/pull/37)
[Linux Firefox run](https://github.com/JasonStys/portfolio-case-study-site/actions/runs/43174132440/job/131034163394)
passed the 22 existing flows but failed both new own-page
320 px checks with a 329 px body. The trace records loaded page styles, not the
earlier download-return readiness race. Its viewport screenshots and snapshots
do not record the exact lower-page overflowing element, so a particular timestamp
is not asserted as the historical offender.

The standalone component lacked the text-wrapping inheritance supplied by the
project-detail ancestor. It now owns `overflow-wrap: anywhere` and a
`minmax(0, 1fr)` grid track. A real Firefox control with unchanged full timestamp
strings in a wider 20 px monospace text font measured 381 px before the correction;
its captured geometry shows the identity list and implicit grid widening. After
the scoped correction, all six focused Chromium, Firefox and WebKit journeys pass
the original 320 px bounds, including that text-font control. A separate deliberate
`white-space: nowrap` timestamp control still exceeds 320 px in all three engines,
showing that overflow remains detectable rather than clipped. No data is shortened,
font shrunk, global overflow hidden, threshold raised, deadline changed or retry
added. Fresh complete hosted browser acceptance remains required for the corrected
source; this local result is not a claim that a future CI run has passed.
