const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.AIHUES_EVAL_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve(
  __dirname,
  '..',
  'screenshots',
  `eval-${new Date().toISOString().slice(0, 10)}`
);

const pages = [
  { route: '/', name: 'home' },
  { route: '/tools', name: 'tools-catalog' },
  { route: '/tools/humanize', name: 'tool-humanize' },
  { route: '/tools/kimi-code', name: 'tool-kimi-code' },
  { route: '/pricing', name: 'pricing' },
  { route: '/privacy', name: 'privacy' },
  { route: '/wishlist', name: 'wishlist' },
  { route: '/about', name: 'about' },
  { route: '/blog/ai-writing-tools-guide', name: 'blog-post' },
];

async function capture(pageConfig, browser, viewport, prefix) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor || 1,
  });
  const page = await context.newPage();

  // Clear consent so cookie banner is visible on each shot.
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('aihues-cookie-consent'));

  await page.goto(`${BASE_URL}${pageConfig.route}`, {
    waitUntil: 'networkidle',
  });
  // Give animations/layout a moment.
  await page.waitForTimeout(800);

  const fileName = `${prefix}-${pageConfig.name}.png`;
  const filePath = path.join(OUT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  await context.close();
  return fileName;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const desktop = { width: 1280, height: 900, deviceScaleFactor: 1 };
  const mobile = { width: 390, height: 844, deviceScaleFactor: 2 };

  for (const pageConfig of pages) {
    const desktopFile = await capture(pageConfig, browser, desktop, 'desktop');
    const mobileFile = await capture(pageConfig, browser, mobile, 'mobile');
    console.log(`Captured ${pageConfig.name}: ${desktopFile}, ${mobileFile}`);
  }

  await browser.close();
  console.log(`\nAll screenshots saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
