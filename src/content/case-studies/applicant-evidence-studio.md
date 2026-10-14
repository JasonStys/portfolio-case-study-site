---
title: "Source-linked skills review with explicit uncertainty"
repository: "https://github.com/JasonStys/applicant-evidence-studio"
summary: "A private, advisory skills-review and career-coaching application that links rubric coverage to evidence, preserves education ambiguity, and exports factual resume improvements."
role: "Privacy-aware full-stack and evidence-system engineering"
languages: ["Python", "TypeScript", "SQL"]
evidence:
  [
    "Education-transfer handling",
    "Source-linked rubric coverage",
    "Browser-held vault key",
    "Factual resume exports",
  ]
featuredOrder: 6
---

## Problem

Keyword screening can omit meaningful project evidence or invent conclusions from a transfer, unfinished program, or ambiguous degree record. A review tool should explain what it knows, what it cannot infer, and what requires human verification.

## Constraints

Identity and sensitive traits must not contribute to rubric scores. Coursework must not become fictional years of employment. Unsupported sources must stay unknown. Private-mode documents must not be sent to outside AI or portfolio services.

## Design

Normalized evidence records separate skills, sources, education transfers, and employment duration. A constrained job rubric generates advisory coverage and coaching—not a hiring decision or success probability. Browser-side processing and a browser-held key protect encrypted workspace content; the local service stores only its required operational records.

## Verification

Property and negative tests exercise identity invariance, duplicate evidence, invalid criteria, transfers, parser bounds, stale revisions, private access, and truthful exports. Browser and native package tests use disposable synthetic accounts. See [validation](https://github.com/JasonStys/applicant-evidence-studio/blob/main/docs/validation.md).

## Measured result

Recorded release validation passed 76 Python tests in each of six OS/Python jobs, 28 legacy browser scenarios, and 24 private browser scenarios. The earlier synthetic 10,000-record rubric benchmark measured a 0.35615-second median on the documented machine; it excludes parsing, network, and concurrent-user costs.

## Limitations

Advisory coverage is not employment suitability, a fairness certification, or permission to automate hiring. Private mode makes no outside AI, LinkedIn, or GitHub requests. Unsigned local installers are not public hosting; a compromised OS or future malicious host can affect active browser data. Human review remains essential.
