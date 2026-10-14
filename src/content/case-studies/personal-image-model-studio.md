---
title: "A trainable image model with honest quality evidence"
repository: "https://github.com/JasonStys/personal-image-model-studio"
summary: "A real caption-conditioned image-model training and editing workflow with owned synthetic fixtures, held-out evaluation, checkpoint safety, and private local workspaces."
role: "Deep learning and desktop application engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Native diffusion training",
    "Held-out evaluation",
    "Safe checkpoints",
    "Rights-aware dataset boundaries",
  ]
featuredOrder: 3
---

## Problem

A customizable image tool should prove that training, inference, editing, and dataset governance work together. It must also distinguish a trained demonstration model from a useful general-purpose image generator.

## Constraints

Training data needs provenance and permission. Unsafe model serialization must not execute downloaded code. Evaluation data must remain separate from training. Account imports and outside providers must be deliberate.

## Design

Python implements caption embeddings, a compact diffusion UNet, EMA, evaluation, and safetensors checkpoint/resume. A TypeScript interface exposes local generation, image-to-image, inpainting, and expansion; known pixels are preserved. Dataset records track rights, deduplication, splits, and AI-origin quarantine. Local accounts protect locked workspaces; an opt-in account connector is separate from native training.

## Verification

Tests cover training/inference mechanics, malformed checkpoints, dataset boundaries, image edits, account isolation, and actual bundled services. Provider tests do not spend credits or import arbitrary remote artwork. See [private validation](https://github.com/JasonStys/personal-image-model-studio/blob/main/docs/reports/private-validation.md) and the repository's sample evidence.

## Measured result

The reference custom model completed 6,000 CPU optimizer steps on owned procedural shapes with held-out loss and saved checkpoints. Rough generated samples demonstrate the trained pipeline. This is model-execution evidence, not a comparative quality benchmark.

## Limitations

Small synthetic training is not photorealistic generation or broad artistic capability. Imported Stable Diffusion/LoRA support is limited to documented architectures. No third-party training artwork is distributed. CPU desktop packages are unsigned; unlocked content trusts the host OS. Live provider quality and secure public hosting are not claimed.
