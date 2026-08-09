import { defineConfig } from '@playwright/test'

const externalBaseURL = process.env.E2E_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results/gateway-bot-visual',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: externalBaseURL || 'http://127.0.0.1:61439',
    colorScheme: 'dark',
    storageState: process.env.E2E_STORAGE_STATE || undefined,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet-1024', use: { viewport: { width: 1024, height: 768 } } },
    { name: 'mobile-390', use: { viewport: { width: 390, height: 844 } } },
    { name: 'mobile-360', use: { viewport: { width: 360, height: 800 } } },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'pnpm run preview --host 127.0.0.1 --port 61439',
        url: 'http://127.0.0.1:61439/home',
        reuseExistingServer: true,
        timeout: 30_000,
      },
})
