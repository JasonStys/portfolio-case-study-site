/**
 * @file Waits for a requested live mobile resize and two rendering opportunities before a layout assertion.
 * Functions: resizeForMobileLayout; variables: retained resize owner and one eight-second barrier budget.
 * Line locations: see docs/CODE_INDEX.md. Never reads body width, polls layout or retries an assertion.
 */
import type { Page } from "@playwright/test";

/** Register before resizing, admit the requested viewport/mobile grid, and release every event resource. */
export async function resizeForMobileLayout(
  page: Page,
  viewport: { width: number; height: number },
  gridSelector: string,
) {
  const owner = await page.evaluateHandle(
    ({ viewport, gridSelector }) => {
      let firstFrame: number | undefined;
      let secondFrame: number | undefined;
      let settled = false;
      let resolveDone: (value: {
        innerWidth: number;
        innerHeight: number;
        visualWidth: number;
        visualHeight: number;
        narrowMedia: boolean;
        gridColumns: string;
        resizeAt: number;
        firstFrameAt: number;
        secondFrameAt: number;
      }) => void;
      let rejectDone: (reason: Error) => void;
      const done = new Promise<Parameters<typeof resolveDone>[0]>((resolve, reject) => {
        resolveDone = resolve;
        rejectDone = reject;
      });
      // Registration returns a plain object, not this pending Promise; retain early failures until awaited.
      void done.catch(() => undefined);
      const cleanup = () => {
        window.removeEventListener("resize", resized);
        if (firstFrame !== undefined) cancelAnimationFrame(firstFrame);
        if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
        clearTimeout(timer);
      };
      const fail = (reason: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        rejectDone(reason);
      };
      const resized = () => {
        if (innerWidth !== viewport.width || innerHeight !== viewport.height) return;
        window.removeEventListener("resize", resized);
        const resizeAt = performance.now();
        firstFrame = requestAnimationFrame((firstFrameAt) => {
          if (settled) return;
          secondFrame = requestAnimationFrame((secondFrameAt) => {
            if (settled) return;
            try {
              const grid = document.querySelector(gridSelector);
              const style = grid === null ? null : getComputedStyle(grid);
              const state = {
                innerWidth,
                innerHeight,
                visualWidth: visualViewport?.width ?? -1,
                visualHeight: visualViewport?.height ?? -1,
                narrowMedia: matchMedia("(max-width: 720px)").matches,
                gridColumns: style?.gridTemplateColumns ?? "",
                resizeAt,
                firstFrameAt,
                secondFrameAt,
              };
              if (
                state.innerWidth !== viewport.width ||
                state.innerHeight !== viewport.height ||
                state.visualWidth !== viewport.width ||
                state.visualHeight !== viewport.height ||
                !state.narrowMedia ||
                style?.display !== "grid" ||
                !/^\d+(?:\.\d+)?px$/u.test(state.gridColumns) ||
                secondFrameAt <= firstFrameAt
              )
                throw new Error("Requested mobile viewport and one-column grid did not commit.");
              settled = true;
              cleanup();
              resolveDone(state);
            } catch (error) {
              fail(error instanceof Error ? error : new Error("Mobile resize admission failed."));
            }
          });
        });
      };
      window.addEventListener("resize", resized);
      const timer = setTimeout(
        () => fail(new Error("Mobile resize/render barrier exceeded eight seconds.")),
        8_000,
      );
      return { done, cancel: () => fail(new Error("Mobile resize/render barrier canceled.")) };
    },
    { viewport, gridSelector },
  );
  try {
    const [, state] = await Promise.all([
      page.setViewportSize(viewport),
      owner.evaluate((value) => value.done),
    ]);
    return state;
  } finally {
    try {
      await owner.evaluate((value) => value.cancel());
    } finally {
      await owner.dispose();
    }
  }
}
