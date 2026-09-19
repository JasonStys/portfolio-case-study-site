# Deployment and rollback checklist

**Release:** Portfolio Case Study Site  
**Deployer:** Jason Stys  
**Hosting:** GitHub Pages static artifact

## Pre-deploy

- [ ] Worktree is clean and the intended commit is on `main`.
- [ ] Case-study claims and repository cache diff contain only public-safe information.
- [ ] `npm ci` completes from the committed lockfile without unreviewed install-script warnings.
- [ ] `npm run verify` passes formatting, lint, types, unit coverage, search benchmark, build, output validation, repository contract, and generated-doc checks.
- [ ] `npm run test:e2e` passes the locally available production browser suite.
- [ ] `npm run lighthouse` passes three-run category and timing budgets.
- [ ] `npm run audit` reports no high or critical vulnerability.
- [ ] `npm run metadata:check` confirms the cache is within 90 days.
- [ ] Rollback target is the most recent successful Pages deployment commit.

## Deploy

- [ ] Push `main`; do not manually upload `dist/`.
- [ ] Quality job passes.
- [ ] Chromium, Firefox, and WebKit jobs pass without unresolved retries.
- [ ] Lighthouse job passes and uploads evidence.
- [ ] CodeQL completes with no unresolved alert accepted as normal.
- [ ] Pages job deploys the artifact produced from the same commit.

## Post-deploy

- [ ] Open the environment URL reported by `deploy-pages`.
- [ ] Follow overview → project index → filter → case study → repository.
- [ ] Check mobile width, keyboard focus, social metadata source, feed, sitemap, robots, and 404.
- [ ] Confirm repository homepage points to the deployed URL.
- [ ] Confirm no open pull requests, temporary branches, security alerts, or local changes remain.
- [ ] Record final run links and measurements in the handoff.

## Rollback triggers

- Primary navigation, search index, case-study route, or repository links fail.
- WCAG A/AA regression or keyboard trap appears.
- Unreviewed personal, employer, customer, credential, or private-repository data is published.
- Code-scanning or dependency alert affects the published commit.
- Performance falls below the documented budgets.

## Rollback procedure

Create a normal revert of the offending commit, push `main`, wait for the full matrix, and verify the resulting Pages deployment. Never bypass validation by force-pushing or uploading an unverified artifact.
