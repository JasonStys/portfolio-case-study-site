# Complexity and resource bounds

## Search index

Let:

- `n` be project count.
- `w` be the total number of normalized tokens across all indexed project fields.
- `t` be unique tokens.
- `q` be query token count.
- `f` be selected facet count, at most four.
- `m` be candidates before one intersection.

| Operation                |               Expected time |             Space | Bound or rationale                             |
| ------------------------ | --------------------------: | ----------------: | ---------------------------------------------- |
| Normalize one text field |             `O(characters)` |       `O(tokens)` | Unicode NFKC plus one token scan.              |
| Build text postings      |                      `O(w)` | `O(w)` worst case | Each unique project/token pair is stored once. |
| Build facet postings     | `O(n × facets per project)` |        Same order | Four bounded facet families.                   |
| One ordered intersection |                      `O(m)` |       `O(result)` | A `Set` provides expected `O(1)` membership.   |
| Query plus facets        | `O((q + f) × n)` worst case |            `O(n)` | Stable catalog order is preserved.             |
| Render catalog           |                      `O(n)` |  `O(n)` DOM nodes | All cards exist for no-script access.          |

At 20 real projects, clarity dominates micro-optimization. The benchmark uses 10,000 projects and 500 queries to keep the implementation honest at a much larger scale.

## Build and network bounds

- Exactly six featured case-study routes.
- Metadata cache must contain at least one project and no duplicate names.
- Cache age is bounded to 90 days in CI.
- Browser filter debounce is 120 ms; no repeating timer or background poll exists.
- Search index is capped at 100 KiB in production output.
- Total compressed JavaScript is capped at 32 KiB and CSS at 24 KiB.
- Largest generated HTML file is capped at 55 KiB.
- Lighthouse uses three runs: median performance, worst other category score, and worst timing measurement.

## When to change the algorithm

Consider sorted posting-list intersection, bitsets, or a dedicated static search library only when measured `p95` query latency exceeds the budget or the search artifact exceeds its size budget. A larger dependency is not justified by hypothetical scale.
