import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './config/test-config';

// Add a console log to verify the config is being loaded
console.log('Loading Playwright config with projects');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testConfig.baseUrl,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // API testing project - doesn't use a browser
    {
      name: 'api',
      testMatch: /.*api.*\.spec\.ts/,
      use: { },
    },
    
    // Browser testing projects
    {
      name: 'chromium',
      testMatch: /.*(?<!api)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: /.*(?<!api)\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: /.*(?<!api)\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
