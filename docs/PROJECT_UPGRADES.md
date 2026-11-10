# Project upgrades and evidence

The portfolio covers the same 67 approved repositories in
`src/data/portfolio-priority.json`. The current review changes 66 domain projects
and this portfolio hub. Existing projects outside that list are excluded.

`src/data/project-upgrades.json` contains public editorial summaries, rationales,
project-specific limitations, and commit-specific evidence for the 66 domain
projects. It contains no account stores, local file paths, archive manifests,
credentials, private source, or personal applicant/artwork data. The portfolio's
own detail page describes the navigation changes and links its CI separately;
it never claims its own unpublished revision has already passed.

## Reading the evidence

Each domain project detail page links:

1. The reviewed pull request and its exact merged source commit.
2. A validation report committed at that source, including relevant environments,
   scenarios, independent oracles, failures fixed, measurements, and limits.
3. Successful main-push workflows at that exact commit. Manual release and
   dependency-update jobs do not substitute for required validation workflows.

The source review checked that the reviewed tree and merged tree agree, that the
report exists as a committed file, and that the freshly fetched main reference
matches the accepted commit. All required main-push workflows had to be present
and successful. Missing, duplicate, active, failed, or mismatched evidence stopped
collection. The public build independently rejects malformed, incomplete,
cross-repository, mutable-source, or unexpected evidence fields.

These checks bind a statement to inspectable evidence; they are not a general
correctness proof, authenticity certificate, deployment approval, or promise
that later revisions retain the same results. Workflow history can be deleted
or expire; immutable source reports remain useful when hosted artifacts do not.

## Maintaining an upgrade

Update the exact reviewed project record only after source review and passing
commit-specific checks. Keep names in canonical order and explanations factual.
Use the repository's existing `docs/` report path at the same 40-character commit
as the source link. Keep workflow URLs in that repository's Actions namespace.
Record important unknown states and application-specific limits explicitly.

Keep short outcomes as literal strings in the three curation modules so README
synchronization remains deterministic. Longer rationale and evidence stay on
static project pages rather than inflating the search index or browser bundle.
Update any corresponding detailed case study and distinguish new source from
older downloadable releases. Do not label an old binary as containing new work.

Run formatting, schema/unit checks, the README generator, build/link/budget
validation, real browser journeys, and Lighthouse before publication. Regenerate
the source symbol index and file catalog last. Existing quality budgets and
coverage targets apply to the new routes and tooling as well.

## Native application evidence

The current Workbench, Drone Operations, Code Flow, Applicant Evidence, and Image
Model releases have separate native acceptance evidence. Checksum comparisons
identify the downloaded bytes; they do not make an unsigned package signed or
notarized. A packaged application journey is different from a clean-machine
installer, physical-device, or production-hosting acceptance test. The two
updated installed Windows applications retain their existing private stores;
test journeys used isolated synthetic accounts and directories.
