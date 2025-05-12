import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { testConfig } from '../config/test-config';

export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = '.oxd-alert-content-text';
  private readonly forgotPasswordLink = '.orangehrm-login-forgot';
  private readonly logoImage = '.orangehrm-login-branding img';
  private readonly loginTitle = '.orangehrm-login-title';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.page.locator(this.usernameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
  }

  /**
   * Login with admin credentials from config
   */
  async loginAsAdmin(): Promise<void> {
    const { username, password } = testConfig.credentials.admin;
    await this.login(username, password);
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.page.locator(this.loginTitle).isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.page.locator(this.errorMessage).innerText();
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.page.locator(this.errorMessage).isVisible();
  }

  /**
   * Click on forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.page.locator(this.forgotPasswordLink).click();
  }

  /**
   * Check if logo is displayed
   */
  async isLogoDisplayed(): Promise<boolean> {
    return await this.page.locator(this.logoImage).isVisible();
  }

  /**
   * Get login page title
   */
  async getLoginTitle(): Promise<string> {
    return await this.page.locator(this.loginTitle).innerText();
  }
}
