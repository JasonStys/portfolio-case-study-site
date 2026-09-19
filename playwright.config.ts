/**
 * @file Configures production-build navigation, filtering, accessibility, and layout tests.
 * Functions: defineConfig invocation.
 * Variables: baseURL, webServer, and browser projects.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4392/portfolio-case-study-site/";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? {} : { workers: 1 }),
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4392",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
