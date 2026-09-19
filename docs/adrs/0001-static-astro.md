# ADR-0001: Use Astro static output with a reviewed repository cache

**Status:** Accepted  
**Date:** 2026-09-19  
**Decider:** Repository owner

## Context

The site needs content schemas, static case-study routes, minimal browser JavaScript, strong metadata, inexpensive hosting, and deterministic builds. GitHub repository facts should be refreshable without making page rendering depend on the GitHub API.

## Decision

Use Astro in static-output mode, local Markdown content collections, a checked-in JSON repository cache, semantic HTML, one small TypeScript filtering module, and GitHub Pages deployment after CI.

## Options considered

### Astro static output

| Dimension          | Assessment                   |
| ------------------ | ---------------------------- |
| Complexity         | Low to medium                |
| Runtime cost       | Static files only            |
| Content safety     | Build-time schema validation |
| JavaScript control | Opt-in per feature           |
| Maintenance        | One Node toolchain           |

**Advantages:** Content collections, prerendered routes, TypeScript integration, explicit client boundaries, portable output.  
**Costs:** Framework build dependency and repository-base path discipline.

### React single-page application

| Dimension          | Assessment                            |
| ------------------ | ------------------------------------- |
| Complexity         | Medium                                |
| Runtime cost       | Hydration and routing JavaScript      |
| Content safety     | Requires an additional content layer  |
| JavaScript control | Client-first                          |
| Maintenance        | Broad ecosystem, more runtime surface |

**Advantages:** Familiar interactive model and component ecosystem.  
**Costs:** More JavaScript than the content-focused site needs; worse no-script behavior; metadata and routing require additional work.

### Hand-authored HTML plus build scripts

| Dimension          | Assessment                           |
| ------------------ | ------------------------------------ |
| Complexity         | Low initially, higher with six cases |
| Runtime cost       | Minimal                              |
| Content safety     | Custom validation required           |
| JavaScript control | Complete                             |
| Maintenance        | Repetition and bespoke tooling       |

**Advantages:** Small dependency surface and complete output control.  
**Costs:** Duplicated layouts, harder content consistency, and more custom feed/sitemap/routing work.

### Runtime GitHub API

| Dimension       | Assessment                              |
| --------------- | --------------------------------------- |
| Freshness       | Highest                                 |
| Reliability     | Depends on API, network, and rate limit |
| Reproducibility | Low                                     |
| Privacy         | More third-party requests from visitors |

**Advantages:** Always-current public counters and metadata.  
**Costs:** Failure states, rate limits, client complexity, nondeterministic screenshots, and unnecessary visitor requests.

## Tradeoff analysis

Content quality and deterministic evidence matter more than live star counts. Astro provides a smaller delivery surface than a client application while avoiding duplicated hand-authored pages. A reviewed cache deliberately favors reproducibility over minute-by-minute freshness.

## Consequences

- Every internal URL must respect the repository base path.
- Cache freshness needs an explicit operational check.
- Dynamic contact, authentication, comments, and analytics remain outside version one.
- The built site remains host-portable because it is plain static output.

## Action items

- Keep the metadata cache under a 90-day freshness policy.
- Review case-study claims alongside their linked repository evidence.
- Revisit the static decision only when a measured requirement cannot be met with prerendered output.
