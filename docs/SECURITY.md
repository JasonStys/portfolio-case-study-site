# Security and privacy model

## Trust boundaries

1. Authored case studies and curation are reviewed repository content.
2. Cached GitHub responses are external data even though they describe public repositories.
3. Build dependencies and GitHub Actions are supply-chain inputs.
4. Generated static files cross into the public Pages origin.
5. URL query parameters and downloaded search JSON are untrusted in the browser.

## Threat analysis

| Threat                                          | Control                                                                                             | Residual risk                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Script/markup injection through repository text | Astro escapes rendered values; JSON cache is validated; no dynamic HTML assignment in browser code. | A framework escaping defect could still affect output.                  |
| Query-driven DOM injection                      | Filter text is never inserted as markup; it is tokenized and compared to known IDs.                 | Browser extensions can modify the page.                                 |
| External API outage or rate limit               | Build consumes a checked-in cache; refresh is explicit and separate.                                | Cache facts can become stale.                                           |
| Malicious metadata refresh                      | Fixed owner/name allowlist, HTTPS GitHub URLs, public/active checks, diff review.                   | A compromised GitHub account could publish misleading public metadata.  |
| Credential disclosure                           | Token read only from `GITHUB_TOKEN`; validators scan common secret shapes; no runtime secrets.      | Pattern scans cannot identify every secret format.                      |
| Dependency compromise                           | Exact lock, pinned installer approval, `npm ci`, audit, Dependabot, dependency review, CodeQL.      | Audits cannot detect every zero-day or maintainer compromise.           |
| Workflow substitution                           | Every third-party Action is pinned to a full commit SHA; default token permission is read-only.     | A compromised pinned commit or runner image remains possible.           |
| Pages deployment forgery                        | OIDC Pages deployment, protected environment, deployment depends on all required jobs.              | Repository administrators can change workflow policy.                   |
| Personal-information oversharing                | No résumé PDF, email, phone, contact form, analytics, cookies, or private repository inventory.     | Public GitHub and LinkedIn profiles remain externally controlled.       |
| Tabnabbing                                      | External links do not open new tabs.                                                                | Users may open them manually in a new tab.                              |
| Denial through enormous catalog                 | Checked-in bounded file, asset budgets, 90-day cache policy, static deployment.                     | A maintainer can intentionally enlarge authored content until CI fails. |

## Browser policy

The site performs one same-origin fetch for the precomputed search index on the project page. It does not use `eval`, `new Function`, `innerHTML`, `outerHTML`, remote fonts, analytics, service workers, local storage, cookies, or a contact-form endpoint.

GitHub Pages controls response headers. A future custom-domain deployment should add a tested Content Security Policy, `Permissions-Policy`, `X-Content-Type-Options`, and strict transport configuration at the hosting layer.

## Data policy

Only synthetic examples, authored descriptions, and public repository metadata are allowed. Private repository names, customer information, credentials, application details, interview details, and unreviewed résumé files are prohibited.

## Reporting

The root `SECURITY.md` explains private reporting. Do not place exploit details or personal information in a public issue.
