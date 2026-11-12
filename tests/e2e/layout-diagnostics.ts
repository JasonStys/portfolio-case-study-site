/**
 * @file Retains the original one-shot body width while collecting bounded public layout evidence only on overflow.
 * Functions: measuredBodyWidth; variables: node/attachment caps and the original captured width.
 * Line locations: see docs/CODE_INDEX.md. No layout polling, hidden overflow or assertion retries.
 */
import type { Page, TestInfo } from "@playwright/test";

/** Observe once, optionally diagnose, and return the same captured value even if layout later changes. */
export async function measuredBodyWidth(page: Page, maximum: number, info: TestInfo) {
  const initial = await page.locator("body").evaluate((body) => {
    const width = body.scrollWidth;
    return {
      width,
      observedAt: performance.now(),
      innerWidth,
      innerHeight,
      visualWidth: visualViewport?.width,
      visualHeight: visualViewport?.height,
      narrowMedia: matchMedia("(max-width: 720px)").matches,
    };
  });
  const { width } = initial;
  let diagnostic = null;
  if (width > maximum) {
    try {
      diagnostic = await page.evaluate(
        ({ maximum, originalWidth, initial }) => {
          const rect = (element: Element) => {
            const value = element.getBoundingClientRect();
            return {
              x: value.x,
              y: value.y,
              width: value.width,
              height: value.height,
              right: value.right,
              bottom: value.bottom,
            };
          };
          const describe = (element: Element) => {
            const style = getComputedStyle(element);
            return {
              tag: element.tagName,
              id: element.id.slice(0, 120),
              class: (element.getAttribute("class") ?? "").slice(0, 160),
              text: element.textContent?.replace(/\s+/gu, " ").trim().slice(0, 120) ?? "",
              rect: rect(element),
              style: {
                display: style.display,
                position: style.position,
                width: style.width,
                minWidth: style.minWidth,
                maxWidth: style.maxWidth,
                boxSizing: style.boxSizing,
                overflowX: style.overflowX,
                overflowWrap: style.overflowWrap,
                whiteSpace: style.whiteSpace,
                wordBreak: style.wordBreak,
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                lineHeight: style.lineHeight,
                gridTemplateColumns: style.gridTemplateColumns,
                flexWrap: style.flexWrap,
                transform: style.transform,
              },
            };
          };
          const elements = [...document.querySelectorAll("*")];
          const offenders = elements
            .slice(0, 10_000)
            .filter((element) => {
              const box = element.getBoundingClientRect();
              return (
                box.width > 0 && box.height > 0 && (box.right > maximum + 0.5 || box.left < -0.5)
              );
            })
            .map((element) => ({ element, right: element.getBoundingClientRect().right }))
            .sort((left, right) => right.right - left.right)
            .slice(0, 30)
            .map(({ element }) => describe(element));
          return {
            maximum,
            originalWidth,
            initial,
            observedAt: performance.now(),
            pathname: location.pathname,
            viewport: {
              innerWidth,
              innerHeight,
              outerWidth,
              outerHeight,
              devicePixelRatio,
              visualWidth: visualViewport?.width,
              visualHeight: visualViewport?.height,
              visualScale: visualViewport?.scale,
            },
            document: {
              readyState: document.readyState,
              fontStatus: document.fonts.status,
              rootClientWidth: document.documentElement.clientWidth,
              rootScrollWidth: document.documentElement.scrollWidth,
              bodyClientWidth: document.body.clientWidth,
              bodyScrollWidth: document.body.scrollWidth,
              narrowMedia: matchMedia("(max-width: 720px)").matches,
            },
            stylesheets: [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')]
              .slice(0, 20)
              .map((link) => ({
                pathname: new URL(link.href).pathname,
                loaded: link.sheet !== null,
                disabled: link.disabled,
              })),
            body: describe(document.body),
            totalElements: elements.length,
            scannedElements: Math.min(elements.length, 10_000),
            offenders,
          };
        },
        { maximum, originalWidth: width, initial },
      );
      const body = Buffer.from(JSON.stringify(diagnostic, null, 2));
      if (body.length > 64 * 1024)
        throw new Error("Layout diagnostics exceeded their attachment cap.");
      await info.attach(`layout-overflow-${maximum}.json`, {
        body,
        contentType: "application/json",
      });
      await info.attach(`layout-overflow-${maximum}.png`, {
        body: await page.screenshot({ fullPage: false, timeout: 5_000 }),
        contentType: "image/png",
      });
    } catch {
      // A storage or capture fault must never replace the original width assertion with another error.
      info.annotations.push({
        type: "layout-diagnostics",
        description:
          "Bounded layout capture unavailable; original captured width remains the assertion value.",
      });
    }
  }
  return { width, initial, diagnostic };
}
