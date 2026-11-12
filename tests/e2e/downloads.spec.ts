/**
 * @file Tests actual20-project62-payload static download discovery without fetching external binaries.
 * Functions: separate no-script and script-enabled accessibility journeys; variables: final public evidence.
 * Line locations: docs/CODE_INDEX.md after integration. No mocked release data or first-release inventions.
 */
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import raw from "../../src/data/project-downloads.json" with { type: "json" };
import { validateDownloads } from "../../src/lib/downloads";
import { waitForDownloadPage } from "./download-readiness";

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
    await page
      .getByRole("link", { name: "Earlier 20-project release snapshot", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Earlier release snapshot.");
    const pageCount = Math.ceil(manifest.repositories.length / 12);
    const seenNames: string[] = [],
      seenAssets: string[] = [];
    for (let number = 1; number <= pageCount; number++) {
      if (number > 1)
        await page
          .getByRole("navigation", { name: "Download pages" })
          .getByRole("link", { name: "Next page", exact: true })
          .click();
      const expected = manifest.repositories.slice((number - 1) * 12, number * 12);
      await waitForDownloadPage(
        page,
        new URL(
          number === 1
            ? "downloads/history/2026-11-10/"
            : `downloads/history/2026-11-10/page/${number}/`,
          String(info.project.use.baseURL),
        ).pathname,
        expected.length,
      );
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
        if (project.name === "drone-operations-console") {
          await expect(card.locator('[data-download-platform="windows"]')).toHaveCount(1);
          await expect(
            card.locator('[data-download-platform="linux"],[data-download-platform="macos"]'),
          ).toHaveCount(0);
        }
        if (project.name === "secure-delivery-pipeline-lab")
          await expect(
            card.getByRole("link", { name: "Signed manifest", exact: true }),
          ).toBeVisible();
        if (project.name === "applicant-evidence-studio") {
          if (project.acceptanceCheck === null)
            throw new Error("The reviewed Applicant Evidence download verifier must be present.");
          await expect(
            card.getByRole("link", { name: "Download acceptance", exact: true }),
          ).toHaveAttribute("href", project.acceptanceCheck.url);
        }
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
    expect(seenNames).toEqual(manifest.repositories.map((project) => project.name));
    expect(new Set(seenNames).size).toBe(manifest.repositories.length);
    expect(seenAssets).toEqual(
      manifest.repositories.flatMap((project) => project.assets.map((asset) => asset.assetUrl)),
    );
    expect(
      (await request.get(`./downloads/history/2026-11-10/page/${pageCount + 1}/`)).status(),
    ).toBe(404);
    expect((await request.get("./downloads/history/2026-11-10/page/1/")).status()).toBe(404);
    if (pageCount > 1)
      await page
        .getByRole("navigation", { name: "Download pages" })
        .getByRole("link", { name: "Download page 1", exact: true })
        .click();
    const index = await request.get("./downloads/history/2026-11-10/index.json");
    expect(index.status()).toBe(200);
    expect(await index.json()).toEqual(manifest);
    await waitForDownloadPage(
      page,
      new URL("downloads/history/2026-11-10/", String(info.project.use.baseURL)).pathname,
      12,
    );
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

test("historical download accessibility runs in the scanner's normal JavaScript context", async ({
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
  await page.goto("./downloads/history/2026-11-10/");
  const pageCount = Math.ceil(manifest.repositories.length / 12);
  for (let number = 1; number <= pageCount; number++) {
    if (number > 1)
      await page
        .getByRole("navigation", { name: "Download pages" })
        .getByRole("link", { name: "Next page", exact: true })
        .click();
    const expected = manifest.repositories.slice((number - 1) * 12, number * 12);
    await waitForDownloadPage(
      page,
      new URL(
        number === 1
          ? "downloads/history/2026-11-10/"
          : `downloads/history/2026-11-10/page/${number}/`,
        String(info.project.use.baseURL),
      ).pathname,
      expected.length,
    );
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
