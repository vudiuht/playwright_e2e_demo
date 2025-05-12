import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page object that all page objects inherit from
 * Contains common methods and properties used across all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param path - The path to navigate to (appended to baseURL if configured)
   */
  async goto(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be fully loaded
   * Uses a more reliable approach with timeout handling
   */
  async waitForPageLoad(timeout: number = 10000): Promise<void> {
    try {
      // First wait for DOM content to be loaded (more reliable)
      await this.page.waitForLoadState('domcontentloaded', { timeout });
      
      // Instead of using networkidle, we'll use a more reliable approach
      // Wait for any critical UI elements that indicate the page is ready
      // This is more reliable than waiting for networkidle
      
      // Example: Wait for a common element that appears on all pages
      // like a header, navigation, or footer element
      // You can customize this selector based on your application
      const commonElementSelector = 'header, nav, .main-content, #app';
      try {
        await this.page.locator(commonElementSelector).first().waitFor({ state: 'visible', timeout: 5000 });
      } catch (e) {
        console.log('Common page element not found, continuing anyway');
      }
    } catch (error) {
      console.log('Page load timeout, continuing with test');
    }
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if element is visible
   * @param selector - The selector to check visibility for
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Click on an element
   * @param selector - The selector to click on
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Fill an input field
   * @param selector - The selector of the input field
   * @param text - The text to fill in
   */
  async fill(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Get text from an element
   * @param selector - The selector to get text from
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).innerText();
  }

  /**
   * Wait for element to be visible
   * @param selector - The selector to wait for
   * @param timeout - The maximum time to wait in milliseconds
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param selector - The selector to wait for
   * @param timeout - The maximum time to wait in milliseconds
   */
  async waitForElementToBeHidden(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if element exists in DOM
   * @param selector - The selector to check
   */
  async exists(selector: string): Promise<boolean> {
    return (await this.page.locator(selector).count()) > 0;
  }

  /**
   * Hover over an element
   * @param selector - The selector to hover over
   */
  async hover(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  /**
   * Get attribute value from an element
   * @param selector - The selector to get attribute from
   * @param attributeName - The name of the attribute
   */
  async getAttribute(selector: string, attributeName: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attributeName);
  }

  /**
   * Select option from dropdown by value
   * @param selector - The selector of the dropdown
   * @param value - The value to select
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Select option from dropdown by label
   * @param selector - The selector of the dropdown
   * @param label - The label text to select
   */
  async selectOptionByText(selector: string, label: string): Promise<void> {
    await this.page.locator(selector).selectOption({ label });
  }

  /**
   * Check if element is enabled
   * @param selector - The selector to check
   */
  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isEnabled();
  }

  /**
   * Press a key on the keyboard
   * @param key - The key to press
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Take a screenshot
   * @param path - The file path to save the screenshot
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }

  /**
   * Wait for a specific URL
   * @param urlPattern - The URL pattern to wait for
   * @param timeout - The maximum time to wait in milliseconds
   */
  async waitForUrl(urlPattern: string | RegExp, timeout: number = 5000): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * Execute JavaScript in the browser context
   * @param script - The script to execute
   * @param arg - Optional argument to pass to the script
   */
  async evaluate<T>(script: string, arg?: any): Promise<T> {
    return await this.page.evaluate(script, arg);
  }
}
