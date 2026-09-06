# Viscerra critical UI / production audit — 2026-09-06

## Verdict before remediation

The audited build was functionally strong but visually one release behind a credible commercial product. The photographic-first concept worked; parts of the surrounding chrome still read as an engineering demonstrator. Production HTML also leaked Grok/App Builder infrastructure, which was unacceptable for a finished branded release.

## Corrections implemented

1. Remove production Grok/App Builder head injection, PWA links and preview bridge residue.
2. Preserve the newer CAD-style schematic, accessibility, modal and exploded-view improvements from the takeover line.
3. Make visual-mode semantics explicit: Photo is the source of truth; 3D/X-ray are schematic views and are not photorealistic.
4. Improve mobile stage controls with compact preset labels and larger touch targets.
5. Raise low-contrast utility text and small-text legibility.
6. Shorten and de-emphasise onboarding guidance, keeping it off the mobile specimen view.
7. Improve parts catalogue search wording, row readability and symptom-search affordance.
8. Keep production release gates for first-party shell, accessibility, calibration, fidelity, responsive layout and browser screenshots.
9. Preserve all photo calibration, identity, AU-market and no-hallucinated-part-number invariants.

## Non-negotiable product truth

The real photographs remain the visual authority. The 3D model remains explicitly schematic and must never be presented as a photorealistic representation of the BMW N20.
