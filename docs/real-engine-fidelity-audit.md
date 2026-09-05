# Real-engine fidelity audit — BMW N20 photographic plate

**Date:** 5 September 2026  
**Subject:** 2015 BMW 428i F32 Australian N20 family — visual from real photographs  
**Auditor:** independent visual check of source JPEG vs live viewer at the same angle  
**Release rule:** if the live engine reads as CGI, the build fails.

## 1. Source images

| Plate | File | Original | Author | Licence | N20 check |
| --- | --- | --- | --- | --- | --- |
| Isolated display | `public/engine/photos/n20-welt.jpg` (engine crop) and `n20-welt-full.jpg` | Wikimedia `BMW N20 Engine.JPG`, 3456×5184, 30 Apr 2012, BMW Welt | Hullie (AHHM van Hulten) | CC BY-SA 3.0 | **Pass.** TwinPower Turbo acoustic cover, inline-4, plastic intake with DME on top, aluminium oil-filter module, turbo/heat-shield on exhaust side, factory hoses, clamps, fasteners, wiring. |
| In-bay | `public/engine/photos/f30-bay.jpg` | Wikimedia `BMW 328i F30 2012 Motorraum 1.jpg`, 3888×2592, 17 Jan 2012 | HLW | CC BY-SA 3.0 | **Pass.** F30 328i bay, N20 cover, airbox vehicle-left, charge pipe across the front. |

Rejected before ingestion:

- `Munich, Mundo BMW 12.jpg` (BMW Welt 2015) — inline-six cutaway, not N20.
- Sketchfab “N20 615 06” (Scaniverse, joebrad91) — photogrammetry of an N20, **CC BY-NC-SA**, not used.

The two accepted plates are **not** the same physical engine. Welt 2012 is a display unit; the F30 is an installed early-production 328i (oil-filter housing running change is VIN-dependent).

## 2. Reconstruction method

**Attempted:** photogrammetry (COLMAP / Meshroom) → textured mesh → GLB.

**Blocked:**

- No overlapping multi-angle capture of one physical N20 with a licence that permits this use.
- COLMAP / RealityCapture / Meshroom are not available in this environment (`apt` is disabled).
- Two stills of two different engines cannot produce a dense point cloud.

**Gaussian Splatting / NeRF:** same capture gap. Not trained.

**Used:** image-based view synthesis.

```
photographic JPEG (unlit albedo)
        +
invisible segmented hit meshes
        +
component metadata
        =
interactive real-engine explorer
```

The visible surface is `THREE.MeshBasicMaterial` with `toneMapped={false}` and renderer `NoToneMapping`. There is no PBR relighting, no studio HDR, no procedural metal, no invented bolts/hoses/castings.

Geometry of the **visible** mesh is a single photograph-sized plane (2 triangles). Hit meshes are invisible planes registered in photograph UV space. The user never sees them.

## 3. Asset licence

CC BY-SA 3.0 on both plates. Attribution in the viewer footer, Technical notes, and `public/engine/photos/ATTRIBUTION.md`.

The photographic adaptation (crop + resize) is ShareAlike. The CGI archive is original work and is not shipped in the scene.

## 4. Texture resolution

| Plate | Viewer texture | Original |
| --- | --- | --- |
| Welt engine crop | 2489×2489 JPEG (~672 KB) | 3456×5184, oriented from EXIF |
| Welt full frame | 1365×2048 JPEG (~275 KB) | same original |
| F30 bay | 2560×1706 JPEG (~707 KB) | 3888×2592 |

Photographic detail is the albedo. It is not repainted.

## 5. Polygon count

| Mesh | Triangles | Visible? |
| --- | --- | --- |
| Photographic plate | 2 | yes |
| Invisible hit plates | 2 each (~24 on the Welt plate) | no |

This is not a photogrammetric GLB. A dense textured mesh is the preferred next step **if** a licensed multi-angle capture of one N20 is obtained.

## 6. Screenshots

Captured after the CGI scene was removed:

- `screenshots/photo-hero.png` — live viewer at the Welt plate angle
- `screenshots/photo-compare.png` / `photo-compare-split.png` — source JPEG beside the live plate
- `screenshots/photo-ofh.png` — oil-filter module selected on the same photograph
- `screenshots/photo-bay.png` — F30 in-bay plate
- `screenshots/app-builder-preview.png` / `-mobile.png` — smoke
- `screenshots/app-builder-built.png` — production build

## 7. Known reconstruction defects

- No rear, no true turbo-side orbit, no underside, no cover-off plate in the licensed set.
- Orbit is limited around the capture camera. Off-axis the plate is still the photograph (it is not a 3D part model).
- HPFP, coils, valve cover, fuel rail, injectors, vacuum pump, wastegate actuator and catalyst are **not** on the plates. Inspector copy for those parts is ST1111 / service text, not a photographed highlight.
- Welt display vs F30 installed: accessory dressing and oil-filter housing generation can differ. They are labelled as two engines.
- Crop of the Welt file removes hall architecture; it does not invent engine pixels.

## 8. Visual auditor result

**Question:** Does the engine look like the photographed physical object, or like a CGI interpretation of it?

**Method:** source JPEG and live WebGL plate side by side at the same approximate angle. Lighting of the engine is the lighting in the photograph (unlit material). UI chrome is dark; it is not used to disguise the asset.

**Result (Welt hero):** **PASS — photographed physical object.** The live plate is the Hullie JPEG. Casting texture, plastic grain, hose surface, clamps, fasteners, heat-shield foil, roundel and TwinPower script are the photograph. They are not a shader.

**Result (F30 bay):** **PASS — photographed physical object.** The live plate is the HLW JPEG.

**CGI archive:** **FAIL (rejected).** The previous primitive assembly remains in `/archive/rejected-cgi-model/` for comparison and is not loaded.

## 9. What would upgrade this to a photogrammetric mesh

A turntable or walk-around of **one** physical N20, 40+ overlapping stills, commercial-friendly licence (CC BY / CC BY-SA / CC0 or owner grant), then COLMAP → dense cloud → mesh → UV → project the same photographs → decimate → GLB. Until that capture exists, substituting invented geometry is a fidelity regression.
