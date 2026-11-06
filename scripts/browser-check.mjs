import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const port = 4174;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
const serverExit = once(server, 'exit');
let browser;
try {
  await Promise.race([
    once(server.stdout, 'data'),
    serverExit.then(([code]) => { throw new Error(`Preview server exited: ${code}`); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Preview server startup timed out')), 10000).unref()),
  ]);
  assert.equal((await fetch(base)).status, 200);
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(base);
  assert.equal(await page.locator('h1').count(), 1);
  for (const width of [320, 375, 650, 768, 900, 901, 1100, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    const results = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })), [], `Accessibility violations at ${width}px`);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  const toggle = page.getByRole('button', { name: /Menu/ });
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.getByRole('navigation').isVisible(), false);
  await toggle.focus();
  await page.keyboard.press('Enter');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.getByRole('navigation').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await toggle.evaluate((el) => el === document.activeElement), true);
  await toggle.click();
  await page.getByRole('navigation').getByRole('link', { name: 'Selected work' }).click();
  assert.equal(new URL(page.url()).hash, '#work');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.equal(await page.getByRole('navigation').isVisible(), true);
  const readability = await page.evaluate(() => {
    const font = (selector) => Number.parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
    const banner = document.querySelector('.signal-band').getBoundingClientRect();
    const firstLabel = document.querySelector('#toolkit .section-heading .eyebrow').getBoundingClientRect();
    return {
      sectionLabel: font('#toolkit .section-heading .eyebrow'),
      skillHeading: font('.skills-grid h3'),
      cardLabel: font('.card-top'),
      supportingCopy: font('.section-heading > p'),
      bannerSecondary: font('.signal-grid span'),
      panelLabel: font('.panel-top'),
      bannerGap: firstLabel.top - banner.bottom,
    };
  });
  for (const [label, size] of Object.entries(readability).filter(([key]) => key !== 'bannerGap')) {
    assert.ok(size >= 12, `${label} should be at least 12px at desktop, got ${size}px`);
  }
  assert.ok(readability.bannerGap >= 70, `Desktop banner-to-heading gap should be >=70px, got ${readability.bannerGap}px`);
  await page.setViewportSize({ width: 375, height: 812 });
  const mobileReadability = await page.evaluate(() => {
    const font = (selector) => Number.parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
    const banner = document.querySelector('.signal-band').getBoundingClientRect();
    const firstLabel = document.querySelector('#toolkit .section-heading .eyebrow').getBoundingClientRect();
    return {
      sectionLabel: font('#toolkit .section-heading .eyebrow'),
      skillHeading: font('.skills-grid h3'),
      cardLabel: font('.card-top'),
      supportingCopy: font('.section-heading > p'),
      bannerSecondary: font('.signal-grid span'),
      panelLabel: font('.panel-top'),
      bannerGap: firstLabel.top - banner.bottom,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  for (const [label, size] of Object.entries(mobileReadability).filter(([key]) => key !== 'bannerGap' && key !== 'overflow')) {
    assert.ok(size >= 12, `${label} should be at least 12px on mobile, got ${size}px`);
  }
  assert.ok(mobileReadability.bannerGap >= 45, `Mobile banner-to-heading gap should be >=45px, got ${mobileReadability.bannerGap}px`);
  assert.equal(mobileReadability.overflow, false, 'Mobile layout should not overflow horizontally');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: /Download resume PDF/ }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'reginald-smith-resume.pdf');
  assert.equal(await download.failure(), null);
  const response = await page.request.get(`${base}/reginald-smith-resume.pdf`);
  assert.equal(response.headers()['content-type'], 'application/pdf');
  assert.ok((await response.body()).byteLength > 5000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  assert.equal(await page.locator('.button').first().evaluate((el) => getComputedStyle(el).transitionDuration), '0s');
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.site-header').isVisible(), false);
  assert.equal(await page.getByRole('heading', { name: 'A track record of delivery.' }).isVisible(), true);
  assert.deepEqual(errors, []);

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const plainPage = await noJs.newPage();
  await plainPage.goto(base);
  assert.equal(await plainPage.getByRole('navigation').isVisible(), true);
  await plainPage.getByRole('navigation').getByRole('link', { name: 'Experience', exact: true }).click();
  assert.equal(new URL(plainPage.url()).hash, '#career');
  assert.ok(await plainPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await noJs.close();
  console.log(`Browser checks passed: 8 viewport widths, axe accessibility, keyboard/touch menu, navigation, no-JS fallback, PDF download, print and reduced motion. Readability metrics: ${JSON.stringify({ desktop: readability, mobile: mobileReadability })}`);
} finally {
  if (browser) await browser.close();
  server.kill();
  await serverExit;
}
