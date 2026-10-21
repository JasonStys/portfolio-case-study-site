# Content maintenance guide

## Add or update a case study

1. Edit a file under `src/content/case-studies/`.
2. Keep the six required sections: problem, constraints, design, verification, measured result, and limitations.
3. Link only to a public repository owned by `JasonStys`.
4. Ensure every measurement can be reproduced from linked source or reports.
5. Run `npm run typecheck`; the content schema catches malformed frontmatter.

Featured order is unique and limited to 1–6. Changing the featured set requires updating curation and frontmatter together, with the first six names in `src/data/portfolio-priority.json` matching those featured orders. Nonfeatured reference cases omit `featuredOrder`; retain useful old case URLs rather than deleting their evidence. The build rejects missing case routes and mismatched repository/order fields.

The canonical priority list must cover every curated repository exactly once. Reorder by integration depth, reproducible evidence, and role coverage—not stars, inflated claims, or manufactured activity. Update the README table in the same change. GitHub's complete Repositories tab has no custom editorial ordering; use the six profile pins and this full catalog.

`src/data/space-systems.ts` defines the complete 14-project civilian space/energy collection and four specialist highlights. It is shared with main curation, the homepage and `/space-systems/`. Keep its reviewed order aligned with positions 7–20 of the canonical priority list; tests verify exact membership, order, case routes and domain-filter results. Broad featured cases remain six; specialist references do not imply new profile pins, military affiliation or operational experience.

After editing curation or ordering, run `npm run summary:sync`. The literal-AST generator changes only the README's canonical ordered table. `npm run summary:check` is a required verification gate and fails on drift. It never evaluates arbitrary curation code. For a newly approved repository, metadata refresh can fetch missing allowlisted entries; check-only mode still requires the exact complete public allowlist. Unreviewed extras and private/archived repositories remain rejected.

New case measurements must point to a published source/release and identify them as historical results, not freshly executed certifications. Preserve synthetic/public-data distinctions. This update reruns portfolio checks, not 14 simulation suites or any real mission equipment.

## Refresh GitHub facts

```bash
GITHUB_TOKEN=... npm run metadata:refresh
npm run metadata:check
```

On PowerShell:

```powershell
$env:GITHUB_TOKEN = gh auth token
npm run metadata:refresh
Remove-Item Env:GITHUB_TOKEN
```

The token is read from the process environment and is never written. Review the diff: descriptions, topics, primary languages, and timestamps are externally controlled public data and must be treated as untrusted content.

The refresh script preserves reviewed technology annotations already present in the cache, then unions GitHub-detected languages. Update role/domain/outcome editorial data only in `project-curation.ts`.

## Writing rules

- Prefer concrete system behavior over claims such as “scalable” or “production ready.”
- State inputs, bounds, failure modes, test evidence, and limitations.
- Use synthetic and public-safe examples.
- Never identify private repositories, customers, employers, credentials, or interview details.
- Avoid exact performance comparisons across machines unless the environment and method are recorded.
- Use sentence case and direct verbs.

## Release sequence

Run formatting, regenerate the code index and file catalog, regenerate the benchmark report when algorithms change, then run the complete verification and browser suites. Follow `DEPLOYMENT_CHECKLIST.md` before pushing `main`.
