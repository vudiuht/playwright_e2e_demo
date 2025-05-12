import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { testConfig } from '../config/test-config';

// Define the type for our custom fixtures
type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  loggedInPage: {
    page: any;
    dashboardPage: DashboardPage;
  };
};

// Create a test object with our custom fixtures
export const test = base.extend<AuthFixtures>({
  // Basic page objects
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  
  // Pre-authenticated page fixture with a more meaningful name
  loggedInPage: async ({ page }, use) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Navigate to login page
    await loginPage.goto();
    
    // Step 2: Login with valid credentials from config
    const { username, password } = testConfig.credentials.admin;
    await loginPage.login(username, password);
    
    // Step 3: Wait for dashboard to load with increased timeout
    await page.waitForURL('**/dashboard/index', { timeout: 30000 });
    
    // Add a small delay to ensure page is fully loaded
    await page.waitForTimeout(2000);
    
    // Wait for dashboard page to load
    await dashboardPage.waitForPageLoad();
    
    // Add more detailed logging for debugging
    console.log('Checking if dashboard is loaded...');
    const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
    console.log(`Dashboard loaded check result: ${isDashboardLoaded}`);
    
    if (!isDashboardLoaded) {
      // Take a screenshot for debugging
      await page.screenshot({ path: 'dashboard-load-failure.png' });
      console.log('Dashboard failed to load. Current URL:', page.url());
      console.log('Page title:', await page.title());
      
      // Try with a more generic approach as fallback
      const dashboardIndicator = await page.locator('h6, .oxd-topbar-header, .oxd-topbar').isVisible();
      if (dashboardIndicator) {
        console.log('Found alternative dashboard indicator, proceeding with test');
        // Provide the authenticated page and dashboard page to the test
        await use({ page, dashboardPage });
        return;
      }
      
      throw new Error('Dashboard failed to load after authentication');
    }
    
    // Provide the authenticated page and dashboard page to the test
    await use({ page, dashboardPage });
    
    // Optional: Logout after test if needed
    // await dashboardPage.logout();
  },
});

// Export expect as well for convenience
export { expect } from '@playwright/test';
