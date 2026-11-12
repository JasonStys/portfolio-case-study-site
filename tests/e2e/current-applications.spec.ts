/**
 * @file Tests current66-project108-payload static download discovery without fetching external binaries.
 * Functions: separate no-script and script-enabled accessibility journeys; variables: final public evidence.
 * Line locations: docs/CODE_INDEX.md after integration. No mocked release data or first-release inventions.
 */
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import raw from "../../src/data/current-applications.json" with { type: "json" };
import { validateApplications } from "../../src/lib/applications";

const manifest = validateApplications(raw);

test("released app discovery preserves current66/108 platform links and source boundaries without external requests", async ({
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
    const pageCount = Math.ceil(manifest.applications.length / 12);
    const seenNames: string[] = [],
      seenAssets: string[] = [];
    for (let number = 1; number <= pageCount; number++) {
      if (number > 1)
        await page
          .getByRole("navigation", { name: "Download pages" })
          .getByRole("link", { name: "Next page", exact: true })
          .click();
      const expected = manifest.applications.slice((number - 1) * 12, number * 12);
      const cards = page.locator("[data-download-project]");
      await expect(cards).toHaveCount(expected.length);
      const actualNames = await cards.evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("data-download-project") ?? ""),
      );
      expect(actualNames).toEqual(expected.map((project) => project.name));
      seenNames.push(...actualNames);
      const navigation = page.getByRole("navigation", { name: "Download pages" });
      await expect(navigation.getByRole("link", { name: /^Download page / })).toHaveCount(
        pageCount,
      );
      await expect(
        navigation.getByRole("link", { name: `Download page ${number}`, exact: true }),
      ).toHaveAttribute("aria-current", "page");
      for (const project of expected) {
        const card = page.locator(`[data-download-project="${project.name}"]`);
        await expect(card.getByRole("link", { name: "Release", exact: true })).toHaveAttribute(
          "href",
          project.releaseUrl,
        );
        await expect(
          card.getByRole("link", {
            name: `App source ${project.runtimeSource.slice(0, 12)}`,
            exact: true,
          }),
        ).toHaveAttribute("href", project.runtimeSourceUrl);
        for (const asset of project.assets) {
          const row = card
            .locator("[data-download-platform]")
            .filter({ has: page.locator(`a[href="${asset.url}"]`) });
          await expect(row).toHaveCount(1);
          await expect(row.getByRole("link").nth(1)).toHaveAttribute("href", asset.checksumURL);
          await expect(row.locator("code")).toHaveText(asset.sha256.slice(0, 12));
        }
        await expect(
          card.getByRole("link", { name: "Current Windows guide", exact: true }),
        ).toHaveAttribute("href", project.guide.documentUrl);
        await expect(
          card.getByRole("link", { name: "Guide identities", exact: true }),
        ).toHaveAttribute("href", project.guide.manifestUrl);
      }
      seenAssets.push(
        ...(await page
          .locator("[data-download-platform] > a:first-child")
          .evaluateAll((elements) =>
            elements.map((element) => element.getAttribute("href") ?? ""),
          )),
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
    expect(seenNames).toEqual(manifest.applications.map((project) => project.name));
    expect(new Set(seenNames).size).toBe(manifest.applications.length);
    expect(seenAssets).toEqual(
      manifest.applications.flatMap((project) => project.assets.map((asset) => asset.url)),
    );
    expect((await request.get(`./downloads/page/${pageCount + 1}/`)).status()).toBe(404);
    expect((await request.get("./downloads/page/1/")).status()).toBe(404);
    if (pageCount > 1)
      await page
        .getByRole("navigation", { name: "Download pages" })
        .getByRole("link", { name: "Download page 1", exact: true })
        .click();
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

test("current download accessibility runs in the scanner's normal JavaScript context", async ({
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
  const pageCount = Math.ceil(manifest.applications.length / 12);
  for (let number = 1; number <= pageCount; number++) {
    if (number > 1)
      await page
        .getByRole("navigation", { name: "Download pages" })
        .getByRole("link", { name: "Next page", exact: true })
        .click();
    const expected = manifest.applications.slice((number - 1) * 12, number * 12);
    await expect(page.locator("[data-download-project]")).toHaveCount(expected.length);
    await expect(page.locator("[data-download-platform]")).toHaveCount(
      expected.reduce((sum, project) => sum + project.assets.length, 0),
    );
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
  expect(external).toEqual([]);
});
