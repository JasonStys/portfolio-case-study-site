# Offline Windows portfolio application

The published [1.1.0 native application](https://github.com/JasonStys/portfolio-case-study-site/releases/tag/v1.1.0) packages **this same Astro site**. Browse project details,
search and exact facets, case studies, documentation and recorded evidence without
a web server or an Internet connection. The existing GitHub Pages website and
normal browser behavior remain available.

## Use the portable application

For the published 1.1.0 application, read the [illustrated Windows guide](reports/windows-application-guide-1.1.0.docx), [paired identity record](reports/windows-application-guide-1.1.0.json) and [installed acceptance report](reports/portfolio-application-1.1.0-2026-11-12.md). They identify the released runtime separately from their later documentation publication.

Extract the complete accepted Windows x64 ZIP into an ordinary directory outside
the source checkout. Open `JasonStysPortfolio.exe`; do not move the executable away
from its accompanying resources. A portable ZIP is not an installer. Publication,
download verification and actual installation are separate acceptance steps.
Packages are unsigned; do not disable OS security protections.

The normal portfolio navigation works unchanged. Native Back, Forward and Overview
controls and the Portfolio menu add application navigation. Downloads use static
twelve-project pages with complete numbered/Previous/Next links; the full JSON
index retains every record and digest. No JavaScript is required for pagination.
Search updates normal
URL queries, and the existing full evidence index remains readable JSON. The visible
offline notice identifies the application version and built source; an explicitly
dirty development snapshot is labeled **local candidate**.

Public HTTPS links show their exact destination in an **Open / Cancel** dialog.
Cancel is the default. Open sends only a link present in the built page's actual
anchor inventory to your default browser. This includes source, contact, release
and primary-reference anchors, rather than a general URL opener. The application
does not fetch current GitHub results, download packages, discover installed apps,
launch other projects or alter their settings. Its evidence is a dated snapshot;
live remote content belongs to the separately opened browser.

Use **Exit application**, the Portfolio menu or normal window Close. An accepted
link/help dialog is retained until it settles, including after repeated Quit/Close.

## Browser profile and recovery

The default profile is under
`%LOCALAPPDATA%\JasonStysPortfolio\portfolio-case-study-site\workspace`.
It is separate from the executable, source tree and your normal browser profile.
It contains a fixed identity marker, current ownership lock and ordinary Chromium
browser state. There are no application accounts, passwords, imported documents or
other-project data stores in this viewer.

The profile is plaintext and belongs to the current OS account. Admission rejects
preexisting directory aliases, hardlinked mutable files, unknown top-level files and
application-resource descendants. A normal exit releases only its own token.
Interrupted or changed ownership is preserved for review, never silently deleted
or reset. Before manually recovering an interrupted lock, establish that its owner
has exited and retain the profile for review. The advanced `--profile ABSOLUTE_PATH`
option selects a separate ordinary empty or identified workspace for testing; it
does not bypass admission. Do not point it at unrelated folders.

These are static namespace and accidental-alias checks within a trusted OS-owner
model. They do not establish multiuser authentication, malicious same-owner race
protection, encryption or general filesystem rollback detection.

## Build and validate from source

Use Node.js 24 and the two exact npm lockfiles. Native build tooling is development
only; no Node.js, Python, IDE or manual server command is needed by a packaged-app
user. Each Windows command below must succeed independently:

```powershell
npm ci
npm ci --prefix desktop
npm run verify
npm run native:policy
npm run native:test
node desktop/tests/electron-faults.mjs .runtime/fresh-native-faults
node scripts/build-native.mjs release/fresh-native
node scripts/accept-native.mjs release/fresh-native/Jason-Stys-Portfolio-1.1.0-windows-x64.zip release/fresh-native/package-integrity.json .runtime/fresh-native-consumer
```

Use fresh outputs; helpers refuse overwrite. Clean builds bind actual Git HEAD and
all authored input hashes. A local investigation can explicitly add `--allow-dirty`
to the build command; hosted builds refuse it. The snapshot records its source and
dirty state, every exact site body/media type and the seven native owner modules.
The builder copies all verified bodies in its packaging hook, verifies the result
and creates a ZIP. The separate integrity record hashes every packaged file.

The consumer checks the ZIP digest, bounded directory and exact ordinary members,
then bounds actual decompression and verifies every body before starting the
relocated executable. It runs the same two-launch GUI journey and hashes all
package files again. Partial outputs are preserved on failure, not reused.

The native workflow retains bounded receipts and screenshots for three days.
The full ZIP is retained only by an explicit successful manual request on trusted
main, for one day. This workflow does not publish, sign, install or update releases.
The original website quality, browser, Lighthouse and Pages gates remain required;
JavaScript/TypeScript analysis retains its original CodeQL identity and a separate
Actions analysis covers workflow source.

## Acceptance boundaries

See the [dated source validation report](reports/offline-native-2026-11-12.md).
Source-window proof, compiled-ZIP proof, hosted scans and an installed default
shortcut are separate observations. Automated public-link acceptance substitutes
only the OS dialog response and browser opener; it does not prove that a specific
default browser opens correctly. Hash/source bindings are consistency evidence,
not publisher signatures. The current target is Windows x64 only.

The native snapshot must not try to embed its own future asset IDs, ZIP hash,
release commit or a future Word digest. Its actual runtime identity is generated at
build time in `SOURCE.json` and displayed by the native notice. A later website-only
evidence update can describe a completed release without relabeling the earlier
immutable native snapshot or historical documentation editions.
