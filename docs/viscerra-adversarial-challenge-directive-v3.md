# Viscerra — Adversarial Challenge Directive v3

## Purpose

Assume the current Viscerra build is not production-ready. Your job is to disprove its claims, find misleading behaviour, expose weak UX, and identify any test that is passing for the wrong reason.

You are not the engineer who built it. You are an independent reviewer with authority to block release.

## Adversarial roles

Review simultaneously as:

- experienced BMW N20 owner trying to find a part quickly;
- workshop technician who has no patience for decorative UI;
- first-time mobile user using one hand;
- desktop/laptop user trying to understand the whole engine;
- automotive technical editor checking statements for overclaiming;
- accessibility auditor;
- browser QA engineer;
- Three.js interaction engineer;
- security/product-integrity reviewer looking for scaffold/vendor leakage;
- sceptical product designer looking for generic AI-generated UI patterns.

## Challenge question

For every screen, control, data field, interaction and claim, ask:

> If this were wrong, misleading, awkward, or unnecessary, how would I prove it?

Then try to prove it.

## Attack the product assumptions

### 1. Photo truth

- Try to click every calibrated photo region after clearing selection.
- Verify the clicked hardware is actually the named component.
- Deliberately test overlaps and edge areas.
- Try to select forbidden/unresolved components through the photo.
- Verify a region does not become selectable merely because its bounding rectangle overlaps another part.
- Compare each highlight screenshot to the raw source photograph.
- Reject any rectangle that covers more unrelated hardware than the intended component unless the component itself physically occupies that envelope.
- Verify switching photo presets does not silently show an unrelated part.

### 2. 3D truth

- Try to interpret the schematic as a real dimensional model. If the UI encourages that interpretation, fail it.
- Check every selectable schematic component has a defensible canonical identity.
- Test selection/focus from catalogue and related-component links.
- Test exploded views at 0, 25, 50, 75 and 100 percent.
- Look for components leaving frame, clipping, disappearing, intersecting implausibly, or becoming unselectable.
- Verify X-ray actually improves understanding rather than just reducing opacity.

### 3. Information usefulness

For every inspector section ask:

- Does a normal user need this now?
- Can they act on it?
- Is it repeated elsewhere?
- Is it internal QA language disguised as user content?
- Is it so verbose the important inspection guidance is buried?

Fail the design if provenance, confidence scoring, decorative metadata or internal capture language competes with location, inspection, symptoms or useful actions.

### 4. Search

Test names, aliases and symptom language. At minimum:

- turbo;
- oil filter;
- misfire;
- valve cover;
- coolant pump;
- boost;
- oil;
- wastegate.

Challenge ranking. A technically matching result is not enough if the most useful component is buried.

### 5. Real user flows

Complete these without relying on keyboard-only expert knowledge:

1. "My car is misfiring; what components should I inspect first?"
2. "Where is the oil filter housing on this engine?"
3. "Show me the turbo on the real engine, then show its schematic position."
4. "How does intake air travel through the engine?"
5. "This part is not visible on the photo — what should the product tell me?"
6. "I selected a part accidentally; how do I recover?"
7. "I am on a 320 px phone; can I reach every essential control?"
8. "I am on a 1440 px desktop; is the engine still the dominant object?"

Count unnecessary taps/clicks and note dead ends.

### 6. Desktop UI attack

At 1366×768, 1440×900 and 1920×1080:

- check whether left/right panels unnecessarily squeeze the engine;
- inspect type sizes and contrast at normal viewing distance;
- check controls for repeated meaning;
- check whether the bottom dock is visually heavier than the engine;
- check selected-state clarity;
- check whether empty inspector/navigation states waste space;
- reject generic dashboard/card patterns;
- reject controls that look disabled when they are not;
- ensure the engine remains the visual anchor.

### 7. Mobile UI attack

At 320×720, 360×800, 390×844, 412×915 and 430×932:

- use only pointer/touch-style interactions;
- ensure no horizontal document overflow;
- inspect safe-area behaviour;
- open/close catalogue repeatedly;
- select a part and inspect the bottom sheet;
- ensure exactly one sheet title and one dedicated close control;
- ensure focus is trapped and background controls are inaccessible;
- check mode controls do not wrap;
- check bottom dock does not hide the important photographic region;
- check 3D explode slider is usable with touch;
- check repeated mode/action controls do not create confusion.

### 8. Accessibility attack

- Tab through the desktop UI with no mouse.
- Verify visible focus.
- Open every dialog/sheet and attempt to tab out.
- Press Escape from every modal.
- Check accessible names against actual purpose.
- Search for ambiguous names like `Open`, `Close`, `Menu`, `Panel` when a more specific name is required.
- Verify hidden background controls are removed from the accessibility tree while modals are active.

### 9. Performance attack

- Examine production bundle output.
- Challenge large chunks and unnecessary initial imports.
- Confirm real photographs are not repeatedly decoded or redundantly loaded.
- Check continuous 3D render loops and visual effects for unnecessary mobile cost.
- Ensure changing simple UI state does not remount expensive scenes without reason.

### 10. Production integrity attack

Inspect the final HTML and assets for:

- Grok/App Builder residue;
- wrong product name;
- old N20 Engine Explorer branding where not intentionally historical;
- preview-only assets;
- broken manifests/icons/social metadata;
- prototype/debug text;
- test hooks exposed in production;
- console errors or fatal runtime logs.

## Challenge the tests themselves

A green CI run can still be wrong.

- Find assertions that only check text presence but not behaviour.
- Find tests that select parts through URL state instead of clicking them.
- Find selectors whose broad regex matches unrelated component names (for example a `Close` regex matching a part whose name begins with `Close-`).
- Find screenshots created after failures that never exercised the claimed state.
- Find geometry thresholds so weak that an unusable layout can pass.
- Find stale accessible labels that penalise an improved UI.
- Find missing viewports.
- Find no-op tests and regexes that always pass.

Fix the test if the test is wrong. Fix the product if the product is wrong. Never lower a valid requirement to create a green build.

## Severity model

### P0 — release blocker

- wrong component selected by click;
- false photo identification;
- broken core navigation/search;
- data loss/crash/fatal browser error;
- mobile essential controls inaccessible;
- production vendor/scaffold leakage;
- exact part number presented without verification;
- release SHA mismatch between `main` and Vercel production.

### P1 — must fix before release

- inspector/action flow materially confusing;
- modal focus/close defect;
- strong desktop/mobile layout defect;
- unreadable functional text;
- selected component cannot be reliably located/refocused;
- 3D/X-ray state loses selection or becomes unusable;
- misleading visual hierarchy.

### P2 — fix if safe in this release

- avoidable friction;
- weak copy;
- secondary spacing/hierarchy problem;
- non-critical performance regression.

### P3 — backlog only

- purely aesthetic preference without user-task impact;
- speculative features unsupported by current data.

## Independent decision rule

Do not preserve a feature because time was already spent building it. Delete or simplify it if it does not improve a real user task.

Do not add a feature merely because it sounds advanced. If the data cannot support it accurately, do not ship it.

Do not make the 3D model more realistic-looking unless accuracy improves with it. A visibly schematic model is preferable to persuasive false precision.

## Final challenge report

Before release, produce a concise internal report containing:

- exact candidate SHA;
- P0/P1 issues found;
- fixes applied;
- tests added or corrected;
- screenshot matrix result;
- real-photo click matrix result;
- responsive viewport result;
- TypeScript/unit/build result;
- remaining P2/P3 items that are explicitly not blockers;
- production Vercel deployment ID and SHA after promotion.

Release only if P0 = 0, P1 = 0, all required gates are green, and production serves the exact audited SHA.
