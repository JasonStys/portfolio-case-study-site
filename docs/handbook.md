# Portfolio Case Study Site handbook

By Jason Stys.

Static portfolio with searchable project summaries, case studies, reviewed release downloads and public validation links.

Makes project purpose, engineering decisions and reproducible validation easy to inspect.

## Read the documentation

| Edition                                          | Audience and contents                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [project-guide.docx](reports/project-guide.docx) | User and developer guide: purpose, current usage, design, boundaries and source references. |

The editable Markdown remains the maintenance source. The Word files are readable editions, and the workbook is an evidence index rather than a test runner. See [publication identities and review](reports/publications.json) and the [documentation refresh record](reports/documentation-refresh-2026-11-09.md).

## Current usage and help

[README quick start](../README.md) is the entry point. Use the project-specific guides below before changing inputs, operating modes or deployment assumptions.

### Usage and operations

- [OPERATIONS](OPERATIONS.md)

### Design and contracts

- [ARCHITECTURE](ARCHITECTURE.md)
- [COMPLEXITY](COMPLEXITY.md)
- [RESEARCH](RESEARCH.md)
- [adrs/0001 static astro](adrs/0001-static-astro.md)

### Security and validation

- [SECURITY](SECURITY.md)
- [TESTING](TESTING.md)

## Historical results and reproduction

The reviewed source is [`25b7f796b0ca267d4338fefca070dc07642d071d`](https://github.com/JasonStys/portfolio-case-study-site/tree/25b7f796b0ca267d4338fefca070dc07642d071d). The observed functional workflow baseline is `25b7f796b0ca267d4338fefca070dc07642d071d`; those observations are recorded at `2026-11-10T05:25:40.628667+00:00`. They do not certify an unrun later revision.

- Use the dated reports linked from the README and project guide.
- [Current Actions](https://github.com/JasonStys/portfolio-case-study-site/actions) records later integration checks separately.
- Preserve dated measurements and follow the existing testing guide to reproduce them; a test-source inventory alone does not establish execution.

## Practical boundaries

- A static portfolio does not run or certify the linked applications.

## Maintaining these editions

Update the editable usage/design/test documents first. Rebuild and visually review every Word page and workbook tab before replacing an edition; verify the exact binary digests and evidence source in publications.json. Keep account data, logs with secrets, installed-app state and private test stores out of documentation. Source and release assets retain their existing security and licensing boundaries.
