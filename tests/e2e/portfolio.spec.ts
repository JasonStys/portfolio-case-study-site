/**
 * @file Exercises navigation, progressive catalog filtering, URL state, case studies, and accessibility.
 * Functions: Playwright end-to-end cases and axe helper.
 * Variables: expected featured count and project selectors.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import portfolioPriority from "../../src/data/portfolio-priority.json" with { type: "json" };
import publicationSnapshot from "../../src/data/project-publications.json" with { type: "json" };
import { spaceHighlightNames, spaceSystemsCuration } from "../../src/data/space-systems";
import { droneSystemsCuration } from "../../src/data/drone-systems";

test("documentation reading path preserves all projects and exposes reviewed files on mobile", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Documentation", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Project guides and validation evidence.",
  );
  await expect(page.locator("[data-documentation-project]")).toHaveCount(67);
  expect(
    await page
      .locator("[data-documentation-project]")
      .evaluateAll((entries) =>
        entries.map((entry) => entry.getAttribute("data-documentation-project")),
      ),
  ).toEqual(portfolioPriority);
  await expect(page.getByText(/91 Word documents and 24 workbooks/)).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Seven additional CodeQL configurations.", exact: true }),
  ).toContainText("Zero open alerts is different from zero raw findings.");
  await page.locator('[data-documentation-project="code-flow-studio"]').getByRole("link").click();
  const section = page.locator('[data-project-publications="code-flow-studio"]');
  await expect(
    section.getByRole("heading", { name: "Guides, reports and evidence files" }),
  ).toBeVisible();
  await expect(
    section.getByRole("link", { name: "Project guide — Word", exact: true }),
  ).toBeVisible();
  await expect(
    section.getByRole("link", { name: "Validation review — Word", exact: true }),
  ).toBeVisible();
  await expect(
    section.getByRole("link", { name: "Workflow and test-source evidence — Excel", exact: true }),
  ).toBeVisible();
  await expect(section).toContainText("not publisher signatures");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(390);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Word-only and full evidence editions remain usable without client JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: String(test.info().project.use.baseURL),
  });
  try {
    const page = await context.newPage();
    for (const name of [
      "code-flow-studio",
      "engineering-documentation-foundry",
      "portfolio-case-study-site",
    ]) {
      const publication = publicationSnapshot.repositories.find((entry) => entry.name === name);
      if (!publication) throw new Error("Required independent documentation archetype is missing.");
      const response = await page.goto(`./projects/${name}/`);
      expect(response?.ok()).toBe(true);
      const section = page.locator(`[data-project-publications="${name}"]`);
      await expect(section.locator("li")).toHaveCount(name === "portfolio-case-study-site" ? 1 : 3);
      for (const file of publication.documents) {
        await expect(
          section.locator(
            `a[href="https://github.com/JasonStys/${name}/raw/${publication.publishedCommit}/docs/reports/${file.filename}"]`,
          ),
        ).toHaveCount(1);
        await expect(section).toContainText(file.sha256);
      }
      await expect(section).toContainText(publication.sourceBaseline);
    }
    await page.goto("./case-studies/code-flow-studio/");
    await expect(page.locator('[data-project-publications="code-flow-studio"]')).toBeVisible();
  } finally {
    await context.close();
  }
});

test("guides a recruiter from overview to implementation evidence", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("why they work");
  await expect(page.locator("#featured-projects [data-project-card]")).toHaveCount(6);
  await expect(page.locator("#space-highlights [data-project-card]")).toHaveCount(4);
  await expect(page.locator("#drone-highlights [data-project-card]")).toHaveCount(4);
  await page
    .getByRole("link", { name: /Read case study/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Measured C# coverage without losing target exits",
  );
  await expect(page.getByRole("heading", { name: "Verification" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Inspect repository/ })).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/code-flow-studio",
  );
});

test("distinguishes Code Flow target exits, collector faults and current downloads from historical evidence", async ({
  page,
}) => {
  await page.goto("./");
  const featured = page.locator('#featured-projects [data-project-id="code-flow-studio"]');
  await expect(featured).toContainText("source-bound diagnostics");
  await expect(featured).toContainText("unused-code candidates");
  await page.goto("./projects/");
  await expect(page.locator("[data-project-filter]")).toHaveAttribute("data-enhanced", "true");
  for (const query of ["C# coverage", "Coverlet", "collector"]) {
    await page.getByLabel("Keywords").fill(query);
    await expect(page).toHaveURL(
      new RegExp(`[?&]q=${encodeURIComponent(query).replaceAll("%20", "\\+")}(?:&|$)`, "u"),
    );
    await expect(page.locator('[data-project-id="code-flow-studio"]')).toBeVisible();
  }
  await page.getByLabel("Keywords").fill("C# collector");
  await expect(page).toHaveURL(/q=C%23\+collector(?:&|$)/u);
  const result = page.locator('[data-project-id="code-flow-studio"]');
  await expect(result).toBeVisible();
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(1);
  await result.getByRole("link", { name: /Read case study/ }).click();
  await expect(page.locator(".case-summary")).toContainText("0.4.3");
  const coverage = page.getByRole("heading", {
    name: "C# coverage: measured approved nonzero exits",
    exact: true,
  });
  await expect(coverage).toBeVisible();
  await expect(page.locator(".prose").getByText("target_exit_code", { exact: true })).toBeVisible();
  await expect(
    page.locator(".prose").getByText("collector_exit_code", { exact: true }),
  ).toBeVisible();
  const exits = coverage.locator("xpath=following-sibling::table[1]");
  await expect(exits.getByRole("columnheader")).toHaveText([
    "Hosted case",
    "Actual target exit",
    "Collector exit",
    "Coverage",
  ]);
  // Independent published oracles: approved nonzero target exits are not collector failures.
  for (const cells of [
    ["Approved success", "0", "0", "measured"],
    ["Approved nonzero returns", "1, 2, 7, 255", "0 for each case", "measured"],
    ["Approved malformed input", "2", "0", "measured"],
    ["Target returns 7 when 2 was approved", "7", "0", "partial; case fails"],
    ["Collector rejects an invalid option", "No valid target observation", "0", "blocked"],
    ["Collector cannot write its report after target completion", "0", "101", "blocked"],
    ["Collector deadline expires", "No valid target observation", "-9 / timeout", "blocked"],
  ]) {
    const label = cells[0];
    if (label === undefined) throw new Error("Every independent exit oracle needs a named case.");
    const row = exits
      .getByRole("row")
      .filter({ has: page.getByRole("cell", { name: label, exact: true }) });
    await expect(row.getByRole("cell")).toHaveText(cells);
  }
  const release = page.getByRole("heading", { name: "0.4.3 validation and release", exact: true });
  await expect(release).toBeVisible();
  const measurements = release.locator("xpath=following-sibling::ul[1]");
  await expect(measurements).toContainText("419 tests and 28 subtests");
  await expect(measurements).toContainText("85.01% controller/training coverage");
  await expect(measurements).toContainText("not worker-source coverage");
  await expect(measurements).toContainText(/0\.4\.2.*historical C# partial state/u);
  await expect(
    page.getByRole("heading", { name: "Earlier 0.4.2 native reliability" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Earlier native reliability measurements" }),
  ).toBeVisible();
  await expect(page.getByText("155 local controller tests", { exact: true })).toBeVisible();
  await expect(page.getByText("265 Python tests and 28 subtests", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Earlier 0.4.0 measurements" })).toBeVisible();
  await expect(page.locator(".prose")).toContainText(
    "five seconds is not a universal process-exit guarantee",
  );
  await expect(page.locator(".prose")).toContainText(
    "84.48% controller/training-dataset line coverage",
  );
  await expect(page.locator(".prose")).toContainText(
    "not trusted attestation against a malicious target",
  );
  const links = {
    "source validation report":
      "blob/08e4194707fb0ab20b469e335ef9e081a34200d3/docs/reports/practical-workflows-2026-11-09.md",
    "real isolated-worker acceptance": "actions/runs/42726748363/job/129534214045",
    "0.4.3 downloads and checksums": "releases/tag/v0.4.3",
    "0.4.2 downloads and checksums": "releases/tag/v0.4.2",
    "C# coverage protocol": "blob/1d0b19ed589947ae45e93555d97331c95cad26cc/docs/csharp-coverage.md",
    "coverage fix checkpoint":
      "blob/1d0b19ed589947ae45e93555d97331c95cad26cc/docs/reports/csharp-coverage-2026-11-10.md",
    "full source validation": "actions/runs/42891062261",
    "native drain investigation and validation":
      "blob/7d2158a57bb49e8f837fffbfe23b301902465412/docs/reports/native-http-drain-2026-11-10.md",
  };
  for (const [name, suffix] of Object.entries(links))
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      `https://github.com/JasonStys/code-flow-studio/${suffix}`,
    );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  }
  await page.goto("./downloads/");
  const downloads = page.locator('[data-download-project="code-flow-studio"]');
  await expect(downloads.getByRole("heading")).toContainText("v0.4.3");
  await expect(downloads.getByRole("link", { name: "Release", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/code-flow-studio/releases/tag/v0.4.3",
  );
  await expect(downloads.getByRole("link", { name: /^App source /u })).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/code-flow-studio/tree/1d0b19ed589947ae45e93555d97331c95cad26cc",
  );
  await expect(downloads.locator("[data-download-platform]")).toHaveCount(6);
  for (const platform of ["windows", "linux", "macos"])
    await expect(downloads.locator(`[data-download-platform="${platform}"]`)).toHaveCount(2);
  for (const row of await downloads.locator("[data-download-platform]").all()) {
    const payload = row.getByRole("link").first();
    const url = await payload.getAttribute("href");
    expect(url).toMatch(
      /^https:\/\/github\.com\/JasonStys\/code-flow-studio\/releases\/download\/v0\.4\.3\/[^/]+$/u,
    );
    if (url === null) throw new Error("Every released package needs its actual download URL.");
    await expect(row.getByRole("link").nth(1)).toHaveAttribute("href", `${url}.sha256`);
  }
});

test("explains governed business standards and links versioned source evidence", async ({
  page,
}) => {
  await page.goto("./");
  const workbench = page.locator(
    '#featured-projects [data-project-id="business-knowledge-workbench"]',
  );
  await expect(workbench).toContainText("search numeric ranges");
  await page.goto("./projects/");
  await expect(page.locator("[data-project-filter]")).toHaveAttribute("data-enhanced", "true");
  await page.getByLabel("Keywords").fill("numeric ranges");
  // Wait for the actual debounced result before following its moving card link.
  await expect(page).toHaveURL(/q=numeric\+ranges(?:&|$)/u);
  const catalogEntry = page.locator('[data-project-id="business-knowledge-workbench"]');
  await expect(catalogEntry).toBeVisible();
  await catalogEntry.getByRole("link", { name: /Read case study/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Governed standards for business documents and data",
  );
  await expect(page.getByText(/supplier measurements of 4\.25 inches/)).toBeVisible();
  await expect(page.getByRole("link", { name: "change report", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/business-knowledge-workbench/blob/a25887ac0e54f2afbe0e21e597c67b606890e8ad/docs/reports/practical-workflows-2026-11-09.md",
  );
  await expect(
    page.getByRole("link", { name: "Version 1.4.0 downloads", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/business-knowledge-workbench/releases/tag/v1.4.0",
  );
  await expect(
    page.getByText(/not shared business hosting or delegated team membership/),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("shows all 14 space/energy projects and restores their catalog filter", async ({ page }) => {
  await page.goto("./space-systems/");
  await expect(page.locator("#space-highlights [data-project-card]")).toHaveCount(4);
  expect(
    await page
      .locator("[data-space-collection] [data-project-card]")
      .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-project-id"))),
  ).toEqual(spaceSystemsCuration.map((project) => project.name));
  await expect(page.getByText(/not flight-qualified software/)).toBeVisible();
  await page.getByRole("link", { name: "Filter the full catalog" }).click();
  await expect(page.getByLabel("Domain")).toHaveValue("Space systems");
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(14);
  await page.reload();
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(14);
});

test("drone collection preserves all seven projects, limits and restorable filters", async ({
  page,
}) => {
  await page.goto("./drone-systems/");
  await expect(page.locator("#drone-highlights [data-project-card]")).toHaveCount(4);
  expect(
    await page
      .locator("[data-drone-collection] [data-project-card]")
      .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-project-id"))),
  ).toEqual(droneSystemsCuration.map((project) => project.name));
  await expect(page.getByText(/not real aircraft control/)).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole("link", { name: "Filter the full catalog" }).click();
  await expect(page.getByLabel("Domain")).toHaveValue("Drone safety");
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(7);
  await page.reload();
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(7);
});

test("new collection and case studies work without client JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: String(test.info().project.use.baseURL),
  });
  try {
    const page = await context.newPage();
    await page.goto("./space-systems/");
    await expect(page.locator("[data-space-collection] [data-project-card]")).toHaveCount(14);
    await page.goto("./drone-systems/");
    await expect(page.locator("[data-drone-collection] [data-project-card]")).toHaveCount(7);
    for (const name of spaceHighlightNames) {
      const response = await page.goto(`./case-studies/${name}/`);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole("heading", { name: "Limitations", exact: true })).toBeVisible();
      await expect(page.getByRole("link", { name: /Inspect repository/ })).toHaveAttribute(
        "href",
        `https://github.com/JasonStys/${name}`,
      );
    }
  } finally {
    await context.close();
  }
});

test("space collection has accessible content and no mobile overflow", async ({ page }) => {
  await page.goto("./space-systems/");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(390);
});

test("filters projects with text, exact facets, reset, and restorable URL state", async ({
  page,
}) => {
  await page.goto("./projects/");
  await page.getByLabel("Keywords").fill("dag lease");
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(1);
  await expect(page.locator("[data-project-card]:not([hidden])")).toContainText(
    "cloud-job-orchestrator",
  );
  await page.getByLabel("Language").selectOption("Rust");
  await expect(page).toHaveURL(/q=dag\+lease.*language=Rust|language=Rust.*q=dag\+lease/);
  await page.reload();
  await expect(page.getByLabel("Keywords")).toHaveValue("dag lease");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(
    portfolioPriority.length,
  );
  expect(
    await page
      .locator("[data-project-card]")
      .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-project-id"))),
  ).toEqual(portfolioPriority);
});

test("supports keyboard navigation and has no detectable WCAG A or AA violations", async ({
  page,
}, testInfo) => {
  await page.goto("./");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  if (testInfo.project.name === "webkit") {
    // WebKit inherits the host's link-tab preference, so focus explicitly before testing activation.
    await skipLink.focus();
  } else {
    await page.keyboard.press("Tab");
  }
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("preserves a single-column mobile reading order without horizontal overflow", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./projects/");
  const bodyWidth = await page.locator("body").evaluate((body) => body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(390);
  const cards = page.locator("[data-project-card]");
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect((second?.y ?? 0) > (first?.y ?? 0) + (first?.height ?? 0) - 2).toBe(true);
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  const links = navigation.getByRole("link");
  const expectedNavigation = [
    "Overview",
    "Projects",
    "Latest work",
    "Documentation",
    "Space & energy",
    "Drone safety",
    "About",
  ];
  await expect(links).toHaveText(expectedNavigation);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const rows = new Set<number>();
    for (const link of await links.all()) {
      await expect(link).toBeVisible();
      const box = await link.boundingBox();
      if (!box) throw new Error("A primary navigation link has no rendered bounds.");
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(844);
      rows.add(Math.round(box.y));
    }
    expect(rows.size).toBeLessThanOrEqual(width === 320 ? 3 : 2);
  }
  if (info.project.name === "webkit") {
    // Native WebKit follows the host's link-tab preference; explicitly focus before activation.
    await navigation.getByRole("link", { name: "About", exact: true }).focus();
  } else {
    await links.first().focus();
    for (let index = 1; index < expectedNavigation.length; index++)
      await page.keyboard.press("Tab");
  }
  const about = navigation.getByRole("link", { name: "About", exact: true });
  await expect(about).toBeFocused();
  await about.press("Enter");
  await expect(page).toHaveURL(/\/about\/$/u);
});

test("publishes valid discovery and search artifacts", async ({ request }) => {
  const [feed, sitemap, catalog] = await Promise.all([
    request.get("./feed.xml"),
    request.get("./sitemap.xml"),
    request.get("./projects/"),
  ]);
  expect(feed.ok()).toBe(true);
  expect(await feed.text()).toContain('<rss version="2.0">');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("case-studies/forge2d-engine/");
  expect(await sitemap.text()).toContain("space-systems/");
  expect(await sitemap.text()).toContain("drone-systems/");
  expect(await sitemap.text()).toContain("case-studies/mission-verification-evidence-kit/");
  expect(catalog.ok()).toBe(true);
  const revision = /revision=([a-f0-9]{64})/u.exec(await catalog.text())?.[1];
  expect(revision).toMatch(/^[a-f0-9]{64}$/u);
  const search = await request.get(`./search-index.json?schema=2&revision=${revision}`);
  expect(search.ok()).toBe(true);
  const index = await search.json();
  expect(index.schemaVersion).toBe(2);
  expect(index.generatedFrom).toBe(revision);
});
