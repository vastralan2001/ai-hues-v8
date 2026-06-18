const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = process.env.AIHUES_EVAL_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function capture(name, page) {
  const outPath = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved ${outPath}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Clear consent so cookie banner is visible.
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('aihues-cookie-consent'));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Accept cookies and reload so the banner doesn't intercept clicks.
  await page.evaluate(() =>
    localStorage.setItem('aihues-cookie-consent', 'true')
  );
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  // Screenshot 1: homepage with floating button.
  await capture('agentchat-home', page);

  // Open agent chat.
  await page.click('button[aria-label*="AI"]');
  await page.waitForTimeout(300);
  await capture('agentchat-open', page);

  // Type a message and send.
  await page.fill(
    'input[placeholder*="Ask"], input[placeholder*="问"]',
    '推荐一个 JSON 格式化工具'
  );
  await page.keyboard.press('Enter');

  // Wait for response (max 30s).
  await page.waitForFunction(
    () => {
      const bubbles = document.querySelectorAll('[class*="rounded-2xl"]');
      return bubbles.length >= 3;
    },
    { timeout: 30000 }
  );
  // Wait for the loading/thinking indicator to disappear.
  await page.waitForFunction(
    () =>
      !document.body.innerText.includes('Thinking…') &&
      !document.body.innerText.includes('思考中'),
    { timeout: 30000 }
  );
  await page.waitForTimeout(500);
  await capture('agentchat-conversation', page);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
