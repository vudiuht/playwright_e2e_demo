import { test, expect } from '../../../fixtures/auth-fixtures';

test('should perform search in menu and navigate to results', async ({ loggedInPage }) => {
  const { page, dashboardPage } = loggedInPage;
  
  // Verify dashboard is loaded
  await expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
  
  // Locate the search input in the side menu
  const searchInput = page.locator('.oxd-main-menu-search input');
  
  // Verify search input is visible
  await expect(searchInput).toBeVisible();
  
  // Enter search criteria
  await searchInput.fill('Admin');
  
  // Wait for search results to appear
  await page.waitForTimeout(500); // Small delay for search to process
  
  // Click on the first search result (Admin menu item)
  await page.locator('.oxd-main-menu-item:has-text("Admin")').click();
  
  // Verify navigation to Admin page
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h6:has-text("Admin")')).toBeVisible();
});
