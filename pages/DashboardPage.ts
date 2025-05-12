import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Improved selectors using role-based and text-based locators
  
  /**
   * Check if dashboard is loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    const element = this.page.locator('.oxd-topbar-header-breadcrumb h6');
    const isVisible = await element.isVisible().catch(() => false);
    
    if (isVisible) {
      const text = await element.innerText();
      console.log(`Dashboard element found with text: "${text}"`);
      return text.includes('Dashboard');
    }
    
    console.log('Dashboard element not visible');
    return false;
  }
  /**
   * Get dashboard title text
   */
  async getDashboardTitle(): Promise<string> {
    return await this.page.getByRole('heading', { name: /dashboard/i }).innerText();
  }

  /**
   * Get user profile name
   */
  async getProfileName(): Promise<string> {
    return await this.page.locator('.oxd-userdropdown-name').innerText();
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    // Click on the user dropdown
    await this.page.locator('.oxd-userdropdown-tab').click();
    
    // Wait for the dropdown menu to appear
    await this.page.getByRole('menuitem', { name: /logout/i }).waitFor({ state: 'visible', timeout: 5000 });
    
    // Click on logout
    await this.page.getByRole('menuitem', { name: /logout/i }).click();
    
    // Wait for navigation to complete
    try {
      // Wait for URL to change to login page
      await this.page.waitForURL('**/auth/login', { timeout: 10000 });
    } catch (error) {
      console.log('Timeout waiting for redirect after logout, continuing test');
    }
  }

  /**
   * Check if a specific menu item exists
   */
  async doesMenuExist(menuName: string): Promise<boolean> {
    return await this.page.getByRole('link', { name: menuName, exact: false }).isVisible();
  }
}
