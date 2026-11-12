/**
 * @file Uses a held real stylesheet to prove navigation readiness and a genuine overflow control stays detectable.
 * Functions: event-gate helpers and the three-engine no-script regression; variables: owned context and exact320px oracle.
 * Line locations: see docs/CODE_INDEX.md. No mocked HTML, sleep, retry or changed product CSS.
 */
import { expect, test } from "@playwright/test";
import { waitForDownloadPage } from "./download-readiness";
import { measuredBodyWidth } from "./layout-diagnostics";

/** An explicit network-event gate has a fixed deadline and always clears its timer. */
async function boundedEvent(event: Promise<void>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      event,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("The real held stylesheet was not requested.")),
          8_000,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

test("returned download readiness waits for real CSS and never excuses persistent overflow", async ({
  browser,
}, info) => {
  const baseURL = String(info.project.use.baseURL);
  const origin = new URL(baseURL).origin;
  const firstPath = new URL("downloads/", baseURL).pathname;
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 320, height: 800 },
  });
  let hold = false;
  let heldCount = 0;
  let signalHeld: () => void = () => {
    throw new Error("Missing held-event owner.");
  };
  let release: () => void = () => {
    throw new Error("Missing release-event owner.");
  };
  const held = new Promise<void>((resolve) => {
    signalHeld = resolve;
  });
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  await context.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin !== origin) return route.abort();
    if (
      hold &&
      route.request().resourceType() === "stylesheet" &&
      /\/BaseLayout\.[^/]+\.css$/u.test(new URL(route.request().url()).pathname)
    ) {
      hold = false;
      heldCount++;
      signalHeld();
      await released;
    }
    await route.continue();
  });
  let ready: Promise<void> | undefined;
  let navigation: Promise<void> | undefined;
  try {
    const page = await context.newPage();
    await page.goto("./downloads/page/6/");
    await waitForDownloadPage(page, new URL("downloads/page/6/", baseURL).pathname, 6);
    hold = true;
    navigation = page
      .getByRole("navigation", { name: "Download pages" })
      .getByRole("link", { name: "Download page 1", exact: true })
      .click();
    await boundedEvent(held);
    await page.waitForURL((url) => url.pathname === firstPath, {
      waitUntil: "commit",
      timeout: 8_000,
    });
    let settled = false;
    ready = waitForDownloadPage(page, firstPath, 12).then(() => {
      settled = true;
    });
    const incomplete = await page.evaluate(() => ({
      complete: document.readyState === "complete",
      missingSheet: [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].some(
        (style) => style.sheet === null,
      ),
    }));
    expect(heldCount).toBe(1);
    expect(incomplete.complete).toBe(false);
    expect(incomplete.missingSheet).toBe(true);
    expect(settled).toBe(false);
    release();
    await ready;
    await navigation;
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    // An actual persistent layout defect must still fail the exact existing width oracle after readiness.
    await page.evaluate(() => {
      const control = document.createElement("div");
      control.id = "layout-overflow-control";
      control.style.width = "640px";
      control.style.height = "1px";
      document.body.appendChild(control);
    });
    await waitForDownloadPage(page, firstPath, 12);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(false);
    const measured = await measuredBodyWidth(page, 320, info);
    expect(measured.width).toBeGreaterThan(320);
    expect(measured.diagnostic?.originalWidth).toBe(measured.width);
    expect(measured.diagnostic?.viewport.innerWidth).toBe(320);
    expect(
      measured.diagnostic?.offenders.some((element) => element.id === "layout-overflow-control"),
    ).toBe(true);
  } finally {
    release();
    await Promise.allSettled([ready, navigation].filter((value) => value !== undefined));
    await context.close();
  }
});
