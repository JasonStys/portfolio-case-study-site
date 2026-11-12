/**
 * @file Exercises the actual offline Electron site, native confirmation boundary and normal two-launch ownership.
 * Functions: entry, normalExit and bounded event completion; source and relocated executable share every oracle.
 * Variables: fresh synthetic profile, immutable site identity and bounded receipt/screenshots; no normal user profile.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { once } from "node:events";
const require = createRequire(import.meta.url);
const { _electron, expect } = require("../node_modules/@playwright/test");
const { readUtf8 } = require("../files.cjs");
const root = path.resolve(import.meta.dirname, "../.."),
  source = process.argv[2] === "--source";
const executable = source
  ? require("../node_modules/electron")
  : path.resolve(process.argv[2] ?? "");
const output = path.resolve(process.argv[3] ?? ""),
  resources = source ? path.resolve(process.argv[4] ?? "") : null;
if (
  !process.argv[2] ||
  !process.argv[3] ||
  process.argv.length !== (source ? 5 : 4) ||
  fs.existsSync(output)
)
  throw new Error(
    "Choose the exact application, fresh output and source snapshot when applicable.",
  );
fs.mkdirSync(output, { recursive: true });
const profile = path.join(output, "profile"),
  pageErrors = [],
  outsideResponses = [],
  diagnostics = [],
  identities = [],
  layouts = [],
  exits = [],
  steps = [];
let application, marker;
async function bounded(promise, milliseconds, message) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error(message)), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
async function windowBounds(page) {
  for (const width of [800, 1280]) {
    await application.evaluate(
      ({ BrowserWindow }, value) => BrowserWindow.getAllWindows()[0].setSize(value, 900),
      width,
    );
    await expect
      .poll(() =>
        page.evaluate(
          (value) => window.innerWidth > value - 60 && window.innerWidth <= value,
          width,
        ),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      )
      .toBe(true);
    const client = await page.evaluate(() => document.documentElement.clientWidth);
    for (const link of await page
      .locator(
        'nav[aria-label="Primary navigation"] a, [data-native-context] button, [data-native-context] a',
      )
      .all()) {
      const bounds = await link.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(client + 1);
    }
    layouts.push({
      windowWidth: width,
      clientWidth: client,
      noHorizontalOverflow: true,
      allNavigationWithinBounds: true,
    });
  }
}
async function entry() {
  const env = { ...process.env, ...(source ? { PORTFOLIO_NATIVE_RESOURCES: resources } : {}) };
  delete env.ELECTRON_RUN_AS_NODE;
  delete env.NODE_OPTIONS;
  delete env.NODE_PATH;
  application = await _electron.launch({
    executablePath: executable,
    args: [...(source ? [path.join(root, "desktop")] : []), "--profile", profile],
    cwd: output,
    env,
    timeout: 45000,
  });
  const record = (chunk) => {
    if (diagnostics.join("").length < 65536) diagnostics.push(chunk.toString().slice(0, 8192));
  };
  application.process().stderr.on("data", record);
  application.process().stdout.on("data", record);
  const page = await application.firstWindow({ timeout: 30000 });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (!response.url().startsWith("portfolio://catalog/") && !response.url().startsWith("data:"))
      outsideResponses.push(response.url());
  });
  await expect(page.locator("[data-native-context]")).toBeVisible({ timeout: 30000 });
  await expect(page.locator("[data-native-version]")).toContainText("v1.1.0");
  const expectedMetadata = JSON.parse(
    readUtf8(
      path.join(
        source ? resources : path.join(path.dirname(executable), "resources/portfolio-site"),
        "SOURCE.json",
      ),
      4 * 1024 * 1024,
    ),
  );
  const observedState = await page.evaluate(() => window.portfolioNative.state());
  expect(observedState.source).toBe(expectedMetadata.source);
  expect(observedState.version).toBe(expectedMetadata.version);
  expect(
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isVisible()),
  ).toBe(true);
  const identity = await application.evaluate(({ app, BrowserWindow }) => ({
    packaged: app.isPackaged,
    electron: process.versions.electron,
    node: process.versions.node,
    sandbox: BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences().sandbox,
    isolated: BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences().contextIsolation,
    nodeIntegration:
      BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences().nodeIntegration,
  }));
  expect(identity).toEqual({
    packaged: !source,
    electron: "44.11.1",
    node: "24.22.2",
    sandbox: true,
    isolated: true,
    nodeIntegration: false,
  });
  identities.push(identity);
  const current = fs.readFileSync(path.join(profile, "owner.json"));
  if (marker) expect(current.equals(marker)).toBe(true);
  else marker = current;
  return page;
}
async function normalExit() {
  const exited = once(application.process(), "exit");
  await application.evaluate(({ app }) => app.quit());
  const [code, signal] = await bounded(exited, 30000, "Normal portfolio Quit did not complete.");
  expect(code).toBe(0);
  expect(signal).toBeNull();
  exits.push(code);
  expect(fs.existsSync(path.join(profile, "owner.lock"))).toBe(false);
}
try {
  let page = await entry();
  await windowBounds(page);
  const primary = page.getByRole("navigation", { name: "Primary navigation", exact: true });
  await primary.getByRole("link", { name: "Projects", exact: true }).click();
  await page.locator("#project-query").fill("code flow");
  await page.locator("#project-language").selectOption("Python");
  await expect(page.locator("#project-count")).toHaveText("1 project");
  expect(new URL(page.url()).searchParams.get("q")).toBe("code flow");
  await page
    .locator("#project-results")
    .getByRole("link", { name: "code-flow-studio", exact: true })
    .click();
  await expect(page.locator("main h1")).toContainText("code-flow-studio");
  await expect(page.locator('[data-native-action="back"]')).toBeEnabled();
  await page.locator('[data-native-action="back"]').click();
  await expect(page.locator("#project-query")).toHaveValue("code flow");
  await page.locator("#project-reset").click();
  await expect(page.locator("#project-count")).toHaveText("67 projects");
  await page.locator("#project-language").selectOption("Rust");
  expect(await page.locator("#project-results article:not([hidden])").count()).toBeGreaterThan(0);
  expect(new URL(page.url()).searchParams.get("language")).toBe("Rust");
  await primary.getByRole("link", { name: "About", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main h1")).toHaveText("Curiosity, made testable.");
  await page.getByRole("link", { name: "Skip to main content", exact: true }).focus();
  await page.keyboard.press("Enter");
  expect(new URL(page.url()).hash).toBe("#main-content");
  await page.screenshot({
    path: path.join(output, "native-portfolio-about.png"),
    fullPage: false,
    scale: "css",
  });
  steps.push(
    "same site project search/facets/query history, detail, Back, keyboard About and fragment navigation",
  );
  await application.evaluate(({ dialog, shell }) => {
    globalThis.portfolioOpened = [];
    globalThis.portfolioPrompts = [];
    dialog.showMessageBox = async (_owner, options) => {
      globalThis.portfolioPrompts.push(options);
      return { response: 0 };
    };
    shell.openExternal = async (value) => {
      globalThis.portfolioOpened.push(value);
    };
  });
  await page.locator('footer a[href="https://github.com/JasonStys"]').click();
  await expect(page.locator("[data-native-status]")).toHaveText("Stayed in the offline portfolio.");
  expect(await application.evaluate(() => globalThis.portfolioOpened)).toEqual([]);
  expect(await application.evaluate(() => globalThis.portfolioPrompts[0].defaultId)).toBe(0);
  expect(await application.evaluate(() => globalThis.portfolioPrompts[0].cancelId)).toBe(0);
  await application.evaluate(({ dialog }) => {
    dialog.showMessageBox = async (_owner, options) => {
      globalThis.portfolioPrompts.push(options);
      return { response: 1 };
    };
  });
  await page.locator('footer a[href="https://github.com/JasonStys"]').click();
  await expect(page.locator("[data-native-status]")).toHaveText(
    "The approved public link was sent to your browser.",
  );
  expect(await application.evaluate(() => globalThis.portfolioOpened)).toEqual([
    "https://github.com/JasonStys",
  ]);
  const rejected = await page.evaluate(async () => {
    try {
      await window.portfolioNative.openLink("https://unlisted-public.example.org/not-declared");
      return false;
    } catch {
      return true;
    }
  });
  expect(rejected).toBe(true);
  expect(await application.evaluate(() => globalThis.portfolioPrompts.length)).toBe(2);
  expect(
    await page.evaluate(() => ({ node: typeof window.require, process: typeof window.process })),
  ).toEqual({ node: "undefined", process: "undefined" });
  const outside = await page.evaluate(async () => {
    try {
      await fetch("https://github.com/JasonStys");
      return true;
    } catch {
      return false;
    }
  });
  expect(outside).toBe(false);
  expect(await page.evaluate(() => Notification.requestPermission())).toBe("denied");
  const beforeWindows = application.windows().length;
  await page.evaluate(() => {
    window.open("https://github.com/JasonStys", "_blank");
  });
  expect(application.windows().length).toBe(beforeWindows);
  steps.push(
    "actual trusted anchor Cancel/Open with only OS opener/dialog substituted; unlisted target, renderer Node, outside fetch and popup denied",
  );
  await page.goto("portfolio://catalog/portfolio-case-study-site/downloads/");
  const expectedNames = await page.evaluate(async () =>
    (
      await (await fetch("/portfolio-case-study-site/downloads/index.json")).json()
    ).repositories.map((project) => project.name),
  );
  const names = [];
  for (let number = 1; number <= Math.ceil(expectedNames.length / 12); number++) {
    if (number > 1)
      await page
        .getByRole("navigation", { name: "Download pages" })
        .getByRole("link", { name: "Next page", exact: true })
        .click();
    const actual = await page
      .locator("[data-download-project]")
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("data-download-project")),
      );
    expect(actual.length).toBeLessThanOrEqual(12);
    names.push(...actual);
  }
  expect(names).toEqual(expectedNames);
  if (expectedNames.length > 12)
    await page
      .getByRole("navigation", { name: "Download pages" })
      .getByRole("link", { name: "Download page 1", exact: true })
      .click();
  await page
    .getByRole("link", { name: /full .*index|full evidence index|complete .*index/i })
    .click();
  expect(new URL(page.url()).pathname).toBe("/portfolio-case-study-site/downloads/index.json");
  const document = await page.locator("body").innerText();
  expect(JSON.parse(document)).toBeTruthy();
  await application.evaluate(({ Menu }) =>
    Menu.getApplicationMenu().getMenuItemById("native-home").click(),
  );
  await expect(page.locator("[data-native-context]")).toBeVisible();
  await page.screenshot({
    path: path.join(output, "native-portfolio-home.png"),
    fullPage: false,
    scale: "css",
  });
  steps.push(
    "all static download pages exactly cover the complete JSON index; existing readable JSON evidence-document link and native Overview menu",
  );
  await normalExit();
  page = await entry();
  await application.evaluate(({ dialog }) => {
    globalThis.portfolioHeld = false;
    dialog.showMessageBox = async () => {
      globalThis.portfolioHeld = true;
      await new Promise((resolve) => {
        globalThis.portfolioRelease = resolve;
      });
      return { response: 0 };
    };
  });
  await page.locator('footer a[href="https://github.com/JasonStys"]').click();
  await expect(page.locator("[data-native-status]")).toHaveText(
    "Choose Open or Cancel in the public-link dialog.",
  );
  expect(await application.evaluate(() => globalThis.portfolioHeld)).toBe(true);
  await application.evaluate(({ app, BrowserWindow }) => {
    app.quit();
    BrowserWindow.getAllWindows()[0].close();
    app.quit();
  });
  await expect(page.locator("[data-native-status]")).toContainText("Finishing the accepted");
  expect(application.process().exitCode).toBeNull();
  expect(fs.existsSync(path.join(profile, "owner.lock"))).toBe(true);
  const exited = once(application.process(), "exit");
  await application.evaluate(() => globalThis.portfolioRelease());
  const [code, signal] = await bounded(exited, 30000, "Held confirmed-link Quit did not finish.");
  expect(code).toBe(0);
  expect(signal).toBeNull();
  exits.push(code);
  expect(fs.existsSync(path.join(profile, "owner.lock"))).toBe(false);
  expect(fs.readFileSync(path.join(profile, "owner.json")).equals(marker)).toBe(true);
  expect(pageErrors).toEqual([]);
  expect(outsideResponses).toEqual([]);
  steps.push(
    "same durable profile restart; repeated Quit/Close retains accepted dialog and owner until actual completion; both normal exits0",
  );
  fs.writeFileSync(
    path.join(output, "acceptance.json"),
    JSON.stringify(
      {
        success: true,
        sourceMode: source,
        identities,
        layouts,
        steps,
        exits,
        pageErrors,
        outsideResponses,
        diagnostics,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify({ success: true, sourceMode: source, exits, workflows: steps.length }),
  );
} catch (error) {
  let failureCleanup;
  if (application && application.process().exitCode === null) {
    try {
      const ended = once(application.process(), "exit");
      await application.evaluate(({ app }) => app.quit());
      failureCleanup = await bounded(
        ended,
        30000,
        "Failed journey's normal cleanup remains pending.",
      );
    } catch (cleanupError) {
      failureCleanup = { pending: true, message: cleanupError.message };
    }
  }
  fs.writeFileSync(
    path.join(output, "failure.json"),
    JSON.stringify(
      {
        success: false,
        message: error.message,
        stack: error.stack,
        identities,
        steps,
        exits,
        pageErrors,
        diagnostics,
        failureCleanup,
      },
      null,
      2,
    ) + "\n",
  );
  throw error;
}
