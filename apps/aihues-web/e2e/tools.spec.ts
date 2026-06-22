import { test, expect } from '@playwright/test';

test.describe('Tool interactions', () => {
  test('word-count updates stats on input', async ({ page }) => {
    await page.goto('/tools/word-count');

    const input = page.locator('[data-testid="word-count-input"]');
    await input.fill('hello world');

    const stats = page.locator('[data-testid="word-count-stats"]');
    await expect(stats).toContainText('11'); // chars
    await expect(stats).toContainText('2'); // words
  });

  test('base64 encodes input', async ({ page }) => {
    await page.goto('/tools/base64');

    await page.locator('[data-testid="base64-input"]').fill('hello');
    await page.locator('[data-testid="base64-encode"]').click();

    const output = page.locator('[data-testid="base64-output"]');
    await expect(output).toContainText('aGVsbG8=');
  });

  test('json formats minified input', async ({ page }) => {
    await page.goto('/tools/json');

    await page.locator('[data-testid="json-input"]').fill('{"hello":"world"}');
    await page.locator('[data-testid="json-format"]').click();

    const output = page.locator('[data-testid="json-output"]');
    await expect(output).toContainText('"hello"');
    await expect(output).toContainText('"world"');
  });

  test('uuid generates a valid uuid', async ({ page }) => {
    await page.goto('/tools/uuid');

    await page.locator('[data-testid="uuid-generate"]').click();

    const item = page.locator('[data-testid="uuid-item"]').first();
    await expect(item).toHaveText(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});
