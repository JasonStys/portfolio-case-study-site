# Offline native portfolio: source validation

## Purpose and boundary

The 1.1.0 candidate makes the actual Astro portfolio available as an offline
Windows application. It preserves the existing GitHub Pages site, static base path,
catalog, search/facets, project/case-study navigation and evidence reader. It is not
a launcher for other applications or an installer/download manager.

These observations are local source validation over the existing `ba56c4eac0ff0b6f77ef2fdd61cb0a592a53159a`
website baseline with explicit uncommitted native changes. They are not a public
release, installed-shortcut or final-catalog acceptance claim. Historical Word,
workbook, release and source evidence remains unchanged. The final native snapshot
must be built separately from the accepted final content source.

## Observed source checks

| Check                                        | Actual observation                                                                                                                                            | Scope                                                                                                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Final complete source verification           | 290 unit tests; 97.76% statements, 97.75% branches, 100% functions, 98.06% lines; all format/lint/type/build/dist/repository/summary/index/catalog gates pass | Includes the original 269 and 21 pagination cases, unchanged 92/88/92/92 floors; largest HTML 50,533 B below 55,000 B; not native-module coverage.                                                     |
| Earlier TypeScript library checkpoint        | 269 tests pass; 97.67% statements, 97.66% branches, 100% functions, 97.98% lines                                                                              | Existing `src/lib` denominator and unchanged 92/88/92/92 floors; not native-module coverage.                                                                                                           |
| Static pagination additions                  | 21 focused unit/HTML-contract cases pass                                                                                                                      | Independent current 12/8 partitions and the 67-entry 12/12/12/12/12/7 boundary; missing/duplicate/dropped-evidence/navigation/sitemap negatives.                                                       |
| Original production browser suite            | 57 pass across Chromium, Firefox and WebKit                                                                                                                   | Original catalog/evidence/source/no-script, keyboard and mobile assertions retained; every current 20-project/62-payload download proof and accessibility assertion now spans all static pages.        |
| Earlier local five-run Lighthouse checkpoint | Performance 0.94; accessibility/best-practices/SEO 1; median FCP 1,158.81 ms, LCP 1,206.99 ms, TBT 0; worst CLS 0; no exceedances                             | Original five cold loads, every sample retained; representative measurements on this host, not a worst-case guarantee.                                                                                 |
| Actual source Electron application           | Two visible launches, normal exits `[0, 0]`, no page errors                                                                                                   | Same Astro output; actual search/facets/query-history, detail, Back, keyboard About/hash, readable evidence JSON, confirmation and retained Quit.                                                      |
| Actual Electron startup faults               | Missing snapshot, occupied profile and unknown profile each exit 1                                                                                            | Only the blocking OS error display is substituted; acquired locks release, existing ownership/unknown sentinels remain.                                                                                |
| Native unit and mutation controls            | 51 pass, no skips: routing, source, profile, real ZIP, failure and workflow fixtures                                                                          | Exact source/header/path/byte admission, actual hardlinks/junctions, retained confirmations, real compressed expansion and negative workflow mutations. This count is separate from the website suite. |
| Manifest-only lock verification              | Both locks resolve offline without installing a tree; no version changes                                                                                      | Development uses existing locked tool packages read-only. Desktop metadata removes unused esbuild nodes. This is not a fresh installed dependency-tree claim.                                          |

The actual native consumer substitutes only the OS link-dialog response and browser
opener when testing Cancel/Open. It does not open the user's default browser or
claim a default-browser integration result. Source-window proof is distinct from
the still-required final compiled/relocated ZIP, hosted analyses, publication and
installed desktop shortcut proof.

Both current npm advisory responses report zero findings at every severity: 576
website dependencies and 284 desktop tooling dependencies. These are locked-graph
audits, not a claim that every upstream Chromium security issue is detectable by npm.

## Failures preserved and corrected

The first source window rendered the site but kept native controls hidden. Its
actual console showed that Astro had inlined the small module, which the strict
native `script-src 'self'` policy correctly blocked. The pinned Astro build's
`vite.build.assetsInlineLimit: 0` keeps actual scripts external. The next full
source-window journey passed without granting inline script execution.

The first full source verification also caught a 55,271-byte downloads page
against the unchanged 55,000-byte HTML maximum. The native component now uses
unique globally prefixed selectors instead of repeated scoped attributes; the
original budget remains unchanged. Native-only responsive styles keep its header
and decorative hero within the actual application viewport. Public website
layout remains unchanged. Static twelve-item download pages preserve every current
record, exact package/source/checksum qualifier and no-JavaScript reading path. The
complete JSON remains authoritative; sitemap and independent DOM contracts require
ordered exact aggregate coverage without omissions/duplicates. Unknown extra page
and duplicate first-page aliases return 404. No delivery facts were refreshed.

Tiny actual ZIP fixtures caught incorrect shared-descriptor stream ownership;
the reader now uses bounded ranges over one retained descriptor, with one close.
Independent review identified possible partial output writes. The complete-write
loop is tested with real three-byte writes and an explicit zero-progress refusal.
A real named-archive replacement checks inode/name binding around the held read.
CRC, body hash, actual expansion, traversal, aliases, fresh-output and directory
count controls retain separate negative oracles.

An actual-workflow mutation also exposed YAML-boolean `if: false` being mistaken
for an absent condition. Property-presence checks now reject both boolean and
string skipped controls, including at the job level. Native Windows commands have
independent steps so a later success cannot hide an earlier native-command failure.
Default artifacts contain only bounded receipts/screenshots/integrity records;
full packages require an explicit successful trusted-main manual request.

## Reproduction and remaining acceptance

See [native usage and reproduction](../native-application.md) and
[the testing strategy](../TESTING.md). The new Windows workflow exercises the actual
ZIP and executable with the same two-launch consumer; JavaScript/TypeScript retains
the original CodeQL check identity and Actions has an independent analysis.
No hosted passing result is inferred from those configurations.

The portable application is unsigned and targets Windows x64. Profile admission is
static accidental-alias/ownership protection within one trusted OS account, not
authentication or protection against concurrent malicious writers with that same
authority. Existing/unknown files are never automatically reset. Hashes are
consistency evidence, not signatures. No local Docker, other application data,
normal browser profile, operating-system service or installed user project is
required or changed by this viewer.
