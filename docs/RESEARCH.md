# Research and standards notes

This implementation uses primary documentation rather than copying a generic portfolio template.

## Static content and deployment

- Astro documents content collections as the structured, schema-validatable way to manage repeated content such as project profiles. Schemas provide build failures, editor types, and predictable data. [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- Astro's GitHub Pages guide requires the repository base path for project sites and recommends a Pages workflow with a committed lockfile. [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)
- GitHub requires `pages: write` and `id-token: write` for the deployment job and recommends a protected `github-pages` environment. [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

These sources led to static Astro output, a repository-scoped base, exact dependency locking, and a deployment job that runs only after validation.

## Accessibility and progressive enhancement

- The HTML `<search>` element provides a search landmark, while MDN emphasizes that results should remain main content and that useful content should remain available before or without JavaScript. [MDN search element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search)
- WCAG 2.2 adds minimum target-size guidance and strengthens focus-related expectations. [W3C WCAG 2.2 changes](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

These sources led to a semantic search landmark, native inputs, 48-pixel control heights, no-script project content, skip navigation, visible focus, reduced motion, and WCAG 2.2 axe tags.

## Search appearance

- Google documents `ProfilePage` structured data for pages centered on one person and recommends accurate names, descriptions, images, and `sameAs` profiles. [Google ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- Google recommends structured data, useful titles, descriptions, and crawlable pages as explicit clues for search systems. [SEO guide for developers](https://developers.google.com/search/docs/fundamentals/get-started-developers)

These sources led to page-specific titles/descriptions, canonical URLs, crawlable static routes, `ProfilePage` and `SoftwareSourceCode` JSON-LD, social metadata, a sitemap, and robots policy.

## Performance and supply chain

- Core Web Vitals center user experience on loading, interaction, and layout stability. [web.dev Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- npm's install-script approval policy records reviewed dependency lifecycle scripts in `package.json`. [npm approve-scripts](https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts/)

These sources led to three-run Lighthouse budgets, explicit asset and layout-shift limits, no remote fonts, and a version-pinned approval for the esbuild installer.

## Research limitations

Automated standards and documentation cannot establish usability by themselves. Recruiter comprehension and assistive-technology usability should be evaluated with people before adding more visual or interactive complexity.
