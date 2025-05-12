import { testConfig } from '../../../config/test-config';
import { test, expect } from '../../../fixtures/auth-fixtures';
import { LoginPage } from '../../../pages/LoginPage';
import { DashboardPage } from '../../../pages/DashboardPage';

test.describe('Login with Valid Credentials', () => {
  test('User can login with valid credentials', async ({ loggedInPage, loginPage, page }) => {
    const { dashboardPage } = loggedInPage;    
    // Verify successful login
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
    expect(await dashboardPage.getDashboardTitle()).toContain('Dashboard');
    
    // Verify user profile and menu access
    const profileName = await dashboardPage.getProfileName();
    expect(profileName.length).toBeGreaterThan(0);
    expect(await dashboardPage.doesMenuExist('Admin')).toBeTruthy();
  
  });

  test('TC_LOGIN_007:Case-insensitive username', async ({ page }) => {
    // Initialize login page
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // 1. Navigate to login page
    await loginPage.goto();
    await loginPage.waitForPageLoad();
    
    // 2. Enter lowercase username
    // 3. Enter valid password
    const { username, password } = testConfig.credentials.admin;
    const lowercaseUsername = username.toLowerCase();
    
    await loginPage.login(lowercaseUsername, password);
    
    // 4. Click Login (already done in login method)
    
    // Check if login succeeded (case-insensitive system)
    await page.waitForURL('**/web/index.php/dashboard/index', { timeout: 5000 });
    
    // Wait for dashboard page to fully load
    await dashboardPage.waitForPageLoad();
    
    // Add retry mechanism for checking dashboard
    let isDashboardLoaded = false;
    for (let i = 0; i < 3; i++) {
      isDashboardLoaded = await dashboardPage.isDashboardLoaded();
      if (isDashboardLoaded) break;
      console.log(`Retry ${i+1}: Waiting for dashboard to load...`);
      await page.waitForTimeout(1000); // Wait 1 second between retries
    }
    
    // Verify dashboard is loaded
    expect(isDashboardLoaded).toBeTruthy();
    
    // Logout for cleanup
    await dashboardPage.logout();
  });
  test('TC_LOGIN_008: Submit login form using ENTER key', async ({ page }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Test data
    const { username, password } = testConfig.credentials.admin;
    
    // Step 1: Navigate to login page and wait for it to be ready
    await loginPage.goto();
    
    // Step 2: Enter valid credentials
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    
    // Step 3: Press ENTER instead of clicking Login
    await page.keyboard.press('Enter');
    
    // Wait for navigation to dashboard with increased timeout
    await page.waitForURL('**/dashboard/index', { timeout: 15000 });
    
    // Wait for dashboard page to fully load
    await dashboardPage.waitForPageLoad();
    
    // Add retry mechanism for checking dashboard
    let isDashboardLoaded = false;
    for (let i = 0; i < 5; i++) {
      isDashboardLoaded = await dashboardPage.isDashboardLoaded();
      if (isDashboardLoaded) break;
      console.log(`Retry ${i+1}: Waiting for dashboard to load...`);
      await page.waitForTimeout(2000); // Wait 2 seconds between retries
    }
    
    // Verify dashboard is loaded
    expect(isDashboardLoaded).toBeTruthy();
    
    // Only proceed with additional checks if dashboard is loaded
    if (isDashboardLoaded) {
      expect(await dashboardPage.getDashboardTitle()).toContain('Dashboard');
      
      // Additional verification: Check user profile is accessible
      const profileName = await dashboardPage.getProfileName();
      expect(profileName.length).toBeGreaterThan(0);
    }
  });

});
