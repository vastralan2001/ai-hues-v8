import { test, expect } from '@playwright/test';

test.describe('AIHues smoke tests', () => {
  test('homepage loads and shows key elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AIHues/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('tools catalog page loads', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.locator('h1')).toContainText(/Tools|工具/);
    await expect(page.locator('body')).toContainText(/word-count|Word Count/i);
  });

  test('tool detail page loads for word-count', async ({ page }) => {
    await page.goto('/tools/word-count');
    await expect(page).toHaveURL(/\/tools\/word-count/);
    await expect(page.locator('h1').first()).toContainText(/Word Counter|字数/);
  });

  test('games page loads', async ({ page }) => {
    await page.goto('/games');
    await expect(page.locator('h1')).toContainText(/Games|游戏/);
  });

  test('wishlist page loads and can submit a wish', async ({ page }) => {
    await page.goto('/wishlist');
    await expect(page.locator('h1')).toContainText(/Wishlist|愿望清单/);

    const titleInput = page
      .locator(
        'input[placeholder*="Give it a name"], input[placeholder*="给它起个名字"]'
      )
      .first();
    const descInput = page.locator('textarea').first();
    const emailInput = page
      .locator(
        'input[type="email"], input[placeholder*="Get notified"], input[placeholder*="上线后通知你"]'
      )
      .first();
    const submitButton = page
      .locator('button[type="button"]')
      .filter({ hasText: /Submit|提交/ })
      .first();

    await titleInput.fill('E2E Test Wish');
    await descInput.fill('Submitted by Playwright smoke test');
    await emailInput.fill('e2e@example.com');
    await submitButton.click();

    await expect(page.locator('body')).toContainText(
      /Submitted successfully|提交成功/
    );
    await expect(page.locator('body')).toContainText('E2E Test Wish');
  });

  test('removed pages return 404', async ({ page }) => {
    for (const path of ['/ranking', '/demo', '/design-preview']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    }
  });
});
