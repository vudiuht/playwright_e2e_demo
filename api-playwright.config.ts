import { defineConfig } from '@playwright/test';
import { testConfig } from './config/test-config';

export default defineConfig({
  testDir: './tests/api',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: testConfig.apiUrl,
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/*.spec.ts',
    },
  ],
});