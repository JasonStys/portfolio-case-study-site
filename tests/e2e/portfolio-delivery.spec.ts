/**
 * @file Exercises the own delivery page with actual static data and no script or outside requests.
 * Functions: complete own-index/detail/guide journey; variables: validated nullable own record.
 * Line locations: see docs/CODE_INDEX.md. Future release facts are never supplied by test fixtures.
 */
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import raw from "../../src/data/portfolio-delivery.json" with { type: "json" };
import { validatePortfolioDelivery, PORTFOLIO_REPOSITORY } from "../../src/lib/portfolio-delivery";
import { measuredBodyWidth } from "./layout-diagnostics";

const manifest = validatePortfolioDelivery(raw);

test("the separate portfolio reader preserves actual evidence and unknowns without changing the66 catalog", async ({
  browser,
  request,
}, info) => {
  const baseURL = String(info.project.use.baseURL);
  const origin = new URL(baseURL).origin;
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 320, height: 800 },
  });
  const external: string[] = [];
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  try {
    const page = await context.newPage();
    await page.goto("./downloads/");
    const ownLink = page.getByRole("link", {
      name: "the separate portfolio reader page",
      exact: true,
    });
    await ownLink.focus();
    await expect(ownLink).toBeFocused();
    await page.keyboard.press("Enter");
    await page.waitForURL(new URL("downloads/portfolio/", baseURL).href, { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "The portfolio reader and its evidence.",
    );
    const evidence = page.locator("[data-portfolio-delivery]");
    const delivery = manifest.delivery;
    await expect(evidence).toHaveAttribute(
      "data-portfolio-delivery",
      delivery ? "published" : "unrecorded",
    );
    if (delivery) {
      await expect(evidence.getByRole("heading", { level: 2 })).toHaveText(
        `Portfolio reader ${delivery.version}`,
      );
      for (const asset of delivery.assets) {
        const row = evidence.locator(`[data-portfolio-asset="${asset.role}"]`);
        await expect(row).toHaveCount(1);
        await expect(row.getByRole("link")).toHaveAttribute("href", asset.url);
        await expect(row.locator("code")).toHaveText(asset.sha256);
      }
      await expect(
        evidence.getByRole("link", { name: "Portfolio Windows guide — Word", exact: true }),
      ).toHaveAttribute("href", delivery.guide.documentUrl);
      await expect(
        evidence.getByRole("link", {
          name: "Guide identity and validation record — JSON",
          exact: true,
        }),
      ).toHaveAttribute("href", delivery.guide.manifestUrl);
      await expect(
        evidence.getByRole("link", {
          name: "Installed application validation report",
          exact: true,
        }),
      ).toHaveAttribute("href", delivery.guide.validationReportUrl);
      await expect(
        evidence.getByRole("link", { name: "Immutable packaged source", exact: true }),
      ).toHaveAttribute("href", delivery.runtimeSourceUrl);
      for (const workflow of delivery.sourceChecks.workflows)
        await expect(
          evidence.getByRole("link", {
            name: `${workflow.name} — released-source main run`,
            exact: true,
          }),
        ).toHaveAttribute("href", workflow.url);
    } else {
      await expect(evidence.locator("[data-portfolio-asset]")).toHaveCount(0);
      await expect(
        evidence.locator(`a[href^="${PORTFOLIO_REPOSITORY}/releases/download/"]`),
      ).toHaveCount(0);
      await expect(
        evidence.getByRole("link", { name: "portfolio Releases", exact: true }),
      ).toHaveAttribute("href", PORTFOLIO_REPOSITORY + "/releases");
      await expect(evidence).toContainText(
        "no projected portfolio release or current-guide identities",
      );
    }
    expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(
      320,
    );
    const own = await request.get("./downloads/portfolio/index.json");
    expect(own.status()).toBe(200);
    expect(await own.json()).toEqual(manifest);
    const other = await request.get("./downloads/index.json");
    expect((await other.json()).applications).toHaveLength(66);
    await page
      .getByRole("link", { name: "Project purpose and development evidence", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("portfolio-case-study-site");
    await expect(page.locator("[data-portfolio-delivery]")).toHaveAttribute(
      "data-portfolio-delivery",
      delivery ? "published" : "unrecorded",
    );
    if (delivery) {
      await page.goto("./documentation/");
      await page
        .getByRole("link", {
          name: `Current portfolio Windows guide and identities — v${delivery.version}`,
          exact: true,
        })
        .click();
      await expect(page.locator("#portfolio-current-guide-title")).toBeVisible();
    }
    expect(external).toEqual([]);
  } finally {
    await context.close();
  }
});

test("the separate portfolio reader remains accessible with the normal script capability", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("./downloads/portfolio/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The portfolio reader and its evidence.",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(320);
  const timestamps = page.locator(".portfolio-delivery time");
  const exactTimes = await timestamps.allTextContents();
  // A wider user-selected text font must not let public ISO identities enlarge the card's grid.
  await timestamps.evaluateAll((elements) => {
    for (const element of elements) {
      element.style.fontFamily = "monospace";
      element.style.fontSize = "20px";
    }
  });
  expect(await timestamps.allTextContents()).toEqual(exactTimes);
  expect((await measuredBodyWidth(page, 320, info)).width).toBeLessThanOrEqual(320);
  // Deliberately unwrappable content must remain visible to the same width oracle, not be clipped.
  await page.addStyleTag({
    content: ".portfolio-delivery time { white-space: nowrap !important; }",
  });
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeGreaterThan(320);
});
