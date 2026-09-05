# Viscerra

Photographic-first technical exhibit for exploring real engines and their systems. The current launch exhibit documents the BMW N20B20 fitted to a 2015 BMW 428i F32 (Australian market).

Viscerra is independent and is not affiliated with BMW AG.

## Visual contract

Photo mode is the source of visual truth. It uses licensed photographs of physical engines. 3D and X-ray are explicitly schematic reconstructions for layout and internal context; they are not OEM CAD, scans or substitutes for the photograph.

The N20 exhibit provides:

- **Photo** — BMW Welt display engine and F30 engine-bay source plates
- **3D** — orbitable schematic reconstruction
- **X-ray** — translucent schematic with the cover removed
- verified part selection, subsystem filtering and known `connectsTo` relationships
- VIN-dependent identification states where exact OE applicability is not verified

See `docs/viscerra-master-build-directive.md` for the release contract and `public/engine/photos/ATTRIBUTION.md` for image attribution.

## Run

```bash
npm install
npm run dev
```

## Verification

```bash
npm run release:gate
npm run typecheck
npm test
npm run build
```

Browser visual audit:

```bash
npm run visual:audit
```
