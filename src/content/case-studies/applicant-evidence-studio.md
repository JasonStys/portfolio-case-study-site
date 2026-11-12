---
title: "Source-linked skills review with explicit uncertainty"
repository: "https://github.com/JasonStys/applicant-evidence-studio"
summary: "Compare cited applicant records against one rubric and retain private evidence, unknowns and human-reviewed coaching exports."
role: "Privacy-aware full-stack and evidence-system engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Same-rubric evidence comparison",
    "Browser-held vault key",
    "Exact private snapshot export",
    "Three-OS portable release",
  ]
featuredOrder: 6
---

## Current usable application — 12 November 2026

Two exact applicant records can be compared against one rubric with citations, unknowns, clarification prompts and private exports. Browser-side encrypted workspaces now run inside a downloadable local application with verified resources, exclusive profile ownership and compatible account storage.

Supports consistent evidence review without inventing degrees, converting education into employment or handing a hiring decision to the software.

The current [version 0.3.1 release](https://github.com/JasonStys/applicant-evidence-studio/releases/tag/v0.3.1) identifies [its packaged runtime source](https://github.com/JasonStys/applicant-evidence-studio/tree/c3d44882ee39209b3a9fbbe884e1177cc78359e5). The matching [illustrated Windows guide](https://github.com/JasonStys/applicant-evidence-studio/blob/44504b6bfc28cb7a76fe1d6e5e2bc9f8e0121973/docs/reports/windows-application-guide-0.3.1.docx) and [guide identity record](https://github.com/JasonStys/applicant-evidence-studio/blob/44504b6bfc28cb7a76fe1d6e5e2bc9f8e0121973/docs/reports/windows-application-guide-0.3.1.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows x64 and the complete checksummed release. Use authorized sourced records, your local account and separate vault phrase. Keep recovery material and plaintext downloads private; no external provider or system Python setup is needed for local comparison. A local browser is required.

**Current limits.** Missing evidence remains unknown ability. Human reviewers must check sources; exported JSON is plaintext, and local encryption does not protect an unlocked machine from its OS owner. A reviewer must make the decision. Capture/download comparisons before locking or changing context; account privacy does not make plaintext exports confidential on an unlocked machine.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

## Problem

Keyword screening can miss strong project evidence or invent conclusions about transfers, unfinished programs and ambiguous education records. Reviewers need to see the supporting work and what remains unknown. Applicants need factual coaching that does not manufacture qualifications.

## Constraints

Only authorized records may be processed. Identity and sensitive traits must not affect scores, and education must not become inferred degrees or paid years. Private comparison must use the unlocked browser workspace without exporting plaintext to a service or changing account data.

## Design

Normalized records keep skills, sources, education and employment separate. A constrained rubric produces advisory evidence coverage and coaching. Identity changes do not improve scores, and coursework never becomes fictional paid experience.

The new workflow captures exactly two authorized records against the same rubric. A reviewer sees criterion targets, strongest reviewed citations, source warnings, excluded unreviewed claims and clarification prompts. Original applications remain available for inspection. Optional observations and an exact JSON snapshot can be downloaded; selection order is preserved without choosing a winner.

Private-account comparison uses one cloned, unlocked browser workspace, with no plaintext comparison endpoint, outside AI request or workspace write. Legacy developer mode reads both revisions and the rubric in one SQLite snapshot. Context changes, edits, locks and stale asynchronous results invalidate the view. Opening an original record clears observations, so the UI advises exporting first.

## Verification

Independent rubric calculations and concurrent SQLite fixtures retain the source privacy and consistency checks. A new read-only three-OS workflow downloads independently hash-pinned public 0.3.0 archives, verifies their internal executable, extracts into a new working directory and drives their actual embedded WebCrypto UI with disposable synthetic accounts. It checks exact comparison hashes, assessment parity, ciphertext-only storage, unchanged capture revisions, locking, reopen and unauthenticated denial; outside browser requests are blocked.

## Measured result

The earlier comparison/portable-acceptance source passed **129 Python tests at 88.70% combined statement/branch coverage**, retaining the original floor. Three independent compiled-domain oracles and the existing 36 legacy / 28 private-account browser journeys remain required. Fifty new metadata/archive/release cases reject altered public bytes, unsafe extraction, incomplete workflow identities and invalid draft publication.

The actual published Windows 0.3.0 UI journey took 9.148 seconds before teardown under its recorded local conditions. Exact record hashes, Python assessment parity, ciphertext-only writes, unchanged capture revision, lock/reopen and a separate unauthenticated context passed, with zero outside requests and zero automated axe findings in the tested comparison card. This observation is not a general performance or accessibility guarantee.

Accepted source: [`f10b42ce29d665c89556b83ce9b36094bba672a1`](https://github.com/JasonStys/applicant-evidence-studio/tree/f10b42ce29d665c89556b83ce9b36094bba672a1). The [validation report](https://github.com/JasonStys/applicant-evidence-studio/blob/f10b42ce29d665c89556b83ce9b36094bba672a1/docs/reports/portable-acceptance-2026-11-09.md) records executed scope and conditions. Exact-source main checks passed: [Published portable acceptance](https://github.com/JasonStys/applicant-evidence-studio/actions/runs/42749422809), [Validate](https://github.com/JasonStys/applicant-evidence-studio/actions/runs/42749422853).

[Version 0.3.0 downloads](https://github.com/JasonStys/applicant-evidence-studio/releases/tag/v0.3.0) contain application source [`71d51b1fcd228f89d3ff81ee166bee2ce37d7a60`](https://github.com/JasonStys/applicant-evidence-studio/tree/71d51b1fcd228f89d3ff81ee166bee2ce37d7a60). The [release workflow](https://github.com/JasonStys/applicant-evidence-studio/actions/runs/42728346654) passed its documented native gates. See the [dated download snapshot](/portfolio-case-study-site/downloads/history/2026-11-10/) for those platforms, file types, full checksums and runtime requirements. That 0.3.0 application release remains at its original source `71d51b1fcd228f89d3ff81ee166bee2ce37d7a60`. The newer [three-OS published-byte acceptance](https://github.com/JasonStys/applicant-evidence-studio/actions/runs/42749422809) uses separately identified [verifier source](https://github.com/JasonStys/applicant-evidence-studio/tree/f10b42ce29d665c89556b83ce9b36094bba672a1); no public application assets were replaced.

## Subsequent security review

Full-main CodeQL found a genuine development-indexer read race and two findings
requiring trust-boundary review. The indexer now reads one bounded descriptor,
with real replacement, growth, partial-read, UTF-8 and error fixtures. Dedicated
Worker messaging was checked in actual browsers; fixed-authority GitHub requests
were exercised through the real HTTPX URL parser with hostile URL and redirect cases.
The revised local gate passed 158 Python tests at 88.70% combined coverage, alongside
the separate browser, native and published-byte acceptance lanes.

The [finding review](https://github.com/JasonStys/applicant-evidence-studio/blob/f75bee5572afe65baebe26c00d0e86e2983d1527/docs/reports/codeql-findings-2026-11-10.md)
retains the actual initial flows, corrective tests and individual false-positive
dispositions. The genuine alert closed as fixed; two raw results remain documented
with zero open default-branch alerts. This is a reviewed source-security update,
not a replacement of the existing 0.3.0 application bytes or a fairness certificate.
The documentation downloads below identify their own source and validation scope.

## Limitations

Human hiring decisions and original-source review remain essential. Coverage is neither suitability nor a fairness or legal-compliance certification. Comparison exports are unencrypted private files: evidence summaries, labels and observations can identify people despite omitted names. No new sharing or reviewer roles are supplied. Portable binaries are unsigned; vault security depends on the local OS and retained recovery material. Public hosting is not provisioned.
