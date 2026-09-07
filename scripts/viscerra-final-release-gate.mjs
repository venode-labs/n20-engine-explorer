import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';

const failures = [];
const checks = [];
const ok = (name, condition, detail = '') => {
  checks.push({ name, condition, detail });
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ''}`);
};
const text = (path) => readFileSync(path, 'utf8');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const quoted = (value) => [...value.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
const luminance = (hex) => {
  const rgb = hex.replace('#', '').match(/.{2}/g).map((pair) => parseInt(pair, 16) / 255);
  const linear = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};
const contrastRatio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const pkg = JSON.parse(text('package.json'));
const root = text('src/routes/__root.tsx');
const header = text('src/components/explorer/Header.tsx');
const explorer = text('src/components/explorer/ExplorerApp.tsx');
const store = text('src/store/explorer.ts');
const modes = text('src/components/explorer/ModeSwitch.tsx');
const hotkeys = text('src/components/explorer/useHotkeys.ts');
const photos = text('src/engine/photo-views.ts');
const photoEngine = text('src/engine/PhotoEngine.tsx');
const canvas = text('src/engine/EngineCanvas.tsx');
const part = text('src/engine/cgi/Part.tsx');
const materials = text('src/engine/cgi/materials.ts');
const explode = text('src/engine/explode.ts');
const inspector = text('src/components/explorer/Inspector.tsx');
const sheet = text('src/components/explorer/Sheet.tsx');
const chrome = text('src/components/explorer/chrome.ts');
const hint = text('src/components/explorer/HintOverlay.tsx');
const systemsView = text('src/components/explorer/SystemsView.tsx');
const technicalView = text('src/components/explorer/TechnicalView.tsx');
const commandPalette = text('src/components/explorer/CommandPalette.tsx');
const vinPanel = text('src/components/explorer/VinPanel.tsx');
const helpOverlay = text('src/components/explorer/HelpOverlay.tsx');
const styles = text('src/styles.css');
const vite = text('vite.config.ts');
const cameras = text('src/data/camera-presets.ts');
const search = text('src/data/search.ts');
const partsNav = text('src/components/explorer/PartsNav.tsx');
const componentsText = text('src/data/components.ts');
const sourcesText = text('src/data/sources.ts');

// Product identity and production integrity.
ok('package is Viscerra', pkg.name === 'viscerra');
ok('browser title uses Viscerra', /APP_NAME\s*=\s*["']Viscerra["']/.test(root));
ok('header uses Viscerra brand', /VISCERRA/.test(header));
ok('Reference replaces vague Notes navigation', /label:\s*["']Reference["']/.test(header) && !/label:\s*["']Notes["']/.test(header));
ok('production shell is free of builder bridge references', !/__grok|PreviewHostBridge|AuthProvider/.test(root));
ok('production Vite config excludes Grok PWA injection', !/grokPwaPlugin|serverDir:\s*["']\.\/server["']/.test(vite));
ok('first-party manifest exists', existsSync('public/manifest.webmanifest'));
ok('public Grok assets are removed', !existsSync('public/__grok'));
ok('first-party social metadata is explicit', /property:\s*["']og:type["'],\s*content:\s*["']website["']/.test(root) && /property:\s*["']og:image["'],\s*content:\s*["']\/og\.jpg["']/.test(root));

// Core view state and rendering.
ok('Photo is default', /visualMode:\s*["']photo["']/.test(store));
for (const mode of ['photo', 'model', 'xray']) ok(`mode ${mode} exists`, new RegExp(`id:\\s*["']${mode}["']`).test(modes));
for (const [key, mode] of [['1', 'photo'], ['2', 'model'], ['3', 'xray']]) {
  ok(`hotkey ${key} -> ${mode}`, new RegExp(`e\\.key === ["']${key}["'].*setVisualMode\\(["']${mode}["']\\)`).test(hotkeys));
}
ok('stage uses full dynamic viewport', /h-dvh/.test(explorer) && /flex-1/.test(explorer) && /min-h-0/.test(explorer));
ok('engine renderer is lazy-loaded', /lazy\(\(\) =>[\s\S]*?import\(["']@\/engine\/EngineCanvas["']\)/.test(explorer) && !/import\s+\{\s*EngineCanvas\s*\}\s+from/.test(explorer));
ok('canvas explicitly fills stage', /style=\{\{ width: ["']100%["'], height: ["']100%["']/.test(canvas));
ok('photo canvas remounts when physical plate changes', /key=\{schematic \? ["']model["'] : `photo-\$\{photoId\}`\}/.test(canvas));

// Identity, photo truth and plate-specific focusing.
ok('photo identity assertion enabled', /assertMeshIdentity\(h\.id\)/.test(photoEngine));
ok('schematic identity assertion enabled', /assertMeshIdentity\(id\)/.test(part));
ok('photo focus maps are plate specific', /PHOTO_FOCUS:\s*Record<PhotoId,\s*Record<string,\s*PhotoFocus>>/.test(cameras));
ok('photo focus is derived from each calibrated hit list', /function focusMap\(view: PhotoView\)[\s\S]*view\.hits\.map/.test(cameras));
ok('camera driver uses active photo for selected-part focus', /photoFocus\(photoId,\s*selectedId\)/.test(canvas));
ok('preferred-photo lookup does not replace active-plate focusing', /PART_FOCUS[\s\S]*PHOTO_FOCUS\.bay[\s\S]*PHOTO_FOCUS\.welt/.test(cameras));

// Schematic truth and interaction.
ok('PMREM studio environment present', /PMREMGenerator/.test(canvas) && /scene\.environment/.test(canvas));
ok('schematic has explicit lighting', /ambientLight/.test(canvas) && /hemisphereLight/.test(canvas) && /directionalLight/.test(canvas));
ok('schematic uses restrained ground and contact shadow', /ContactShadows/.test(canvas) && /#0d1014/.test(canvas));
ok('schematic uses flat CAD material palette', /const castAl = phys\(["']#68747c["']/.test(materials) && !/makeCastAlbedo|makeNormalFrom|makeHeatAlbedo/.test(materials));
ok('schematic CAD edges are deliberate and selectable', /EdgesGeometry/.test(part) && /_cadEdges/.test(part) && /#c1d2dc/.test(part));
ok('explode is controlled state', /const explode = useExplorer/.test(part) && /EXPLODE\[id\]/.test(part) && /useFrame/.test(part));
ok('explode offset map is populated', explode.includes('turbocharger') && explode.includes('engine-cover'));

// User-task-focused inspector and discovery.
ok('unresolved inspector copy is honest', /Not marked on this photograph\. Open the 3D schematic\./.test(inspector));
ok('inspector visibility is scoped to current photo', /photoHits\.find\(\(hit\) => hit\.photo === photoId\)/.test(inspector));
ok('active photo is passed to inspector', (explorer.match(/<Inspector\s+photoId=\{photoId\}/g) ?? []).length >= 2);
ok('inspector exposes primary evidence actions', /Show on photo/.test(inspector) && /Inspect in 3D/.test(inspector) && />\s*X-ray\s*</.test(inspector));
ok('inspector refocuses after evidence-mode change', /select\(part\.id,\s*\{\s*frame:\s*true\s*\}\)/.test(inspector));
ok('inspection guidance precedes secondary verification', inspector.indexOf('What to inspect') > -1 && inspector.indexOf('What to inspect') < inspector.indexOf('Technical verification'));
ok('technical provenance is secondary disclosure', /<details className=["'][^"']*mt-5/.test(inspector) && /Technical verification/.test(inspector));
ok('mobile sheet has a single owned header surface', /data-ui=["']bottom-sheet["']/.test(sheet) && /!plain\s*\?\s*\(/.test(inspector));
ok('mode labels are protected from wrapping', /whitespace-nowrap/.test(modes));
ok('mobile touch targets are enlarged', /size-11[\s\S]*sm:size-10/.test(chrome) && /h-11[\s\S]*sm:h-8/.test(chrome));
ok('interaction hint is task guidance, not debug copy', !/Photo is the real engine/.test(hint) && /Pinch or scroll to zoom/.test(hint));
ok('catalogue provides grounded issue shortcuts', ['Misfire', 'Oil leak', 'Boost leak', 'Overheat'].every((label) => partsNav.includes(label)));
ok('catalogue issue shortcuts drive symptom search', /setQuery\(issue\.query\)/.test(partsNav) && /setSystem\(["']all["']\)/.test(partsNav));
ok('catalogue uses live result count, not decorative model count', /\{list\.length\}/.test(partsNav) && !/modelled/.test(partsNav));

// Systems/reference information architecture.
ok('systems view uses technical path layout rather than generic cards', /divide-y divide-border border-y/.test(systemsView) && !/rounded-xl border border-border bg-surface p-4/.test(systemsView));
ok('reference explains photographic truth and schematic limits', /Photo mode remains the visual source of truth/.test(technicalView) && /3D and X-ray modes are schematic teaching views/.test(technicalView));
ok('reference omits internal mesh identity table', !/meshIdentity|Visualisation status/.test(technicalView));
ok('reference source images defer offscreen work', (technicalView.match(/loading=["']lazy["']/g) ?? []).length >= 2 && (technicalView.match(/decoding=["']async["']/g) ?? []).length >= 2);
ok('reference photo cards do not equal-height stretch', /grid items-start gap-4 sm:grid-cols-2/.test(technicalView));

// Modal/accessibility contracts.
ok('search dialog uses a focus-trapping primitive', /@radix-ui\/react-dialog/.test(commandPalette) && /role=["']combobox["']/.test(commandPalette) && /role=["']listbox["']/.test(commandPalette));
ok('VIN dialog uses a focus-trapping primitive', /@radix-ui\/react-dialog/.test(vinPanel) && !/prototype/i.test(vinPanel));
ok('help dialog uses a focus-trapping primitive', /@radix-ui\/react-dialog/.test(helpOverlay));
ok('Radix dialog title ids are not overridden', !/Dialog\.Title[^>]*\sid=/.test(`${commandPalette}\n${vinPanel}\n${helpOverlay}`));
const subtle = styles.match(/--color-subtle:\s*(#[0-9a-f]{6})/i)?.[1];
const surface = styles.match(/--color-surface:\s*(#[0-9a-f]{6})/i)?.[1];
ok('small text contrast meets WCAG AA', Boolean(subtle && surface && contrastRatio(subtle, surface) >= 4.5), subtle && surface ? `${contrastRatio(subtle, surface).toFixed(2)}:1` : 'colour tokens missing');

// Search contracts.
ok('symptom search indexes inspection and symptom text', /inspectionNotes/.test(search) && /commonSymptoms/.test(search));
ok('catalogue uses symptom-aware search', /searchComponentsRich/.test(partsNav));
ok('command palette uses symptom-aware search', /searchComponentsRich/.test(commandPalette));
ok('hero photo zoom is not regressed', /preset\(["']hero["'][\s\S]*?1\.(4[2-9]|[5-9]\d)/.test(cameras) || /preset\(["']hero["'][\s\S]*?,\s*(?:[2-9]|1\.[5-9])/.test(cameras));

// Photo hit allowlists.
const weltSection = photos.split('const WELT_HITS')[1]?.split('const BAY_HITS')[0] ?? '';
const baySection = photos.split('const BAY_HITS')[1]?.split('export const photoViews')[0] ?? '';
const hitIds = (section) => [...section.matchAll(/id:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const allowedWelt = ['engine-cover', 'oil-cap', 'oil-filter-module', 'oil-cooler', 'alternator', 'serpentine-belt', 'ac-compressor', 'crank-pulley', 'electric-coolant-pump', 'turbocharger', 'boost-pipe'];
const allowedBay = ['engine-cover', 'oil-cap', 'charge-pipe', 'airbox'];
const forbiddenWelt = ['vanos-intake', 'vanos-exhaust', 'belt-tensioner', 'cylinder-head', 'ignition-coils', 'hpfp', 'valve-cover', 'charge-pipe'];
const forbiddenBay = ['oil-filter-module', 'oil-cooler'];
const sameSet = (a, b) => a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index]);
ok('Welt photo hit allowlist exact', sameSet(hitIds(weltSection), allowedWelt), `found ${hitIds(weltSection).join(', ')}`);
ok('Bay photo hit allowlist exact', sameSet(hitIds(baySection), allowedBay), `found ${hitIds(baySection).join(', ')}`);
for (const id of forbiddenWelt) ok(`Welt has no forbidden hit: ${id}`, !weltSection.includes(`id: "${id}"`) && !weltSection.includes(`id: '${id}'`));
for (const id of forbiddenBay) ok(`Bay has no screenshot-falsified hit: ${id}`, !baySection.includes(`id: "${id}"`) && !baySection.includes(`id: '${id}'`));
const turbo = weltSection.match(/id:\s*["']turbocharger["'][\s\S]*?rect:\s*\{\s*u0:\s*([0-9.]+),\s*v0:\s*([0-9.]+),\s*u1:\s*([0-9.]+),\s*v1:\s*([0-9.]+)/);
if (turbo) {
  const [, u0, v0, u1, v1] = turbo.map(Number);
  ok('Welt turbo hit remains precision-bounded', (u1 - u0) <= 0.21 && (v1 - v0) <= 0.21 && v0 >= 0.48, `rect ${u0},${v0} → ${u1},${v1}`);
} else ok('Welt turbo hit remains precision-bounded', false, 'turbocharger rect missing');
ok('schematic click identity guard enabled', (part.match(/assertMeshIdentity\(id\)\.status === ["']unidentified["']/g) ?? []).length >= 3);

// Structured data integrity.
const componentIds = new Set([...componentsText.matchAll(/\n\s*id:\s*["']([^"']+)["'],\n\s*canonicalName:/g)].map((match) => match[1]));
const sourceIds = new Set([...sourcesText.matchAll(/\n\s*([A-Za-z0-9_-]+):\s*\{\n\s*id:\s*["']([^"']+)["']/g)].map((match) => match[2]));
ok('component catalogue is non-trivial', componentIds.size >= 30, `found ${componentIds.size}`);
ok('source registry is non-trivial', sourceIds.size >= 5, `found ${sourceIds.size}`);
for (const id of [...hitIds(weltSection), ...hitIds(baySection)]) ok(`photo hit resolves to component: ${id}`, componentIds.has(id));
for (const match of componentsText.matchAll(/connectsTo:\s*\[([\s\S]*?)\]/g)) {
  for (const id of quoted(match[1])) ok(`connected component resolves: ${id}`, componentIds.has(id));
}
for (const match of componentsText.matchAll(/sourceRefs:\s*\[([\s\S]*?)\]/g)) {
  for (const id of quoted(match[1])) ok(`component source resolves: ${id}`, sourceIds.has(id));
}
const verifiedPartNumberBlocks = [...componentsText.matchAll(/\{([\s\S]*?)partNumberStatus:\s*["']verified["']([\s\S]*?)\n\s*\}/g)];
for (const block of verifiedPartNumberBlocks) ok('verified part number block contains exact number', /bmwPartNumber:\s*["'][^"']+["']/.test(block[0]));

// Source image integrity.
for (const [path, expected] of [
  ['public/engine/photos/n20-welt.jpg', '9d5c8a9eec11ad3144712810365a5e0954853ac49faa906e7ab294697be4f8f9'],
  ['public/engine/photos/f30-bay.jpg', '94896e190c3e6c229c53104e649108058f4882e4a580c2d0e5612e873a3f4e44'],
]) {
  ok(`${path} exists`, existsSync(path));
  if (existsSync(path)) {
    ok(`${path} is non-trivial`, statSync(path).size > 100_000);
    ok(`${path} source plate hash preserved`, sha256(path) === expected);
  }
}

for (const path of ['README.md', 'src/routes/__root.tsx', 'src/components/explorer/Header.tsx', 'src/lib/og/site.json', 'public/favicon.svg']) {
  ok(`${path} has no legacy product name`, !/N20 Engine Explorer/.test(text(path)));
}

console.log(`Viscerra final release gate: ${checks.length - failures.length}/${checks.length} passed`);
for (const check of checks) console.log(`${check.condition ? 'PASS' : 'FAIL'}  ${check.name}${check.detail ? ` — ${check.detail}` : ''}`);
if (failures.length) {
  console.error('\nRelease blocked:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
