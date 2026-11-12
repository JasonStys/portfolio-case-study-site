/**
 * @file Separates actual returned-document/style readiness from the unchanged download layout assertions.
 * Functions: waitForDownloadPage; variables: one eight-second shared readiness budget.
 * Line locations: see docs/CODE_INDEX.md. No layout polling, sleeps, retries or overflow suppression.
 */
import { expect, type Page } from "@playwright/test";

/** Admit the exact loaded route and card count before inspecting layout; missing styles fail visibly. */
export async function waitForDownloadPage(page: Page, pathname: string, cardCount: number) {
  const deadline = performance.now() + 8_000;
  const remaining = () => {
    const budget = Math.floor(deadline - performance.now());
    if (budget < 1) throw new Error("Download document readiness deadline exceeded.");
    return budget;
  };
  await page.waitForURL((url) => url.pathname === pathname, {
    waitUntil: "load",
    timeout: remaining(),
  });
  await expect(page.locator("[data-download-project]")).toHaveCount(cardCount, {
    timeout: remaining(),
  });
  const state = await page.evaluate(() => {
    const styles = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')];
    return {
      complete: document.readyState === "complete",
      styles: styles.length,
      loaded: styles.every((style) => style.sheet !== null),
    };
  });
  if (!state.complete || state.styles === 0 || !state.loaded)
    throw new Error("Download document or required stylesheet did not finish loading.");
}
