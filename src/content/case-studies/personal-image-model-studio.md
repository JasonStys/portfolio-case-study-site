---
title: "Reviewable datasets before custom image-model training"
repository: "https://github.com/JasonStys/personal-image-model-studio"
summary: "Review datasets, train compact CPU diffusion models and compare learned generation in a private desktop workspace."
role: "Deep learning and desktop application engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  - "121 core/security/account tests"
  - "20 private browser journeys"
  - "Verified private image previews"
  - "Explicit read-only sample bounds"
featuredOrder: 3
---

## Current usable application — 12 November 2026

Dataset provenance, captions, split integrity and similarity review now lead into actual compact CPU diffusion training, learned generation and retained feedback. A portable app provides native Open, Help and completion-aware Quit controls while keeping datasets, weights and history in private local accounts.

Connects data review to an inspectable training and generation workflow instead of treating a sample image or declared rights as proof of model or dataset quality.

The current [version 0.3.1 release](https://github.com/JasonStys/personal-image-model-studio/releases/tag/v0.3.1) identifies [its packaged runtime source](https://github.com/JasonStys/personal-image-model-studio/tree/fb62b95a291ed2370d639e958d6f3039a7cdf0b6). The matching [illustrated Windows guide](https://github.com/JasonStys/personal-image-model-studio/blob/d3449630cdeaf87f8098bafcbe5a80f14b3a0d47/docs/reports/windows-application-guide-0.3.1.docx) and [guide identity record](https://github.com/JasonStys/personal-image-model-studio/blob/d3449630cdeaf87f8098bafcbe5a80f14b3a0d47/docs/reports/windows-application-guide-0.3.1.json) describe actual Windows launch-and-use acceptance, prerequisites, saving and exit. Later repository checks and the guide publication commit remain separate from the released runtime. Additional operating-system assets do not establish execution on this Windows PC. Packages are unsigned.

**Requirements.** Windows x64 and the complete checksummed portable bundle. CPU ML/runtime are included; no provider or pretrained weights ship. Use approved images and your local account/vault phrase. Larger SD/LoRA workflows need the separate trusted full-source runtime. A local browser is required.

**Current limits.** Compact models and synthetic training runs do not establish photorealism or general model quality. Optional larger runtimes and providers require separate trusted configuration. The downloadable edition includes compact CPU ML, not pretrained weights or the optional full SD/LoRA environment. Protect the separate vault phrase; recovery of login access cannot recover that phrase.

The measurements, version numbers and links in the engineering narrative below retain their dated earlier source scopes. They are not relabeled as fresh results for this current package.

## Problem

A custom image-model tool needs more than a training button. An artist or model trainer should know whether captions are missing, which origins are declared, whether enough training/validation examples exist and whether similar images may cross those splits. A tool must also distinguish a small learned demonstration from a capable general generator. Version 0.3.0 adds a practical review between authorized import and deliberate training, while preserving the existing real compact diffusion, generation, editing and checkpoint workflows.

## Constraints

Use owned or authorized data; account access alone does not establish training rights. Review must not silently relabel images, change splits, approve data, start training or adjust model weights. Similarity is uncertain and expensive, so inspection scope, unchecked images, errors and omitted candidate pairs must be visible. Reports/previews must obey the same login, vault and account boundaries as the source data. A changing UI selection must not expose the prior report as the new selection's evidence.

## Design

Python handles image normalization, dataset identities, model learning and the local service; TypeScript/HTML/CSS provide the application workflow; SQL indexes account-scoped records. The existing native model uses caption embeddings, a compact diffusion UNet, EMA, held-out evaluation and safe checkpoint/resume. CPU application downloads include the native model workflow. Classic Stable Diffusion/LoRA requires a configured full-source runtime and explicit authorized compatible models; no arbitrary executable model import or default weight download is added.

A user imports a file-picker ZIP with image/caption/provenance sidecars, chooses **Dataset to review**, then inspects a read-only dossier. The full metadata summary covers caption completeness, declared origins/license notes, eligible split sizes and the existing eight-training/two-validation minimum. AI-origin quarantine and empty-caption exclusions remain unchanged. Dataset/report SHA-256 identities bind the evidence without claiming a legal attestation or quality score.

The integrity/similarity scan is bounded to **64 eligible images, 32 MiB encoded bytes and 16,777,216 decoded pixels**. Hash-ordered sampling interleaves both splits when available. File and normalized-pixel identities are checked; absent/changed/unsafe samples are explicit errors. A 64-bit horizontal grayscale difference hash identifies possible cross-split matches at Hamming distance ≤4. At most 32 pairs are shown, with candidate totals, omitted counts and unverified-image counts.

Users preview actual candidate pairs through known-ID, authenticated, metadata-free PNG thumbnails of at most 192px. User-controlled names are rendered as text. No caller-selected machine path becomes a preview. The user can download the exact reviewed JSON; source artwork and credentials are not embedded in that export. Changing selection revokes preview URLs, removes the previous export and rejects delayed responses. The workflow never changes training selections, pixels, captions, splits, quarantine or weights.

Default local accounts protect locked workspaces with a separate vault phrase. Unlocked ML work necessarily uses plaintext on the trusted device; OS administrators or a compromised host can access it. There is no developer access API or automatic outside upload. Plaintext report exports are an explicit user choice. The update does not migrate private-store schemas or alter older published release assets.

## Verification

Sixteen new regression cases include an independent rising/falling-gradient hash oracle; actual imported near-identical owned images on opposite deterministic splits; byte-for-byte unchanged dataset records; corrupt/missing source handling; AI/uncaptioned exclusion; malformed metadata and identities; bounded JSON; actual maximum-size raster sampling; metadata-free thumbnail validation; and account lock, isolation and encrypted reopen.

The real browser trainer journey performs registration, vault derivation, selected ZIP upload/import, dataset review, private pair previews and JSON download/content checks. It confirms that review selects no training data, then holds a genuine response while the user changes the dataset and verifies that stale results cannot populate or export. Accessibility/viewport and no-external-request checks run across desktop engines and mobile emulation. Desktop/mobile screenshots were visually inspected.

Accepted-source evidence: [source validation report](https://github.com/JasonStys/personal-image-model-studio/blob/3e02b1f34b7c4b968491952fdc2bbd7a93849b7f/docs/reports/practical-workflows-2026-11-09.md), [hosted validation](https://github.com/JasonStys/personal-image-model-studio/actions/runs/42729063623), [real ML acceptance](https://github.com/JasonStys/personal-image-model-studio/actions/runs/42729063623), [verified three-platform native release build](https://github.com/JasonStys/personal-image-model-studio/actions/runs/42730050386).

## Measured result

- **121 local core/security/account tests** passed, including **16 new review cases**, with resource warnings treated as errors.
- **20 private account browser journeys** and **8 preserved single-user browser journeys** passed across Chromium, Firefox, WebKit and mobile emulation. A final four-profile screenshot subset repeated the new review journey; it is not four additional unique workflows.
- The owned gradient fixture produced one training and one validation image, **one cross-split candidate**, **zero sampled integrity errors** and an honest **insufficient-training-data** result. Files remained byte-for-byte unchanged. Previewed images were actual authorized pixels, not model-generated placeholders.
- The default pixel-budget test verified four actual **2048×2048** images and left the fifth explicitly unverified at **16,777,216 decoded pixels**. The workflow observed zero outside requests, zero automated review accessibility violations and no mobile page overflow.
- The new review module's local line coverage was **92.06%**. The core-only lane covered **1,679/2,699 executable lines (62.21%)** across the repository, including ML-only modules not executed locally; this is not full ML coverage. Branch coverage was not measured. Ruff, formatting, TypeScript/Vite, 56 source indexes, pip check and dependency audits passed locally.

Existing reference evidence records a model trained for 6,000 CPU optimizer updates on owned procedural shapes, with rough learned samples. That is retained earlier execution evidence, not training rerun for this change. At the accepted source, the hosted genuine ML journey passed actual optimization, generation, encrypted reopen and the new read-only dataset review. All three native package builds and publication passed. This hosted acceptance is separate from the earlier 6,000-update reference model.

Earlier published downloads: [0.3.0 CPU application and checksums](https://github.com/JasonStys/personal-image-model-studio/releases/tag/v0.3.0). Older 0.2.0 assets and notes remain unchanged.

## Subsequent security review

The full-main scan exposed a metadata-index CLI read race, corrected by reading
once and treating only an actual missing-file error as a rebuild condition.
Real CLI regressions cover a disappearing output, access denial and I/O failure.
Valid-schema private API tests additionally verify account confinement and reject
foreign paths, sibling-prefix lookalikes, traversal and another account's records
before dataset/model readers are reached.

The [full finding review](https://github.com/JasonStys/personal-image-model-studio/blob/4b2e14404bb9f57c038f63c21b952bf8c4f7b6af/docs/reports/codeql-main-triage-2026-11-09.md)
records the actual source/sink flows and all original locations. The genuine CLI
alert closed as fixed. Twenty-nine raw Python path-flow results retain individual
false-positive dispositions against the documented trusted-operator and private
account boundaries; zero open alerts does not mean zero raw results. The corrected
local core/privacy lane passed 130 tests at 62.50% statement coverage, explicitly
excluding heavy ML execution from that local observation. Hosted ML/native checks
remain separate evidence, and the existing 0.3.0 download bytes remain unchanged.

## Limitations

Grayscale similarity can collide on flat fields or colors and miss crops/semantic changes. Candidates are not proof of duplication/leakage, a semantic quality score, an AI-origin detector or legal rights verification. Only the displayed bounded sample receives integrity/similarity checks; no-candidate results do not certify an entire corpus. Origin/license metadata remains an operator declaration.

The compact model is not a photorealistic or broadly capable generator. Compatible imported model families are explicit. No third-party artwork or pretrained weights are distributed. This local environment did not include Torch/ML extras, new model training, native packaging or GPU-quality evaluation; the linked hosted ML/native gates passed at the accepted source, separately from this local core-only lane. There is no manual screen-reader or physical mobile-device claim. Portable applications are unsigned; secure public hosting, signed/notarized installer acceptance and protection from a compromised OS are not claimed.
