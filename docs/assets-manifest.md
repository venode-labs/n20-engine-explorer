# Assets manifest

The production engine visual is a photograph of a physical BMW N20. The previous CGI assembly is not loaded.

| filename | SHA-256 (original) | source | licence | notes |
| --- | --- | --- | --- | --- |
| `public/engine/photos/n20-welt.jpg` | `95520ca447747680da4f9e91bab92e274076ceae0f366b2b46e510120f90f431` (original Wikimedia JPEG) | Hullie / Wikimedia Commons | CC BY-SA 3.0 | Oriented + cropped to the engine. Albedo of the live plate. |
| `public/engine/photos/n20-welt-full.jpg` | same original | Hullie / Wikimedia Commons | CC BY-SA 3.0 | Full frame for compare / Technical. |
| `public/engine/photos/f30-bay.jpg` | `50eaa41b4b23e4dfef47d3fb8ac48e3a6151e44de81aec63f0c10fe9242ff488` | HLW / Wikimedia Commons | CC BY-SA 3.0 | F30 328i 2012 bay plate. |
| `public/references/f30-n20-bay.jpg` | (earlier downscale) | HLW / Wikimedia Commons | CC BY-SA 3.0 | Kept; Technical now uses the higher-res bay plate. |
| `archive/rejected-cgi-model/src/*` | — | Original CGI work | App original | **Not in the scene.** Primitive N20 assembly rejected on fidelity. |
| `public/og.jpg` | (share card) | Brand-asset pass | App original | 1200×630 |
| `public/favicon.svg` | — | Brand-asset pass | App original | Inline-four silhouette — not a BMW roundel |

## 3D asset investigation (gate)

| Candidate | Engine claimed | Licence | Suitability |
| --- | --- | --- | --- |
| Sketchfab “N20 615 06” (joebrad91, Scaniverse) | N20 scan | CC BY-NC-SA | Rejected — non-commercial |
| Sketchfab “BMW Engine” (ADMASYS HU) | Unspecified BMW | Rights unverified | Rejected |
| Wikimedia `BMW N20 Engine.JPG` | N20 display, BMW Welt | CC BY-SA 3.0 | **Used — primary plate** |
| Wikimedia `BMW 328i F30 2012 Motorraum 1.jpg` | F30 N20 bay | CC BY-SA 3.0 | **Used — in-bay plate** |
| Wikimedia `Munich, Mundo BMW 12.jpg` | BMW Welt engine 2015 | CC BY-SA 4.0 | Rejected — inline-six, not N20 |
| GrabCAD “N20 motor” | DC gearmotor | various | Wrong subject |

**Decision:** photographic plate + invisible hit layer. Not option 3 (invented mesh). Dense photogrammetry remains blocked by capture/licence.

No executables, install scripts, or untrusted model loaders were executed.
