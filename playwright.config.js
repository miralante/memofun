'use strict';

const { defineConfig } = require('playwright/test');

const PORT = Number(process.env.PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}/`;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 600000,
  expect: { timeout: 15000 },
  workers: 1,
  fullyParallel: false,
  reporter: 'line',
  use: {
    baseURL: BASE_URL,
    locale: 'es-ES',
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: 200, // 200ms delay between each Playwright action
    },
  },
  webServer: {
    command: 'node scripts/ui-server.js',
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 10000,
  },
});
