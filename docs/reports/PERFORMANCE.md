# Performance report

## Workloads

- Real production catalog: 20 curated repositories and six case studies.
- Synthetic search benchmark: 10,000 projects, four primary-language groups, 137 cohorts, and 500 deterministic text-plus-facet queries.
- Browser performance: three new desktop Lighthouse sessions against production output.

## Budgets

| Metric                     |    Budget |
| -------------------------- | --------: |
| Search index build         | ≤1,500 ms |
| Search query p95           |    ≤12 ms |
| Synthetic serialized index |   ≤12 MiB |
| Production JavaScript gzip |   ≤32 KiB |
| Production CSS gzip        |   ≤24 KiB |
| Largest HTML route         |   ≤55 KiB |
| Production search index    |  ≤100 KiB |
| Lighthouse FCP worst run   | ≤1,800 ms |
| Lighthouse LCP worst run   | ≤2,500 ms |
| Lighthouse TBT worst run   |   ≤200 ms |
| Lighthouse CLS worst run   |     ≤0.05 |

## Release-candidate measurements

Measured on Node.js 24.18.1 on Windows x64 on 2026-09-19:

| Metric                     |    Result | Budget      | Margin |
| -------------------------- | --------: | ----------- | ------ |
| Search index build         | 117.98 ms | ≤1,500 ms   | 92.13% |
| Search query p50           |   2.30 ms | Informative | —      |
| Search query p95           |   3.66 ms | ≤12 ms      | 69.52% |
| Synthetic serialized index |  7.20 MiB | ≤12 MiB     | 39.96% |
| Production JavaScript gzip |   1,228 B | ≤32 KiB     | 96.25% |
| Production CSS gzip        |   4,348 B | ≤24 KiB     | 82.31% |
| Largest HTML route         |  33,570 B | ≤55 KiB     | 38.96% |
| Production search index    |  35,611 B | ≤100 KiB    | 64.39% |

`npm run benchmark` writes the machine-readable search report to `docs/reports/generated/search-benchmark.json`. Generated-output validation prints exact asset sizes. Lighthouse runs three independent production sessions in CI, stores the raw reports and conservative summary under `.runtime/lighthouse/`, and fails the release when any budget is missed.
