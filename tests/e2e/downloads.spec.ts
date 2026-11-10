/**
 * @file Tests actual20-project62-payload static download discovery without fetching external binaries.
 * Functions: separate no-script and script-enabled accessibility journeys; variables: final public evidence.
 * Line locations: docs/CODE_INDEX.md after integration. No mocked release data or first-release inventions.
 */
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import raw from "../../src/data/project-downloads.json" with { type: "json" };
import { validateDownloads } from "../../src/lib/downloads";

const manifest = validateDownloads(raw);

test("released app discovery preserves actual20/62 platform links and source boundaries without external requests", async ({
  browser,
  request,
}, info) => {
  const origin = new URL(String(info.project.use.baseURL)).origin;
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: String(info.project.use.baseURL),
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
    await page.goto("./updates/");
    await page.getByRole("link", { name: "Download released applications", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Try the released applications.",
    );
    await expect(page.locator("[data-download-project]")).toHaveCount(20);
    await expect(page.locator("[data-download-platform]")).toHaveCount(62);
    for (const project of manifest.repositories) {
      const card = page.locator(`[data-download-project="${project.name}"]`);
      await expect(card.getByRole("link", { name: "Release", exact: true })).toHaveAttribute(
        "href",
        project.releaseUrl,
      );
      await expect(
        card.getByRole("link", {
          name: `App source ${project.sourceCommit.slice(0, 12)}`,
          exact: true,
        }),
      ).toHaveAttribute("href", project.sourceUrl);
      for (const asset of project.assets) {
        const row = card
          .locator("[data-download-platform]")
          .filter({ has: page.locator(`a[href="${asset.assetUrl}"]`) });
        await expect(row).toHaveCount(1);
        await expect(row.getByRole("link").nth(1)).toHaveAttribute("href", asset.checksumUrl);
        await expect(row.locator("code")).toHaveText(asset.sha256.slice(0, 12));
      }
    }
    const drone = page.locator('[data-download-project="drone-operations-console"]');
    await expect(drone.locator('[data-download-platform="windows"]')).toHaveCount(1);
    await expect(
      drone.locator('[data-download-platform="linux"],[data-download-platform="macos"]'),
    ).toHaveCount(0);
    await expect(
      page
        .locator('[data-download-project="secure-delivery-pipeline-lab"]')
        .getByRole("link", { name: "Signed manifest", exact: true }),
    ).toBeVisible();
    const aes = manifest.repositories.find(
      (project) => project.name === "applicant-evidence-studio",
    );
    if (aes === undefined || aes.acceptanceCheck === null)
      throw new Error("The reviewed Applicant Evidence download verifier must be present.");
    await expect(
      page
        .locator('[data-download-project="applicant-evidence-studio"]')
        .getByRole("link", { name: "Download acceptance", exact: true }),
    ).toHaveAttribute("href", aes.acceptanceCheck.url);
    const index = await request.get("./downloads/index.json");
    expect(index.status()).toBe(200);
    expect(await index.json()).toEqual(manifest);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (info.project.name === "webkit") {
      // WebKit inherits the host link-tab preference; exercise native keyboard activation explicitly.
      const project = page.locator("[data-download-project]").first();
      const headingLink = project.getByRole("heading").getByRole("link");
      const projectName = await project.getAttribute("data-download-project");
      if (!projectName) throw new Error("The first released project lacks its expected identity.");
      await headingLink.focus();
      await expect(headingLink).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(projectName);
    } else {
      const first = page.locator("[data-download-platform]").first().getByRole("link").first();
      await first.focus();
      await expect(first).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        page.locator("[data-download-platform]").first().getByRole("link").nth(1),
      ).toBeFocused();
    }
    expect(external).toEqual([]);
  } finally {
    await context.close();
  }
});

test("download accessibility runs in the scanner's normal JavaScript context", async ({
  page,
  context,
}, info) => {
  const origin = new URL(String(info.project.use.baseURL)).origin;
  const external: string[] = [];
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("./downloads/");
  await expect(page.locator("[data-download-project]")).toHaveCount(20);
  await expect(page.locator("[data-download-platform]")).toHaveCount(62);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(external).toEqual([]);
});
