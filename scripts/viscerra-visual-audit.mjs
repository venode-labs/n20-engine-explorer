import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const baseURL = process.env.VISCERRA_BASE_URL || 'http://127.0.0.1:8080';
const out = process.env.VISCERRA_AUDIT_DIR || 'audit/visual';
mkdirSync(out, { recursive: true });

const launch = { headless: true };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
const browser = await chromium.launch(launch);
const verdicts = [];

const WELT_HITS = [
  'engine-cover', 'oil-cap', 'oil-filter-module', 'oil-cooler', 'alternator',
  'serpentine-belt', 'ac-compressor', 'crank-pulley', 'electric-coolant-pump',
  'turbocharger', 'boost-pipe',
];
const BAY_HITS = ['engine-cover', 'oil-cap', 'charge-pipe', 'airbox'];
const CLICK_LABELS = {
  'engine-cover': 'Engine acoustic cover',
  'oil-cap': 'Oil filler cap',
  'oil-filter-module': 'Oil filter module',
  'oil-cooler': 'Engine oil-to-coolant heat exchanger',
  alternator: 'Alternator',
  'serpentine-belt': 'Serpentine belt',
  'ac-compressor': 'A/C compressor',
  'crank-pulley': 'Crankshaft pulley / harmonic balancer',
  'electric-coolant-pump': 'Electric coolant pump',
  turbocharger: 'Twin-scroll turbocharger',
  'boost-pipe': 'Compressor outlet (boost pipe)',
  'charge-pipe': 'Charge pipe',
  airbox: 'Intake silencer (airbox)',
};
const UNRESOLVED_COPY = 'Not marked on this photograph. Open the 3D schematic.';
const MODE_GROUP = 'Engine visual mode';

function saveVerdicts() {
  writeFileSync(path.join(out, 'verdicts.json'), JSON.stringify(verdicts, null, 2));
}

async function assertFirstPartyShell(page) {
  const residue = await page.locator('script[src*="grok.com"], link[href*="/__grok/"]').count();
  if (residue !== 0) throw new Error(`Builder residue found in production document: ${residue} injected node(s)`);
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  if (manifest !== '/manifest.webmanifest') throw new Error(`Unexpected manifest href: ${manifest}`);
  const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
  if (ogType !== 'website') throw new Error(`Unexpected og:type: ${ogType}`);
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  if (ogImage !== '/og.jpg') throw new Error(`Unexpected og:image: ${ogImage}`);
}

async function capture(name, viewport, route = '/', action) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle', timeout: 60_000 });
    await assertFirstPartyShell(page);
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 30_000 });
    await page.waitForTimeout(900);
    if (action) await action(page);
    await page.waitForTimeout(500);

    const layout = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      title: document.title,
    }));
    if (layout.width !== viewport.width || layout.height !== viewport.height) throw new Error(`${name}: viewport mismatch ${JSON.stringify(layout)}`);
    if (layout.scrollWidth > layout.width + 1) throw new Error(`${name}: horizontal overflow ${layout.scrollWidth} > ${layout.width}`);
    if (errors.length) throw new Error(`${name}: browser errors: ${errors.join(' | ')}`);

    const canvasVisible = await canvas.isVisible().catch(() => false);
    const box = canvasVisible ? await canvas.boundingBox() : null;
    if (canvasVisible && (!box || box.width < viewport.width * 0.55 || box.height < viewport.height * 0.55)) {
      throw new Error(`${name}: canvas too small ${JSON.stringify(box)}`);
    }

    await page.screenshot({ path: path.join(out, `${name}.png`), animations: 'disabled' });
    verdicts.push({ name, status: 'pass', ...layout, canvas: box });
  } catch (error) {
    verdicts.push({ name, status: 'fail', error: String(error) });
    saveVerdicts();
    throw error;
  } finally {
    await page.close();
  }
}

async function assertUnresolved(page) {
  const body = await page.locator('body').innerText();
  if (!body.includes(UNRESOLVED_COPY)) throw new Error(`Expected unresolved-photo copy: ${UNRESOLVED_COPY}`);
}

async function assertMobileModeSwitch(page) {
  const group = page.getByRole('group', { name: MODE_GROUP });
  const buttons = group.getByRole('button');
  const count = await buttons.count();
  if (count !== 3) throw new Error(`Expected 3 visual mode buttons, found ${count}`);
  for (let i = 0; i < count; i += 1) {
    const box = await buttons.nth(i).boundingBox();
    if (!box || box.height < 40) throw new Error(`Mode button ${i} touch target too small: ${JSON.stringify(box)}`);
  }
  const xray = group.getByRole('button', { name: /X-ray:/i });
  const rectCount = await xray.locator('span').evaluate((element) => element.getClientRects().length);
  if (rectCount !== 1) throw new Error(`X-ray label wrapped to ${rectCount} lines`);
}

async function assertNarrowHeader(page) {
  const expected = ['Engine', 'Systems', 'Bay', 'Reference'];
  for (const label of expected) {
    const button = page.getByRole('button', { name: label, exact: true }).first();
    const box = await button.boundingBox();
    if (!box || box.x < -0.5 || box.x + box.width > 320.5) {
      throw new Error(`${label}: primary nav is not visible at 320px: ${JSON.stringify(box)}`);
    }
  }
}

async function assertNarrowStageControls(page) {
  const expected = ['Isolate selected component', 'Compare to source photograph', 'Reset view'];
  for (const label of expected) {
    const button = page.getByRole('button', { name: label, exact: true });
    const box = await button.boundingBox();
    if (!box) throw new Error(`${label}: control missing at 320px`);
    if (box.height < 40 || box.width < 40) throw new Error(`${label}: touch target too small at 320px: ${JSON.stringify(box)}`);
    if (box.x < -0.5 || box.x + box.width > 320.5) throw new Error(`${label}: control is clipped at 320px: ${JSON.stringify(box)}`);
  }
}

async function assertMobileSheetHierarchy(page) {
  const sheet = page.locator('[data-ui="bottom-sheet"]');
  await sheet.waitFor({ state: 'visible' });
  const duplicateTitleCount = await sheet.getByText('Twin-scroll turbocharger', { exact: true }).count();
  if (duplicateTitleCount !== 1) throw new Error(`Mobile inspector title rendered ${duplicateTitleCount} times inside the sheet`);
  const closeCount = await sheet.getByRole('button', { name: 'Close details', exact: true }).count();
  if (closeCount !== 1) throw new Error(`Mobile inspector exposes ${closeCount} dedicated close controls inside the sheet`);
  const focusInside = await sheet.evaluate((node) => node.contains(document.activeElement));
  if (!focusInside) throw new Error('Mobile inspector sheet does not own focus');
  const backgroundModeGroups = await page.getByRole('group', { name: MODE_GROUP }).count();
  if (backgroundModeGroups !== 0) throw new Error('Mobile inspector did not isolate background controls from the accessibility tree');
}

async function assertDialogFocus(page, dialogName) {
  const dialog = page.getByRole('dialog', { name: dialogName });
  await dialog.waitFor({ state: 'visible' });
  const focusInside = await dialog.evaluate((node) => node.contains(document.activeElement));
  if (!focusInside) throw new Error(`${dialogName}: focus escaped modal content`);
}

async function assertQuickIssue(page, label, expectedText) {
  await page.getByRole('button', { name: label, exact: true }).click();
  const input = page.getByPlaceholder('Part or symptom…').first();
  if (!(await input.inputValue())) throw new Error(`${label}: quick issue did not populate search`);
  const list = page.locator('[aria-label="Engine components"]');
  if ((await list.getByRole('button').count()) < 1) throw new Error(`${label}: quick issue returned no actionable component`);
  if (expectedText && !(await list.innerText()).includes(expectedText)) throw new Error(`${label}: expected ${expectedText} in results`);
}

async function assertInspectorActions(page) {
  const group = page.getByRole('group', { name: 'Locate component' });
  const photo = group.getByRole('button', { name: /Show on photo/i });
  const model = group.getByRole('button', { name: /Inspect in 3D/i });
  const xray = group.getByRole('button', { name: /X-ray/i });
  if ((await photo.count()) !== 1 || (await model.count()) !== 1 || (await xray.count()) !== 1) {
    throw new Error('Turbo inspector is missing one or more primary locate actions');
  }
  await model.click();
  await page.waitForTimeout(900);
  if ((await model.getAttribute('aria-pressed')) !== 'true') throw new Error('Inspect in 3D did not activate 3D mode');
  await xray.click();
  await page.waitForTimeout(900);
  if ((await xray.getAttribute('aria-pressed')) !== 'true') throw new Error('X-ray action did not activate X-ray mode');
  await photo.click();
  await page.waitForTimeout(900);
  if ((await photo.getAttribute('aria-pressed')) !== 'true') throw new Error('Show on photo did not return to the verified photo');
  const selected = await page.evaluate(() => new URL(window.location.href).searchParams.get('part'));
  if (selected !== 'turbocharger') throw new Error(`Component selection was lost while switching evidence modes: ${selected}`);
}

async function verifyPhotoClickMatrix(photoId, ids, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  try {
    for (const id of ids) {
      errors.length = 0;
      const view = photoId === 'bay' ? 'bay' : 'engine';
      await page.goto(`${baseURL}/?mode=photo&view=${view}&part=${id}`, { waitUntil: 'networkidle', timeout: 60_000 });
      await assertFirstPartyShell(page);
      const canvas = page.locator('canvas');
      await canvas.waitFor({ state: 'visible', timeout: 30_000 });
      await page.waitForTimeout(1500);

      await page.keyboard.press('Escape');
      await page.waitForTimeout(180);
      const afterClear = await page.evaluate(() => new URL(window.location.href).searchParams.get('part'));
      if (afterClear !== null) throw new Error(`${photoId}/${id}: Escape did not clear the seeded selection`);

      const box = await canvas.boundingBox();
      if (!box) throw new Error(`${photoId}/${id}: canvas missing before pointer verification`);
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForFunction(
        (expected) => new URL(window.location.href).searchParams.get('part') === expected,
        id,
        { timeout: 5_000 },
      );

      const heading = page.getByRole('heading', { name: CLICK_LABELS[id], exact: true });
      if ((await heading.count()) !== 1) throw new Error(`${photoId}/${id}: inspector did not identify ${CLICK_LABELS[id]}`);
      if (errors.length) throw new Error(`${photoId}/${id}: browser errors: ${errors.join(' | ')}`);
      verdicts.push({ name: `photo-click-${photoId}-${id}`, status: 'pass' });
    }
  } catch (error) {
    verdicts.push({ name: `photo-click-matrix-${photoId}`, status: 'fail', error: String(error) });
    saveVerdicts();
    throw error;
  } finally {
    await page.close();
  }
}

const desktop = { width: 1440, height: 900 };
const laptop = { width: 1366, height: 768 };
const wide = { width: 1920, height: 1080 };
const mobile = { width: 390, height: 844 };
const mobileSmall = { width: 360, height: 800 };
const mobileLarge = { width: 430, height: 932 };
const narrow = { width: 320, height: 720 };

await capture('desktop-photo-default-1440x900', desktop);
await capture('laptop-photo-default-1366x768', laptop);
await capture('desktop-wide-photo-default-1920x1080', wide);

for (const id of WELT_HITS) {
  await capture(`desktop-welt-hit-${id}-1440x900`, desktop, `/?mode=photo&view=engine&part=${id}`);
}
for (const id of BAY_HITS) {
  await capture(`desktop-bay-hit-${id}-1440x900`, desktop, `/?mode=photo&view=bay&part=${id}`);
}

await verifyPhotoClickMatrix('welt', WELT_HITS, desktop);
await verifyPhotoClickMatrix('bay', BAY_HITS, desktop);

await capture('desktop-unresolved-vanos-photo-1440x900', desktop, '/?mode=photo&view=engine&part=vanos-intake', assertUnresolved);
await capture('desktop-unresolved-tensioner-photo-1440x900', desktop, '/?mode=photo&view=engine&part=belt-tensioner', assertUnresolved);
await capture('desktop-bay-unresolved-oil-filter-module-1440x900', desktop, '/?mode=photo&view=bay&part=oil-filter-module', assertUnresolved);
await capture('desktop-bay-unresolved-oil-cooler-1440x900', desktop, '/?mode=photo&view=bay&part=oil-cooler', assertUnresolved);
await capture('desktop-3d-default-1440x900', desktop, '/?mode=model');
await capture('desktop-xray-default-1440x900', desktop, '/?mode=xray');
await capture('desktop-3d-exploded-1440x900', desktop, '/?mode=model&explode=1');
await capture('desktop-turbo-evidence-actions-1440x900', desktop, '/?mode=photo&view=engine&part=turbocharger', assertInspectorActions);

await capture('desktop-systems-1440x900', desktop, '/', async page => {
  await page.getByRole('button', { name: 'Systems', exact: true }).click();
  await page.getByRole('heading', { name: 'How the N20 is put together' }).waitFor();
});
await capture('desktop-reference-1440x900', desktop, '/', async page => {
  await page.getByRole('button', { name: 'Reference', exact: true }).click();
  await page.getByRole('heading', { name: /2015 BMW 428i F32/i }).waitFor();
});
await capture('desktop-vin-dialog-1440x900', desktop, '/', async page => {
  await page.getByRole('button', { name: 'VIN', exact: true }).click();
  await assertDialogFocus(page, 'Vehicle identification');
  const copy = await page.getByRole('dialog', { name: 'Vehicle identification' }).innerText();
  if (copy.toLowerCase().includes('prototype')) throw new Error('VIN dialog still exposes prototype copy');
});
await capture('desktop-help-dialog-1440x900', desktop, '/', async page => {
  await page.getByRole('button', { name: 'Keyboard shortcuts' }).click();
  await assertDialogFocus(page, 'How to inspect');
});

const expectedSearch = {
  turbo: 'Twin-scroll turbocharger',
  'oil filter': 'Oil filter module',
  misfire: 'Ignition coils',
};
for (const [query, expected] of Object.entries(expectedSearch)) {
  await capture(`desktop-search-${query.replace(/\s+/g, '-')}-1440x900`, desktop, '/', async page => {
    await page.keyboard.press('/');
    const palette = page.getByRole('dialog', { name: 'Search parts' });
    await assertDialogFocus(page, 'Search parts');
    const input = page.getByPlaceholder(/Search parts, systems, symptoms/i).first();
    if (!(await input.evaluate((node) => node === document.activeElement))) throw new Error(`${query}: search input did not receive focus`);
    await input.fill(query);
    await page.waitForTimeout(250);
    const paletteText = await palette.innerText();
    if (paletteText.includes('No match.')) throw new Error(`${query}: search returned No match`);
    if (!paletteText.includes(expected)) throw new Error(`${query}: expected search result ${expected}`);
    await page.keyboard.press('Tab');
    await assertDialogFocus(page, 'Search parts');
  });
}

await capture('desktop-quick-issues-1440x900', desktop, '/', async page => {
  await assertQuickIssue(page, 'Misfire', 'Ignition coils');
  await assertQuickIssue(page, 'Oil leak');
  await assertQuickIssue(page, 'Boost leak');
  await assertQuickIssue(page, 'Overheat', 'Electric coolant pump');
});

await capture('mobile-photo-default-390x844', mobile, '/', assertMobileModeSwitch);
await capture('mobile-small-photo-default-360x800', mobileSmall, '/', assertMobileModeSwitch);
await capture('mobile-large-photo-default-430x932', mobileLarge, '/', assertMobileModeSwitch);
await capture('mobile-catalogue-390x844', mobile, '/', async page => {
  await page.getByRole('button', { name: 'Open parts' }).click();
});
await capture('mobile-selected-turbo-390x844', mobile, '/?mode=photo&part=turbocharger', assertMobileSheetHierarchy);
await capture('mobile-3d-390x844', mobile, '/?mode=model', assertMobileModeSwitch);
await capture('mobile-xray-390x844', mobile, '/?mode=xray', assertMobileModeSwitch);
await capture('mobile-systems-390x844', mobile, '/', async page => {
  await page.getByRole('button', { name: 'Systems', exact: true }).click();
  await page.getByRole('heading', { name: 'How the N20 is put together' }).waitFor();
});
await capture('mobile-reference-390x844', mobile, '/', async page => {
  await page.getByRole('button', { name: 'Reference', exact: true }).click();
  await page.getByRole('heading', { name: /2015 BMW 428i F32/i }).waitFor();
});
await capture('mobile-narrow-320x720', narrow, '/', async page => {
  await assertMobileModeSwitch(page);
  await assertNarrowHeader(page);
  await assertNarrowStageControls(page);
});

saveVerdicts();
await browser.close();
console.log(`Viscerra visual audit: ${verdicts.filter((verdict) => verdict.status === 'pass').length} checks passed`);
console.log(`Visual audit evidence written to ${out}`);
