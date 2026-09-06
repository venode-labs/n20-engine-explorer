# Viscerra critical UI / production audit — 2026-09-06

## Verdict before remediation

The current build is functionally strong but visually one release behind a credible commercial product. The photographic-first concept works; the surrounding chrome still reads as an engineering demonstrator. Production HTML also leaks Grok/App Builder infrastructure, which is unacceptable for a finished branded release.

## Required corrections

1. Remove production Grok/App Builder head injection, PWA links and preview bridge residue.
2. Reduce persistent HUD density and improve hierarchy around the photographic specimen.
3. Make mode semantics explicit: Photo is the source of truth; 3D/X-ray are schematic views.
4. Improve mobile controls: readable labels, no ambiguous clipped preset names, 44 px touch targets where practical.
5. Replace low-contrast 9–10 px utility text with a more legible baseline.
6. Shorten and de-emphasise the onboarding hint; do not cover the specimen longer than necessary.
7. Improve catalogue search wording and result affordance without removing symptom search.
8. Add release-gate checks that reject reintroduction of Grok production residue.
9. Preserve all photo calibration, identity, AU-market, and no-hallucinated-part-number invariants.

## Non-negotiable product truth

The real photographs remain the visual authority. The 3D model remains explicitly schematic and must never be presented as a photorealistic representation of the BMW N20.
