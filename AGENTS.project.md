# Viscerra project rules

## Product identity

- Product name: **Viscerra**. The product is not tied to one manufacturer or engine family.
- Current launch exhibit: BMW N20B20 in a 2015 BMW 428i F32, Australian market.
- Treat manufacturer/model names as exhibit metadata, not the product brand.

## Visual truth is non-negotiable

- Photo mode is the default and the visual source of truth.
- Preserve `public/engine/photos/n20-welt.jpg` (Hullie, BMW Welt) and `public/engine/photos/f30-bay.jpg`.
- Never replace photographed hardware with AI-generated imagery, inferred geometry, Blender-style primitives, or relit PBR imagery.
- `archive/rejected-cgi-model/` is rejection evidence, not a production visual target.
- 3D and X-ray are explicitly schematic reconstructions of the same documented layout. Do not present them as scans or OEM geometry.

## Photo hit identity

- Calibration lives in `src/engine/photo-views.ts`. UV origin is top-left. Higher `layer` wins overlap.
- A photo hit is permitted only when the named hardware has been visually verified inside the region. A plausible-looking rectangle is not evidence.
- After any UV/hit-region change: overlay regions on the source JPEG, crop every changed box, visually confirm the named hardware, then live-check `?part=<id>`.
- Do not add Welt photo hits for unresolved/occluded items: `vanos-intake`, `vanos-exhaust`, `belt-tensioner`, `cylinder-head`, `coils`, `hpfp`, `valve-cover`.
- `charge-pipe` may be marked only on the F30 bay photograph when the hardware is actually visible.
- For unresolved photo parts, the inspector must say they are not marked on this photograph and direct the user to the 3D schematic.
- `assertMeshIdentity()` in `src/lib/mesh-identity.ts` is a hard identity guard. Never identify a mesh because it merely looks like a component.

## Interaction contract

- Always retain the three modes: Photo, 3D schematic and X-ray. Keyboard shortcuts: `1`, `2`, `3`.
- Photo remains the default.
- Photo: orbit/zoom/pan and hover/tap selection. No explode/isolate behaviour may imply missing photographic geometry.
- 3D/X-ray: orbit/zoom/pan, isolate, hide and explode. Explode must be controlled React state and visibly move parts.
- Keep the photographed engine filling the stage. Do not regress to a thumbnail-in-void opening view.
- Keep the catalogue narrow/translucent and avoid covering the turbo. Keep the bottom dock clear of the sump. Mobile must have no horizontal overflow and part details must remain touch-usable.

## 3D/X-ray rendering

- If the schematic renders black, inspect PMREM/environment, lights and fog before changing materials.
- Preserve readable material separation: aluminium, black cover and gold heat shield.
- X-ray must remain visibly translucent. Fog must not begin on top of the engine.

## Data honesty

- Never invent BMW part numbers, AU-market specifications, geometry or connectivity.
- Show a part number only when the repository source trail verifies it. Otherwise use `VIN verification required` or `Not verified`.
- Treat forums and unsourced secondary material as leads, not authority. Preserve source provenance in `src/data/sources.ts`.

## Release gate

Before calling a release complete, verify the running app at 1440x900 and 390x844:

1. Every active photo hit selects the correct photographed hardware.
2. Unresolved Welt parts above do not create a false photo highlight.
3. Photo starts large enough to feel like looking into the engine bay and the turbo remains selectable.
4. 3D is lit and materially readable; X-ray is translucent; explode visibly moves parts.
5. Search checks for `turbo`, `oil filter` and `misfire` produce useful results.
6. No mobile horizontal overflow or controls obscuring critical hardware.
7. No black 3D render and no CGI/AI primary photograph.
8. Build/typecheck/test gates pass and production is verified after deployment.

If a component cannot be confidently identified on a source photograph, remove the hit rather than guessing.
