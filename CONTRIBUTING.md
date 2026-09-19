# Contributing

## Setup

Use Node.js 24 and npm 11 or newer:

```bash
npm ci
npm run dev
```

The site is served under `/portfolio-case-study-site/`, matching GitHub Pages.

## Before proposing a change

Run:

```bash
npm run format
npm run code-index
npm run file-catalog
npm run benchmark
npm run verify
npm run test:e2e
npm run lighthouse
npm run audit
```

New case studies must follow the existing problem, constraints, design, verification, measured result, and limitations structure. Use only public-safe synthetic examples. Never add employer code, customer data, private credentials, or claims that the checked-in evidence does not support.

## Commit scope

Keep content, behavior, dependency, and generated-evidence changes reviewable. Explain any budget adjustment with a before/after measurement and update the relevant ADR or report.
