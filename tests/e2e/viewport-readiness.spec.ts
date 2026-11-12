/**
 * @file Gates real animation-frame delivery to prove resize readiness and retain a persistent overflow countercontrol.
 * Functions: three-engine resize contract; variables: original frame API, held callbacks and exact390px width oracle.
 * Line locations: see docs/CODE_INDEX.md. Uses the actual built drone page, not mocked layout or assertion retries.
 */
import { expect, test } from "@playwright/test";
import { measuredBodyWidth } from "./layout-diagnostics";
import { resizeForMobileLayout } from "./viewport-readiness";

test("live resize waits for rendering opportunities and still exposes persistent overflow", async ({
  page,
}, info) => {
  await page.goto("./drone-systems/");
  await expect(page.locator("#drone-highlights [data-project-card]")).toHaveCount(4);
  await page.evaluate(() => {
    const control = document.createElement("div");
    control.id = "resize-persistent-overflow-control";
    control.style.width = "640px";
    control.style.height = "1px";
    document.body.appendChild(control);
  });
  const gate = await page.evaluateHandle(() => {
    const original = window.requestAnimationFrame.bind(window);
    let released = false;
    let count = 0;
    const pending: FrameRequestCallback[] = [];
    let signalHeld: () => void;
    const held = new Promise<void>((resolve) => {
      signalHeld = resolve;
    });
    window.requestAnimationFrame = (callback) =>
      original.call(window, (timestamp) => {
        if (released) callback(timestamp);
        else {
          pending.push(callback);
          count++;
          signalHeld();
        }
      });
    return {
      held,
      count: () => count,
      release: () => {
        released = true;
        for (const callback of pending.splice(0)) original.call(window, callback);
      },
      restore: () => {
        window.requestAnimationFrame = original;
      },
    };
  });
  let settled = false;
  const ready = resizeForMobileLayout(
    page,
    { width: 390, height: 844 },
    "#drone-highlights .featured-grid",
  ).then((state) => {
    settled = true;
    return state;
  });
  try {
    await Promise.race([
      gate.evaluate((value) => value.held),
      ready.then(() => {
        throw new Error("Resize readiness completed before the held real rendering callback.");
      }),
    ]);
    expect(await gate.evaluate((value) => value.count())).toBe(1);
    expect(settled).toBe(false);
    expect(await page.evaluate(() => ({ width: innerWidth, height: innerHeight }))).toEqual({
      width: 390,
      height: 844,
    });
    await gate.evaluate((value) => value.release());
    const state = await ready;
    expect(state.innerWidth).toBe(390);
    expect(state.visualWidth).toBe(390);
    expect(state.narrowMedia).toBe(true);
    expect(state.gridColumns).toMatch(/^\d+(?:\.\d+)?px$/u);
    expect(state.secondFrameAt).toBeGreaterThan(state.firstFrameAt);
    const measured = await measuredBodyWidth(page, 390, info);
    expect(measured.width).toBeGreaterThan(390);
    expect(measured.initial.width).toBe(measured.width);
    expect(measured.initial.innerWidth).toBe(390);
    expect(measured.diagnostic?.originalWidth).toBe(measured.width);
    expect(
      measured.diagnostic?.offenders.some(
        (element) => element.id === "resize-persistent-overflow-control",
      ),
    ).toBe(true);
  } finally {
    await gate.evaluate((value) => value.release());
    await Promise.allSettled([ready]);
    try {
      await gate.evaluate((value) => value.restore());
    } finally {
      await gate.dispose();
    }
  }
});
