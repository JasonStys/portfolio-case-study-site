/**
 * @file Exercises static upgrade discovery, exact-source links, no-JavaScript browsing and hub limits.
 * Functions: Playwright navigation/HTTP/axe cases with explicit same-origin resource checks.
 * Variables: reviewed manifest and canonical order; all three browser projects run without retries.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import manifest from "../../src/data/project-upgrades.json" with { type: "json" };
import priority from "../../src/data/portfolio-priority.json" with { type: "json" };

test("all 67 local details and same-source evidence remain reachable without JavaScript", async ({
  browser,
  request,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: String(info.project.use.baseURL),
  });
  try {
    const page = await context.newPage();
    await page.goto("./projects/");
    expect(
      await page
        .locator("[data-project-card]")
        .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-project-id"))),
    ).toEqual(priority);
    const longest = [...priority].sort((left, right) => right.length - left.length)[0];
    if (!longest) throw new Error("Reviewed catalog is empty.");
    const card = page.locator(`[data-project-id="${longest}"]`);
    await expect(card.getByRole("heading").getByRole("link")).toHaveAttribute(
      "href",
      `/portfolio-case-study-site/projects/${longest}/`,
    );
    await card.getByRole("heading").getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(longest);
    const record = manifest.repositories.find((entry) => entry.name === longest);
    if (!record) throw new Error("Longest domain project must have source evidence.");
    await expect(page.locator(".source-identity code")).toHaveText(record.sourceCommit);
    await expect(
      page.getByRole("link", { name: "Read source-bound validation report ↗", exact: true }),
    ).toHaveAttribute("href", record.validationReportUrl);
    // Independently fetch every generated detail, including the hub, without relying on JS routing.
    for (let index = 0; index < priority.length; index += 8) {
      await Promise.all(
        priority.slice(index, index + 8).map(async (name) => {
          const response = await request.get(`./projects/${name}/`);
          expect(response.status(), name).toBe(200);
          const html = await response.text();
          expect(html).toContain(`<h1>${name}</h1>`);
          const evidence = manifest.repositories.find((entry) => entry.name === name);
          if (evidence) {
            expect(html).toContain(evidence.sourceCommit);
            expect(html).toContain(evidence.validationReportUrl);
          } else expect(html).toContain("data-portfolio-hub");
        }),
      );
    }
  } finally {
    await context.close();
  }
});

test("a case study opens its latest workflow and exact main evidence with no external resources", async ({
  page,
  context,
}) => {
  const external: string[] = [];
  const origin = new URL(String(test.info().project.use.baseURL)).origin;
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("./case-studies/code-flow-studio/");
  await page
    .getByRole("link", { name: "Latest workflow and source evidence →", exact: true })
    .click();
  const record = manifest.repositories.find((entry) => entry.name === "code-flow-studio");
  if (!record) throw new Error("Code Flow evidence is required.");
  await expect(page.locator("[data-project-upgrade]")).toContainText(record.summary);
  await expect(page.locator("[data-project-upgrade]")).toContainText(record.rationale);
  await expect(page.locator(".source-identity code")).toHaveText(record.sourceCommit);
  await expect(page.getByRole("link", { name: record.sourceCommit, exact: true })).toHaveAttribute(
    "href",
    record.sourceUrl,
  );
  for (const workflow of record.workflows)
    await expect(
      page.getByRole("link", { name: `${workflow.name} — successful main run ↗`, exact: true }),
    ).toHaveAttribute("href", workflow.url);
  for (const limit of record.limitations)
    await expect(page.getByText(limit, { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Validation at this commit" })).toContainText(
    "not every future change or an older downloadable release",
  );
  expect(external).toEqual([]);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    await expect(page.locator(".source-identity code")).toBeVisible();
  }
  const longest = [...priority].sort((left, right) => right.length - left.length)[0];
  if (!longest) throw new Error("Reviewed catalog is empty.");
  await page.goto(`./projects/${longest}/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(longest);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    await expect(page.locator(".source-identity code")).toBeVisible();
  }
  expect(external).toEqual([]);
});

test("homepage latest-work reading path includes all projects and opens local details", async ({
  page,
}) => {
  await page.goto("./");
  await page.locator('main a[href="/portfolio-case-study-site/updates/"]').click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Useful workflows, inspectable results.",
  );
  expect(
    await page
      .locator("[data-upgrade-project]")
      .evaluateAll((items) => items.map((item) => item.getAttribute("data-upgrade-project"))),
  ).toEqual(priority);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(320);
  await page.locator('[data-upgrade-project="industrial-memory-protocol-workbench"] a').click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "industrial-memory-protocol-workbench",
  );
  await expect(page.locator("[data-project-upgrade]")).toBeVisible();
});

test("the hub has separate current CI, unknown projects return 404 and sitemap covers every detail", async ({
  page,
  request,
}) => {
  await page.goto("./projects/portfolio-case-study-site/");
  await expect(page.locator("[data-portfolio-hub]")).toBeVisible();
  await expect(page.locator("[data-project-upgrade]")).toHaveCount(0);
  await expect(page.locator(".source-identity")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Inspect current portfolio CI and Pages/ }),
  ).toHaveAttribute(
    "href",
    "https://github.com/JasonStys/portfolio-case-study-site/actions/workflows/ci.yml",
  );
  const unknown = await request.get("./projects/not-a-reviewed-project/");
  expect(unknown.status()).toBe(404);
  expect(await unknown.text()).not.toContain("data-project-upgrade");
  const sitemap = await request.get("./sitemap.xml");
  const urls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/gu)].map(
    (match) => match[1],
  );
  expect(new Set(urls).size).toBe(urls.length);
  for (const name of priority)
    expect(urls).toContain(
      `https://jasonstys.github.io/portfolio-case-study-site/projects/${name}/`,
    );
});
