/**
 * @file Exercises navigation, progressive catalog filtering, URL state, case studies, and accessibility.
 * Functions: Playwright end-to-end cases and axe helper.
 * Variables: expected featured count and project selectors.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import portfolioPriority from "../../src/data/portfolio-priority.json" with { type: "json" };
import { spaceHighlightNames, spaceSystemsCuration } from "../../src/data/space-systems";
import { droneSystemsCuration } from "../../src/data/drone-systems";

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
    "Polyglot AI development with verifiable revisions",
  );
  await expect(page.getByRole("heading", { name: "Verification" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Inspect repository/ })).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/code-flow-studio",
  );
});

test("highlights Code Flow native evidence with verified results and measurement limits", async ({
  page,
}) => {
  await page.goto("./");
  const featured = page.locator('#featured-projects [data-project-id="code-flow-studio"]');
  await expect(featured).toContainText("file/line diagnostics");
  await expect(featured).toContainText("review-only unused-code candidates");
  await page.goto("./projects/");
  await expect(page.locator("[data-project-filter]")).toHaveAttribute("data-enhanced", "true");
  await page.getByLabel("Keywords").fill("coverage unused");
  await expect(page).toHaveURL(/q=coverage\+unused(?:&|$)/u);
  const result = page.locator('[data-project-id="code-flow-studio"]');
  await expect(result).toBeVisible();
  await result.getByRole("link", { name: /Read case study/ }).click();
  await expect(page.locator(".case-summary")).toContainText("v0.3.0");
  for (const text of [
    "148 unit tests",
    "40 isolated-worker scenarios",
    "24 browser/account checks",
  ])
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  await expect(page.getByText(/controller\/training.dataset statement coverage/)).toBeVisible();
  await expect(
    page.getByText(/SQLite measures completed top-level statement-start lines/),
  ).toBeVisible();
  await expect(page.getByText(/not trusted attestation against malicious targets/)).toBeVisible();
  const links = {
    "verified v0.3.0 validation report":
      "blob/2d837e558420e4d7a775affdecd3dfd401eb7e7b/docs/validation-polyglot.md",
    "native acceptance records": "blob/v0.3.0/docs/evidence/polyglot-locations.json",
    "published v0.3.0 release": "releases/tag/v0.3.0",
  };
  for (const [name, suffix] of Object.entries(links))
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      `https://github.com/JasonStys/code-flow-studio/${suffix}`,
    );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(390);
});

test("explains governed business standards and links versioned source evidence", async ({
  page,
}) => {
  await page.goto("./");
  const workbench = page.locator(
    '#featured-projects [data-project-id="business-knowledge-workbench"]',
  );
  await expect(workbench).toContainText("owner-controlled units");
  await page.goto("./projects/");
  await expect(page.locator("[data-project-filter]")).toHaveAttribute("data-enhanced", "true");
  await page.getByLabel("Keywords").fill("schemas");
  // Wait for the actual debounced result before following its moving card link.
  await expect(page).toHaveURL(/q=schemas(?:&|$)/u);
  const catalogEntry = page.locator('[data-project-id="business-knowledge-workbench"]');
  await expect(catalogEntry).toBeVisible();
  await catalogEntry.getByRole("link", { name: /Read case study/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Governed standards for business documents and data",
  );
  await expect(page.getByText(/4\.25 in → 107\.95 mm/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "version 1.2 validation", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/business-knowledge-workbench/blob/v1.2.0/docs/validation-v1.2.md",
  );
  await expect(
    page.getByRole("link", { name: "published v1.2.0 release", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/business-knowledge-workbench/releases/tag/v1.2.0",
  );
  await expect(
    page.getByText(/not shared-business membership or delegated coworker permissions/),
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
  await page.getByLabel("Keywords").fill("dag leases");
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(1);
  await expect(page.locator("[data-project-card]:not([hidden])")).toContainText(
    "cloud-job-orchestrator",
  );
  await page.getByLabel("Language").selectOption("Rust");
  await expect(page).toHaveURL(/q=dag\+leases.*language=Rust|language=Rust.*q=dag\+leases/);
  await page.reload();
  await expect(page.getByLabel("Keywords")).toHaveValue("dag leases");
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
}) => {
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
