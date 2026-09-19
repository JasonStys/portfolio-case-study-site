# Content maintenance guide

## Add or update a case study

1. Edit a file under `src/content/case-studies/`.
2. Keep the six required sections: problem, constraints, design, verification, measured result, and limitations.
3. Link only to a public repository owned by `JasonStys`.
4. Ensure every measurement can be reproduced from linked source or reports.
5. Run `npm run typecheck`; the content schema catches malformed frontmatter.

Featured order is unique and limited to 1–6. Changing the featured set requires updating the curation entry and ensuring the total remains six.

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
