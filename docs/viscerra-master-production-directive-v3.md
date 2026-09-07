# Viscerra — Master Production Directive v3

## Mission

Take Viscerra from a technically functional engine explorer to a production-grade mechanical reference tool that a real BMW N20 owner, technician, enthusiast, or learner can use without being misled.

The product must be useful first, visually excellent second, and technically truthful at all times. Never optimise for novelty, animation, visual density, or impressive-looking output at the expense of accuracy, clarity, speed, or trust.

## Working role

Operate simultaneously as:

- senior React/TanStack/TypeScript engineer;
- Three.js / React Three Fiber interaction engineer;
- senior product designer for technical tools;
- automotive information architect;
- accessibility engineer;
- performance engineer;
- QA / browser automation engineer;
- adversarial release auditor.

Do not assume existing code, labels, photo regions, component locations, 3D geometry, responsive behaviour, or test assertions are correct because they already exist. Existing implementation is evidence to inspect, not truth to trust.

## Source-of-truth hierarchy

1. Real source photographs are the visual source of truth.
2. Verified technical references and the existing source registry are the factual source of truth.
3. Conservative calibrated photo hit-regions may identify only hardware genuinely visible in a source photograph.
4. The 3D and X-ray modes are schematic teaching views. They must never be presented as a photorealistic or dimensional digital twin.
5. A part that cannot be confidently identified in a photograph must not receive a clickable photo region.
6. Exact part numbers must be verified, VIN-dependent, not applicable, or omitted. Never infer a number.

## Product jobs to support

Every meaningful interface element must support at least one of these jobs:

1. **Identify a component** — by name, alias, symptom, photograph, or system path.
2. **Locate it** — show where it is on a real engine photograph when verified.
3. **Understand it** — concise function and how it relates to the system.
4. **Inspect it** — useful visual/inspection notes, access context, and warnings against false diagnosis.
5. **Diagnose directionally** — surface associated symptoms and related components without claiming a diagnosis.
6. **Trace a system** — show verified upstream/downstream relationships.
7. **Verify identity** — surface source/part-number verification without making internal QA metadata dominate the UI.
8. **Switch evidence modes** — move between real Photo, schematic 3D, and X-ray while preserving selection and context.

If an element does not help one of these jobs, remove it, hide it behind secondary disclosure, or justify why it remains.

## UX and UI requirements

### Desktop

- The engine/photo must remain the primary visual object, not be squeezed into a dashboard card.
- Catalogue and inspector are supporting tools, never equal-weight dashboards.
- Selected component state must be obvious without creating excessive chrome.
- Text hierarchy must work at normal laptop/desktop distances.
- Avoid tiny metadata, excessive uppercase microcopy, decorative counters, and low-contrast technical theatre.
- The centre stage should remain visually calm when no part is selected.
- Inspector actions must be prioritised: locate on real photo, inspect in schematic, trace related parts/system, then explanatory detail.
- Long provenance/confidence detail must be available but visually secondary.

### Mobile

- Must be genuinely designed for touch, not a compressed desktop layout.
- Minimum practical touch target: 44 CSS px where feasible; never below 40 px for essential controls.
- No horizontal page overflow at 320, 360, 390, 412, and 430 px widths.
- Essential mode controls must remain visible and non-wrapping.
- Catalogue and component details use modal/sheet patterns with one title, one close affordance, owned focus, and background isolation.
- Bottom controls must respect safe-area insets.
- No first-run hint may obscure the engine or essential controls.
- Mobile users must be able to search by symptom, select a part, inspect it, move to Photo/3D, and return without losing context.

### Visual language

- Technical, restrained, museum/workshop-instrument quality.
- Dark palette with high enough contrast for real use.
- No generic SaaS dashboard cards, glassmorphism overload, gradients for decoration, neon sci-fi styling, or fake instrumentation.
- Use borders, spacing, typography and hierarchy more than decorative containers.
- Real engine photography must look like photography, not be altered to resemble CGI.
- 3D should look intentionally schematic/CAD-like, not like a poor attempt at realism.

## Photo interaction correctness

This is a release-critical requirement.

For every calibrated Photo hit-region:

1. Verify the component actually occupies the region in the exact source image.
2. Verify overlapping regions use appropriate pick priority/layering.
3. Verify selecting the component focuses the correct region.
4. Verify clearing selection and clicking the focused region on the actual canvas re-selects the exact component.
5. Verify the inspector title matches the clicked component.
6. Verify the URL state updates to the selected component.
7. Verify no forbidden/unresolved component becomes clickable on that photograph.
8. Verify mobile and desktop both preserve the same component identity.

Do not validate photo interaction only by loading `?part=` URLs. The browser audit must perform real pointer clicks against the rendered canvas.

## 3D / X-ray correctness

- Keep all existing mesh identity guards.
- A selectable mesh must map to one canonical component ID.
- Unknown geometry must not be assigned an identity for convenience.
- Selection from catalogue must frame the intended schematic component.
- Selection state must survive switching between 3D and X-ray.
- Explode must visibly separate assemblies without losing camera framing.
- X-ray must remain readable enough to understand relative placement.
- Do not add false bolts, hose routes, ports, labels, measurements, or part numbers simply to make the model look detailed.

## Inspector information architecture

Default selected-component inspector should prioritise:

1. canonical component name + system;
2. one concise sentence explaining what it does;
3. primary actions:
   - Show on real photo (only when a verified photo hit exists);
   - Inspect in 3D;
   - X-ray;
4. location;
5. inspection guidance / service access;
6. associated symptoms with a visible `not a diagnosis` qualifier;
7. connected components as actionable navigation;
8. optional/how-it-works explanatory detail;
9. exact OEM identification when verified/VIN-dependent;
10. provenance/verification under a secondary disclosure.

Remove or demote internal-sounding confidence/debug text that does not help an ordinary user make a decision.

## Search and discovery

Search must work for:

- canonical part name;
- common alias;
- system;
- common symptom phrases already supported by verified component data;
- inspection language.

Add only high-value symptom shortcuts if the existing verified dataset can support them. Do not manufacture a diagnostic decision tree from insufficient evidence.

Expected examples to continuously verify include at least:

- `turbo` → Twin-scroll turbocharger;
- `oil filter` → Oil filter module;
- `misfire` → Ignition coils;
- additional symptom queries may be added only when they produce defensible results from current data.

## Useful feature rule

Before adding a feature, answer:

- What real task does it shorten?
- What verified data supports it?
- Can the user act on the result?
- Does it duplicate an existing control?
- Does it make mobile or desktop worse?

Useful candidates include:

- explicit `Show on real photo` action that reframes the selected verified hit;
- `Inspect in 3D` / `X-ray` actions that preserve selection and refocus;
- quick symptom search entry points backed by existing data;
- clearer system tracing through connected components;
- concise inspection/check guidance;
- contextual empty state that explains the fastest ways to identify a part.

Do not add dashboards, scores, gamification, AI chat, maintenance timers, user accounts, analytics panels, or speculative diagnostic predictions unless a concrete verified user need and data model exists.

## Performance

- Lazy-load heavyweight 3D/rendering code where practical.
- Do not load unnecessary source imagery before needed.
- Avoid permanent animation loops or expensive effects when not required.
- Maintain responsive interaction on contemporary mobile hardware.
- Record build chunk warnings; fix avoidable regressions rather than ignoring them.

## Accessibility

- Semantic names must describe actual purpose, not implementation.
- Focus must remain inside dialogs/sheets until closed.
- Background controls must be removed from the accessibility tree while modal UI is open.
- Every essential icon-only control requires an accurate accessible name.
- Keyboard path: search, select, clear, view switching, reset and modal closing must work.
- Respect reduced-motion preference.
- Maintain WCAG AA contrast for functional text, including small labels.

## Verification gates — no exceptions

A release is blocked unless all pass on the exact release SHA:

### Static/data gates

- photo source hashes unchanged unless intentionally and independently re-approved;
- exact calibrated hit allowlists verified;
- forbidden photo hits absent;
- every photo hit references an existing canonical component;
- every `connectsTo` reference resolves;
- source refs resolve;
- no invented exact part numbers;
- no Grok/App Builder production residue;
- first-party Viscerra metadata/manifest only.

### Code gates

- `npm ci`;
- release static gate;
- TypeScript typecheck;
- unit tests;
- production build;
- no ignored failures or weakened assertions to make CI green.

### Browser gates

At minimum test:

- desktop 1440×900;
- desktop 1920×1080;
- laptop 1366×768;
- mobile 390×844;
- narrow mobile 320×720;
- one larger mobile width (430×932).

For every viewport:

- no horizontal overflow;
- no fatal/browser console errors;
- engine canvas meaningfully fills the stage;
- key controls are visible/not clipped;
- dialogs/sheets own focus;
- touch target thresholds pass where applicable.

### Functional browser gates

- Photo/3D/X-ray mode switching;
- all calibrated Welt and Bay hit selections;
- real canvas click re-selection tests for every calibrated hit;
- overlapping/nested hit priority tests for at least engine-cover/oil-cap and other overlap cases;
- unresolved-photo component copy/actions;
- symptom searches;
- catalogue selection;
- connected-component navigation;
- Show on Photo action;
- Inspect in 3D action;
- X-ray action;
- isolate/compare/reset;
- explode 0%, intermediate, 100%;
- Systems and Notes views;
- VIN and Help dialogs;
- mobile catalogue and inspector sheets.

## Screenshot audit

Generate deterministic screenshots of the functional matrix. A human-style UI audit must reject:

- clipped text;
- accidental wrapping;
- floating controls covering important engine features;
- unreadable small labels;
- unnecessary empty space;
- excessive panel chrome;
- engine/photo rendered too small;
- misleading photo highlights;
- schematic appearing to claim photorealism;
- mobile layouts that technically fit but are awkward to operate.

Passing automated geometry checks is necessary but not sufficient.

## Adversarial evidence rule

When a test fails, first determine whether the product is wrong or the test is stale. Never weaken a valid product requirement merely to satisfy CI. Equally, do not revert a product improvement just because a test still asserts an obsolete accessible label. Fix the incorrect side and document the reason.

## Release protocol

1. Work from the newest valid code line, preserving newer verified improvements.
2. Implement the smallest coherent set of improvements that materially improves the product.
3. Run the master verification matrix.
4. Run the separate adversarial challenge directive.
5. Fix every P0/P1 issue and every reproducible functional bug.
6. Re-run the complete matrix from a clean checkout.
7. Only after a fully green exact-SHA run may the branch be promoted to `main`.
8. Confirm Vercel production is READY and serves the exact same SHA.
9. Fetch production HTML through authenticated Vercel access and verify Viscerra first-party identity and HTTP 200.
10. Check production runtime error/fatal logs.

Never claim `live`, `verified`, `fixed`, or `complete` without evidence from the exact production SHA.
