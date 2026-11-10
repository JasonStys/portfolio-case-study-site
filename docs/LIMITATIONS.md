# Limitations and non-goals

## Current limitations

- Repository facts are snapshots and can be up to 90 days old under policy.
- Search uses exact normalized token intersection; it does not provide stemming, fuzzy spelling, ranking, or semantic retrieval.
- Role and domain labels are editorial classifications, not GitHub-provided facts.
- Automated accessibility evidence cannot replace evaluation with assistive-technology users.
- Layout regression checks geometry rather than cross-platform pixels.
- The public GitHub Pages origin cannot set every desired security header.
- Social artwork is SVG; some social crawlers prefer PNG or JPEG.
- The site does not expose private contact data or a downloadable résumé PDF.
- Project results are portfolio-scale evidence and do not claim commercial production usage.
- The project upgrade snapshot records reviewed commits. It does not continuously
  query GitHub, attest future changes or certify every possible input or use case.
- New source improvements do not automatically rebuild old downloadable releases.
  Each project distinguishes current source, current packages and historical evidence.
- The portfolio presents project evidence; it does not host the applications'
  private services, user accounts, documents, applicant records or model datasets.

## Explicit non-goals for version one

- CMS, database, account, authentication, comments, blog, or contact form.
- Visitor analytics, tracking pixels, personalization, or cookies.
- Runtime GitHub API requests or live star/contributor counters.
- Automated ranking of the owner's projects or skills.
- Private repository discovery or employment/interview tracking.
- A claim that one portfolio can substitute for technical interviews or reference checks.

## Download boundaries

The release index describes the twenty existing downloadable projects rather than promising a native application for every catalog entry. Drone Operations currently ships only its Windows installer. Fourteen space/energy projects supply unsigned Windows ZIP and Linux/macOS tar.gz portable folders; Secure Delivery supplies a bounded Python zipapp with separately installed trusted manager source. Other projects retain their documented library, service, source or PWA distribution.

Application source and acceptance-tool source can differ without changing the published bytes; Applicant Evidence Studio shows both explicitly. Checksums identify bytes, not trusted publishers. The signed delivery example additionally authenticates keyless provenance. Native automated journeys are narrower than OS signing/notarization, clean-machine installer lifecycles, manual assistive-technology review, production readiness, native mobile support or real hardware safety. Check each project's own limits before use.

## Future work requires evidence

Add a feature only when a real evaluator need outweighs the new complexity. Candidate work includes a reviewed raster social card, custom domain security headers, recruiter usability testing, assistive-technology testing, and an optional printable résumé page after personal-information review.
