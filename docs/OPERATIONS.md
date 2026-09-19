# Operations runbook

## Purpose

Use this runbook to refresh repository facts, verify a release, deploy through GitHub Pages, diagnose a failed workflow, or roll back a bad publication.

## Prerequisites

- Node.js 24 and npm 11 or newer.
- GitHub CLI authenticated to the repository for metadata refresh or remote checks.
- A clean worktree before release.
- GitHub Pages configured with GitHub Actions as its source.

## Refresh public repository metadata

1. Export a short-lived token only into the process environment.
2. Run `npm run metadata:refresh`.
3. Remove the token environment variable.
4. Review every changed description, language, topic, and timestamp.
5. Run `npm run metadata:check` and `npm run verify`.

The refresh script requests only the 20 selected public repositories and their language maps. It does not enumerate or record private repositories.

## Release procedure

1. Confirm `git status --short` is empty before beginning.
2. Run `npm ci` from the exact lockfile.
3. Run the full commands in `DEPLOYMENT_CHECKLIST.md`.
4. Push `main`.
5. Wait for quality, all three browser engines, Lighthouse, CodeQL, and Pages deployment.
6. Open the environment URL from the deployment job.
7. Smoke-test overview → project filter → case study → repository.
8. Confirm `sitemap.xml`, `feed.xml`, and `search-index.json` return successfully.

## Failure triage

### Content or type check

Read the exact Astro diagnostic. Verify frontmatter against `src/content.config.ts`, then check curation/cache name alignment.

### Broken generated link

Run `npm run build && npm run dist:check`. Inspect the source route and use `withBase` for internal URLs.

### Browser failure

Download the browser evidence artifact. Reproduce with `npx playwright test --project=<browser> --trace on`. Treat a retry as evidence of instability, not a pass to ignore.

### Lighthouse failure

Download all three reports. Compare the median performance score and worst deterministic/timing values. Do not raise a budget without a documented user-facing reason.

### Metadata age failure

Refresh with an authenticated GitHub token, review the diff, and rerun deterministic checks. Do not bypass the age policy by editing only the timestamp.

### Deployment failure

Confirm Pages uses GitHub Actions, the environment is named `github-pages`, and the job has `pages: write` plus `id-token: write`. Quality jobs must succeed first.

## Rollback

1. Identify the last known-good commit from a successful Pages deployment.
2. Create a normal revert commit; do not rewrite public history.
3. Push the revert to `main`.
4. Wait for the complete matrix and new Pages deployment.
5. Smoke-test the restored site and record the cause in the changelog or issue.

The previous static artifact remains available until a new deployment succeeds, so a failed workflow does not replace the live site.
