# Performance report

## Workloads

- Real production catalog: 46 curated repositories, six featured and five reference case studies.
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

Current 46-project validation on Windows x64 / Node 24.18.1, 2026-10-14:
10,000-project build 106.083 ms, query p95 4.615 ms, serialized synthetic index
7.205 MiB. Static output: JavaScript gzip 1,228 B; CSS gzip 4,348 B; largest
HTML 54,588 B; search index 85,367 B. All original byte/time gates passed.
Results below remain the historical first release, not current Lighthouse claims.

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

GitHub Actions ran three fresh desktop Lighthouse sessions on Ubuntu and recorded the conservative aggregate below. Category values are the minimum score across runs except performance, which uses the median; timing values are the worst run.

| Lighthouse metric        | Result |    Budget |
| ------------------------ | -----: | --------: |
| Accessibility            |   1.00 |     ≥1.00 |
| Best practices           |   1.00 |     ≥0.95 |
| Performance              |   0.99 |     ≥0.92 |
| SEO                      |   1.00 |     ≥0.95 |
| First Contentful Paint   | 756 ms | ≤1,800 ms |
| Largest Contentful Paint | 906 ms | ≤2,500 ms |
| Total Blocking Time      |   0 ms |   ≤200 ms |
| Cumulative Layout Shift  |   0.00 |     ≤0.05 |

`npm run benchmark` writes the machine-readable search report to `docs/reports/generated/search-benchmark.json`. Generated-output validation prints exact asset sizes. Lighthouse runs three independent production sessions in CI, stores the raw reports and conservative summary under `.runtime/lighthouse/`, and fails the release when any budget is missed.
