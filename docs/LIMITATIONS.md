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

## Explicit non-goals for version one

- CMS, database, account, authentication, comments, blog, or contact form.
- Visitor analytics, tracking pixels, personalization, or cookies.
- Runtime GitHub API requests or live star/contributor counters.
- Automated ranking of the owner's projects or skills.
- Private repository discovery or employment/interview tracking.
- A claim that one portfolio can substitute for technical interviews or reference checks.

## Future work requires evidence

Add a feature only when a real evaluator need outweighs the new complexity. Candidate work includes a reviewed raster social card, custom domain security headers, recruiter usability testing, assistive-technology testing, and an optional printable résumé page after personal-information review.
