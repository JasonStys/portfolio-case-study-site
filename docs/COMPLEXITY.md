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

At 67 real projects, clarity remains important. Schema 2 uses one dictionary of repository names and integer posting references, reducing repeated wire data without changing AND/facet semantics or curated ordering. Own-property checks prevent inherited object names from being treated as results. The benchmark uses 10,000 projects and 500 queries to check a much larger workload.

## Build and network bounds

- Six broad featured cases, nine reference cases, a complete 14-project space/energy collection, seven-project drone collection, 67 static project details and one updates index.
- Metadata and editorial scope must cover exactly the same 67 approved project names, with no duplicates or extras.
- Source-bound domain updates contain exactly 66 records, 1–4 limitations of at most 400 characters each, and 1–8 repository-bound workflow links. Build validation is linear in the bounded content size; detail lookup uses a build-only map.
- Cache age is bounded to 90 days in CI.
- The build-only search revision hashes the serialized reviewed catalog, metadata time and tokenizer semantic revision in `O(metadata bytes)` time and space; it does not add browser cryptography or runtime network calls.
- Browser filter debounce is 120 ms; no repeating timer or background poll exists.
- Search index is capped at 100,000 bytes in production output.
- Total compressed JavaScript is capped at 32,000 bytes and CSS at 24,000 bytes.
- Largest generated HTML file is capped at 55,000 bytes.
- Lighthouse uses three runs: median performance, worst other category score, and worst timing measurement.

## Download catalog

Let `r` be release records, `a` their application assets and `w` workflow records. Strict field, source and namespace validation uses `O(r + a + w)` work, plus the small canonical-order sort; the bounds are 20 existing releases and 62 actual payloads. Storage is `O(r + a + w)`. Static rendering and JSON serialization are linear in output size. Download metadata creates no repeating timer, hydration bundle or automatic binary fetch. Existing HTML, search and compressed-asset limits remain unchanged.

## When to change the algorithm

Consider sorted posting-list intersection, bitsets, or a dedicated static search library only when measured `p95` query latency exceeds the budget or the search artifact exceeds its size budget. A larger dependency is not justified by hypothetical scale.
