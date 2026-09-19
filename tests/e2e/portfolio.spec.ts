/**
 * @file Exercises navigation, progressive catalog filtering, URL state, case studies, and accessibility.
 * Functions: Playwright end-to-end cases and axe helper.
 * Variables: expected featured count and project selectors.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("guides a recruiter from overview to implementation evidence", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("why they work");
  await expect(page.locator("[data-project-card]")).toHaveCount(6);
  await page
    .getByRole("link", { name: /Read case study/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Reliable integration operations",
  );
  await expect(page.getByRole("heading", { name: "Verification" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Inspect repository/ })).toHaveAttribute(
    "href",
    /github\.com\/JasonStys/,
  );
});

test("filters projects with text, exact facets, reset, and restorable URL state", async ({
  page,
}) => {
  await page.goto("./projects/");
  await page.getByLabel("Keywords").fill("leases");
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(1);
  await expect(page.locator("[data-project-card]:not([hidden])")).toContainText(
    "cloud-job-orchestrator",
  );
  await page.getByLabel("Language").selectOption("Rust");
  await expect(page).toHaveURL(/q=leases.*language=Rust|language=Rust.*q=leases/);
  await page.reload();
  await expect(page.getByLabel("Keywords")).toHaveValue("leases");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator("[data-project-card]:not([hidden])")).toHaveCount(20);
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
  const [feed, sitemap, search] = await Promise.all([
    request.get("./feed.xml"),
    request.get("./sitemap.xml"),
    request.get("./search-index.json"),
  ]);
  expect(feed.ok()).toBe(true);
  expect(await feed.text()).toContain('<rss version="2.0">');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("case-studies/forge2d-engine/");
  expect(search.ok()).toBe(true);
  expect((await search.json()).schemaVersion).toBe(1);
});
