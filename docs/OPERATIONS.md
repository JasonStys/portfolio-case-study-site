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

The refresh script requests only the 60 approved public repositories and their
language maps. It does not enumerate or record private repositories. New names
must first be approved in the priority and curation files; refresh then fetches
their real metadata. Run `npm run summary:sync` after changing reviewed ordering
or outcomes, and review its generated README table before committing.

## Release procedure

1. Confirm `git status --short` is empty before beginning.
2. Run `npm ci` from the exact lockfile.
3. Run the full commands in `DEPLOYMENT_CHECKLIST.md`.
4. Push `main`.
5. Wait for quality, all three browser engines, Lighthouse, CodeQL, and Pages deployment.
6. Open the environment URL from the deployment job.
7. Smoke-test overview → project filter → case study → repository.
8. Confirm `sitemap.xml`, `feed.xml`, and `search-index.json` return successfully.
9. Set `PORTFOLIO_BASE_URL=https://jasonstys.github.io/portfolio-case-study-site/`
   in the process environment and run `npm run test:e2e` for the full deployed-site
   acceptance suite. Remove the variable afterward to restore local preview mode.

The search index uses schema 2 with a revisioned request URL, so new client code
does not reuse an older cached schema. This is a public static portfolio; there
are no visitor accounts, private project data, remote AI calls or analytics.
Check Actions storage before remote validation; do not delete runs, artifacts or
caches, or alter retention policy, without fresh authorization.

## Failure triage

### Content or type check

Read the exact Astro diagnostic. Verify frontmatter against `src/content.config.ts`, then check curation/cache name alignment.

### Broken generated link

Run `npm run build && npm run dist:check`. Inspect the source route and use `withBase` for internal URLs.

### Browser failure

Download the browser evidence artifact. Reproduce with `npx playwright test --project=<browser> --trace on`. Treat a retry as evidence of instability, not a pass to ignore.

### Lighthouse failure

Download all three reports. Compare the median performance score and worst deterministic/timing values. Do not raise a budget without a documented user-facing reason.

Astro permits one preview process per checkout. Stop only a preview you own
before running Lighthouse (which starts its own preview), and run browser and
Lighthouse checks sequentially. Do not run another build or `npm run verify`
while a preview-based suite is reading `dist/`: rebuilding replaces that output
and can cause temporary 404s. CI jobs use separate runner checkouts.
Keep the browser sandbox enabled; a launcher
permission problem is not a reason to disable operating-system protections.

CI Lighthouse uses the Ubuntu runner's installed Google Chrome at
`/opt/google/chrome/chrome`, prints its version and keeps its sandbox enabled.
This uses the OS-integrated browser instead of a separately downloaded Chromium
path that may not have Ubuntu's user-namespace permission. Launcher errors now
include Chromium stderr in the job log. Do not change AppArmor, sysctl settings,
permissions or sandbox flags to make a check green. See the
[official browser troubleshooting guidance](https://pptr.dev/troubleshooting#issues-with-apparmor-on-ubuntu)
and [runner image installation source](https://github.com/actions/runner-images/blob/main/images/ubuntu/scripts/build/install-google-chrome.sh).
The three-engine acceptance suite still uses its lockfile-selected Playwright
browsers; Lighthouse's system Chrome version is supplied by the runner image.

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
