import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const baseURL = process.env.VISCERRA_BASE_URL || 'http://127.0.0.1:8080';
const out = process.env.VISCERRA_AUDIT_DIR || 'audit/visual';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });

async function shot(name, viewport, action) {
  const page = await browser.newPage({ viewportSize: viewport });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(800);
  if (action) await action(page);
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) throw new Error(`${name}: horizontal overflow`);
  if (errors.length) throw new Error(`${name}: browser errors: ${errors.join(' | ')}`);
  const canvas = page.locator('canvas');
  await canvas.waitFor({ state: 'visible' });
  const box = await canvas.boundingBox();
  if (!box || box.width < viewport.width * 0.55 || box.height < viewport.height * 0.55) {
    throw new Error(`${name}: canvas too small ${JSON.stringify(box)}`);
  }
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  await page.close();
}

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

await shot('desktop-photo', desktop);
await shot('desktop-turbo', desktop, p => p.goto(`${baseURL}/?part=turbocharger`, { waitUntil: 'networkidle' }));
await shot('desktop-oil-filter', desktop, p => p.goto(`${baseURL}/?part=oil-filter-module`, { waitUntil: 'networkidle' }));
await shot('desktop-vanos-photo', desktop, p => p.goto(`${baseURL}/?part=vanos-intake`, { waitUntil: 'networkidle' }));
await shot('desktop-3d', desktop, async p => { await p.keyboard.press('2'); });
await shot('desktop-xray', desktop, async p => { await p.keyboard.press('3'); });
await shot('desktop-exploded', desktop, async p => { await p.keyboard.press('2'); await p.keyboard.press('e'); });
await shot('desktop-bay-charge-pipe', desktop, async p => {
  await p.getByRole('button', { name: 'Bay' }).click();
  await p.goto(`${baseURL}/?part=charge-pipe`, { waitUntil: 'networkidle' });
});

for (const q of ['turbo', 'oil filter', 'misfire']) {
  await shot(`desktop-search-${q.replace(/\s+/g,'-')}`, desktop, async p => {
    await p.keyboard.press('/');
    const input = p.getByPlaceholder(/Search/i).first();
    await input.fill(q);
  });
}

await shot('mobile-photo', mobile);
await shot('mobile-3d', mobile, async p => { await p.keyboard.press('2'); });
await shot('mobile-xray', mobile, async p => { await p.keyboard.press('3'); });
await shot('mobile-selected', mobile, p => p.goto(`${baseURL}/?part=turbocharger`, { waitUntil: 'networkidle' }));

await browser.close();
console.log(`Visual audit screenshots written to ${out}`);
