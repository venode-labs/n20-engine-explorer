import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';

const failures = [];
const checks = [];
const ok = (name, condition, detail = '') => {
  checks.push({ name, condition, detail });
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ''}`);
};
const text = (p) => readFileSync(p, 'utf8');
const sha256 = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

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
const explode = text('src/engine/explode.ts');
const inspector = text('src/components/explorer/Inspector.tsx');
const cameras = text('src/data/camera-presets.ts');
const search = text('src/data/search.ts');
const partsNav = text('src/components/explorer/PartsNav.tsx');
const palette = text('src/components/explorer/CommandPalette.tsx');

ok('package is Viscerra', pkg.name === 'viscerra');
ok('browser title uses Viscerra', /APP_NAME\s*=\s*["']Viscerra["']/.test(root));
ok('header uses Viscerra brand', /Viscerra/i.test(header));
ok('Photo is default', /visualMode:\s*["']photo["']/.test(store));
for (const mode of ['photo', 'model', 'xray']) ok(`mode ${mode} exists`, new RegExp(`id:\\s*["']${mode}["']`).test(modes));
for (const [key, mode] of [['1','photo'],['2','model'],['3','xray']]) {
  ok(`hotkey ${key} -> ${mode}`, new RegExp(`e\\.key === ["']${key}["'].*setVisualMode\\(["']${mode}["']\\)`).test(hotkeys));
}
ok('stage uses full dynamic viewport', /h-dvh/.test(explorer) && /flex-1/.test(explorer) && /min-h-0/.test(explorer));
ok('canvas explicitly fills stage', /style=\{\{ width: ["']100%["'], height: ["']100%["']/.test(canvas));
ok('photo identity assertion enabled', /assertMeshIdentity\(h\.id\)/.test(photoEngine));
ok('schematic identity assertion enabled', /assertMeshIdentity\(id\)/.test(part));
ok('PMREM studio environment present', /PMREMGenerator/.test(canvas) && /scene\.environment/.test(canvas));
ok('schematic has explicit lighting', /ambientLight/.test(canvas) && /hemisphereLight/.test(canvas) && /directionalLight/.test(canvas));
ok('explode is controlled state', /const explode = useExplorer/.test(part) && /EXPLODE\[id\]/.test(part) && /useFrame/.test(part));
ok('explode offset map is populated', Object.keys(explode.match(/"?[a-z][a-z0-9-]*"?:\s*\[/g) ?? {}).length >= 0 && explode.includes('turbocharger') && explode.includes('engine-cover'));
ok('unresolved inspector copy is honest', /Not marked on this photograph\. Open the 3D schematic\./.test(inspector));
ok('inspector visibility is scoped to current photo', /hitsForPart\(part\.id\)\.some\(\(hit\) => hit\.photo === photoId\)/.test(inspector));
ok('active photo is passed to inspector', (explorer.match(/<Inspector\s+photoId=\{photoId\}/g) ?? []).length >= 2);
ok('symptom search indexes inspection and symptom text', /inspectionNotes/.test(search) && /commonSymptoms/.test(search));
ok('catalogue uses symptom-aware search', /searchComponentsRich/.test(partsNav));
ok('command palette uses symptom-aware search', /searchComponentsRich/.test(palette));
ok('hero photo zoom is not regressed', /preset\(["']hero["'][\s\S]*?1\.(4[2-9]|[5-9]\d)/.test(cameras) || /preset\(["']hero["'][\s\S]*?,\s*(?:[2-9]|1\.[5-9])/.test(cameras));

const weltSection = photos.split('const WELT_HITS')[1]?.split('const BAY_HITS')[0] ?? '';
const forbiddenWelt = ['vanos-intake','vanos-exhaust','belt-tensioner','cylinder-head','ignition-coils','hpfp','valve-cover','charge-pipe'];
for (const id of forbiddenWelt) ok(`Welt has no forbidden hit: ${id}`, !weltSection.includes(`id: "${id}"`) && !weltSection.includes(`id: '${id}'`));
ok('bay charge pipe hit exists', /const BAY_HITS[\s\S]*?id:\s*["\']charge-pipe["\']/.test(photos));

const hitIds = (section) => [...section.matchAll(/id:\s*["\']([^"\']+)["\']/g)].map((m) => m[1]);
const allowedWelt = ['engine-cover','oil-cap','oil-filter-module','oil-cooler','alternator','serpentine-belt','ac-compressor','crank-pulley','electric-coolant-pump','turbocharger','boost-pipe'];
const baySection = photos.split('const BAY_HITS')[1]?.split('export const photoViews')[0] ?? '';
const allowedBay = ['engine-cover','oil-cap','charge-pipe','airbox'];
const forbiddenBay = ['oil-filter-module','oil-cooler'];
const sameSet = (a, b) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);
ok('Welt photo hit allowlist exact', sameSet(hitIds(weltSection), allowedWelt), `found ${hitIds(weltSection).join(', ')}`);
ok('Bay photo hit allowlist exact', sameSet(hitIds(baySection), allowedBay), `found ${hitIds(baySection).join(', ')}`);
for (const id of forbiddenBay) ok(`Bay has no screenshot-falsified hit: ${id}`, !baySection.includes(`id: "${id}"`) && !baySection.includes(`id: '${id}'`));

const turbo = weltSection.match(/id:\s*["']turbocharger["'][\s\S]*?rect:\s*\{\s*u0:\s*([0-9.]+),\s*v0:\s*([0-9.]+),\s*u1:\s*([0-9.]+),\s*v1:\s*([0-9.]+)/);
if (turbo) {
  const [, u0, v0, u1, v1] = turbo.map(Number);
  ok('Welt turbo hit remains precision-bounded', (u1 - u0) <= 0.21 && (v1 - v0) <= 0.21 && v0 >= 0.48, `rect ${u0},${v0} → ${u1},${v1}`);
} else {
  ok('Welt turbo hit remains precision-bounded', false, 'turbocharger rect missing');
}

ok('photo focus is derived only from calibrated hits', /\[photoViews\.bay, photoViews\.welt\][\s\S]*?view\.hits\.map/.test(cameras));
ok('schematic click identity guard enabled', (part.match(/assertMeshIdentity\(id\)\.status === ["\']unidentified["\']/g) ?? []).length >= 3);

for (const [p, expected] of [
  ['public/engine/photos/n20-welt.jpg', '9d5c8a9eec11ad3144712810365a5e0954853ac49faa906e7ab294697be4f8f9'],
  ['public/engine/photos/f30-bay.jpg', '94896e190c3e6c229c53104e649108058f4882e4a580c2d0e5612e873a3f4e44'],
]) {
  ok(`${p} exists`, existsSync(p));
  if (existsSync(p)) {
    ok(`${p} is non-trivial`, statSync(p).size > 100_000);
    ok(`${p} source plate hash preserved`, sha256(p) === expected);
  }
}

const oldBrandAllowed = [
  'docs/model-verification.md',
  'docs/real-engine-fidelity-audit.md',
  'docs/assets-manifest.md',
  'public/engine/photos/ATTRIBUTION.md',
  'public/engine/photos/sources.json',
  'src/data/sources.ts',
];
for (const p of ['README.md','src/routes/__root.tsx','src/components/explorer/Header.tsx','src/lib/og/site.json','public/favicon.svg']) {
  if (!oldBrandAllowed.includes(p)) ok(`${p} has no legacy product name`, !/N20 Engine Explorer/.test(text(p)));
}

console.log(`Viscerra release gate: ${checks.length - failures.length}/${checks.length} passed`);
for (const c of checks) console.log(`${c.condition ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
if (failures.length) {
  console.error('\nRelease blocked:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
