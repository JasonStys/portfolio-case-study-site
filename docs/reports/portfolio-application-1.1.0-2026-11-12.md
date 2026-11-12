# Portfolio application 1.1.0 — published Windows validation

Observed 12 November 2026. The [published 1.1.0 release](https://github.com/JasonStys/portfolio-case-study-site/releases/tag/v1.1.0) packages the actual portfolio at runtime source [`977637a5cb208ab0181c6d56f960efbcb6adab22`](https://github.com/JasonStys/portfolio-case-study-site/tree/977637a5cb208ab0181c6d56f960efbcb6adab22). The illustrated [Windows guide](windows-application-guide-1.1.0.docx) and its [paired identity and validation record](windows-application-guide-1.1.0.json) describe that application. Their later documentation publication does not rebuild or relabel its native snapshot.

## Practical changes and rationale

The existing ordered 67-project portfolio, role/language/domain filters, search, project details, case studies and historical evidence remain. The Windows application bundles the same static site offline, with Back, Forward, Overview, Help, exact build identity and completion-aware Exit. Its bundled catalog identifies the other 66 delivered applications, their 108 package payloads and 66 current Windows guide pairs; the earlier 20-project/62-payload snapshot remains a separately labeled history view.

This gives reviewers a normal application for reading the portfolio without a development runtime or local web server. The application loads only verified bundled resources. External HTTPS reference, contact and download anchors need an explicit Cancel-default confirmation before the OS browser opener receives the exact approved URL. It does not discover, download, install or launch the other applications.

## Recorded acceptance

| Observation                     | Result and scope                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Released-source main gates      | [CI and Pages](https://github.com/JasonStys/portfolio-case-study-site/actions/runs/43163584918), [compiled Windows application](https://github.com/JasonStys/portfolio-case-study-site/actions/runs/43163585016) and [CodeQL](https://github.com/JasonStys/portfolio-case-study-site/actions/runs/43163584927) passed at the exact runtime source above. All 66 browser cases passed across Chromium, Firefox and WebKit. |
| Processed source analysis       | The full-main JavaScript/TypeScript and Actions analyses contained zero raw results, no processing errors or warnings, and zero open main alerts at observation. Source analysis supplements actual execution; it is not a vulnerability-free guarantee.                                                                                                                                                                  |
| Independent release acquisition | All five published assets were independently downloaded. Provider sizes/digests, matching ZIP checksum and recorded asset identities agreed. The ZIP contains the sole Windows x64 application payload; the other assets are its checksum, complete package inventory, license and instructions.                                                                                                                          |
| Actual installed application    | The unchanged original full consumer completed two launches with normal exits `[0, 0]`, no renderer errors or outside responses. All 196 recorded program files remained unchanged. Both launches used an explicit synthetic durable profile.                                                                                                                                                                             |
| Real workflows and boundaries   | Offline search/filter/detail/case-study and complete paginated download reading, query/fragment/history and keyboard navigation, identity, responsive layout, permission/network/popup refusal, durable restart, and held confirmation through repeated Quit/Close passed. Only the OS confirmation response and external browser opener were substituted in the public-link controls.                                    |
| Individual icons                | Desktop and Start-menu targets, working directories and icons were created and read back. Ordinary default-profile shortcut activation was not performed; it is separate from the tested installed executable.                                                                                                                                                                                                            |
| Illustrated guide               | All four rendered pages were visually reviewed. OOXML validation, the actual installed screenshots, immutable source excerpt, privacy and documented limits passed separate visual and independent source/privacy reviews.                                                                                                                                                                                                |

The provider published this release at `2026-11-12T05:59:08Z`. A local verification or observation timestamp is not substituted for that publication time. These are bounded recorded observations, not automatic monitoring of every future repository or release change.

## Guide identities

| File                                   |   Bytes | SHA-256                                                            |
| -------------------------------------- | ------: | ------------------------------------------------------------------ |
| `windows-application-guide-1.1.0.docx` | 252,969 | `68c36e6cb899dd7ddb7d412cf926ffce2ebfc7501681d3a6378edf21ccde2608` |
| `windows-application-guide-1.1.0.json` |   2,694 | `b396a4c01f966dd0bc44f5366a892930c7effe3a2eb415de6e5a53a31021ab46` |

The screenshots show the installed application's real Home and About views. The paired record binds them and the exact `desktop/operations.cjs` lines 16–32 excerpt to the released runtime source. The earlier `project-guide.docx` and `publications.json` remain unchanged historical editions. Hashes identify bytes; they are not publisher signatures.

## Retained failures and interpretation

The earlier content PR's returned-download Firefox failure exposed incomplete document/style readiness. The test repair requires the exact returned route's document load and stylesheet readiness, while retaining the original one-shot 320 px oracle. A held real stylesheet and a persistent 640 px control separately verify readiness and failure sensitivity. That test change did not alter product CSS.

A subsequent PR run reported a 401 px body after the drone page requested a 390 px viewport. Its cause remains unproven. The assertion still checks the original one-shot measurement; bounded failure-only geometry, style and screenshot evidence is retained if it recurs. It did not recur in the final accepted PR or fresh runtime-main full browser suite. A later reproduction must be investigated rather than described as already fixed.

One earlier local 66-case attempt recorded 65 passes and an operating-system `ENOSPC` failure while closing a WebKit context after the final body assertions. That case and suite remain failed local observations; no complete local 66-case pass is inferred from them. The accepted full hosted browser results above are separate evidence. The transient storage cause was not established, and no trace, retry, time or layout threshold was weakened.

## Usage and limits

Verify and extract the complete unsigned Windows x64 portable ZIP; start `JasonStysPortfolio.exe` with all accompanying runtime files and notices. No system Node.js, Python, Docker, IDE or local server is required. Use the native Exit control and allow accepted confirmations to finish. The [native usage and recovery guide](../native-application.md) explains profile ownership and interrupted-lock handling.

Browser state is plaintext outside installation under the trusted OS owner. Static filesystem admission is not multiuser authentication or protection against a hostile process using that same account. There is no publisher signature, signed installer, automatic updater, clean-machine certification or cross-platform execution claim. External links require a browser and network; acceptance did not prove a particular default browser's real behavior. The app does not certify or operate the linked projects. Ordinary account contents and existing other-project stores were not used in these journeys; Docker was unchanged.

The immutable native About identity remains the released source above. A later website-only release/guide metadata update identifies this documentation's own publication commit separately and does not change the delivered application.
