# Constellation Redesign — Portfolio Spec

**Date:** 2026-07-18 · **Repo:** `C:\Users\sahii\Projects\portfolio` · **Status:** approved by owner direction ("like the surprise piece"), pre-implementation

## Goal

Restyle the portfolio to the "living constellation" aesthetic of
`C:\Users\sahii\surprise\index.html` (the particle flow-field piece): near-black
background, additive-glow particles, the owner's name formed by converging
particles, ambient stardust. Content, routing, and behavior stay; only the
visual/ambient layer changes.

## Locked decisions (owner-mandated)

- Aesthetic reference is `surprise/index.html` — its exact palette (`#03040a`
  base), additive `lighter` blending, trail fade, and spring-physics particle
  convergence.
- `src/data.ts` is **untouched** (including the `__OPA_PORTFOLIO_INSERT__`
  marker — the auto-publisher depends on it).
- No new dependencies, no framework, no router changes.

## Components

### 1. `src/particles.ts` (new module)

Adapted from `surprise/index.html`, TypeScript-ified, two cooperating systems on
one full-page fixed `<canvas id="fx">` (behind content, `z-index: 0`, content
lifted to `z-index: 1`):

- **Ambient stardust** — few hundred faint particles drifting page-wide with
  curl-noise wander, always alive.
- **Hero name formation** — on the home view, ~2–4k particles converge to form
  the text "SAHIIX" sampled from an offscreen canvas (same `sampleText`
  technique), spring to their targets, repel from the pointer within ~130px,
  reform on release. Hue cycles slowly through the project's brand accents
  (violet `#8b5cff`, cyan `#22d3ee`, amber `#f59e0b`, green `#34d399`).
- **Gates (must match repo CLAUDE.md rules):** the whole system only runs when
  `prefers-reduced-motion: no-preference`; pointer interaction only with
  `pointer: fine`. Static fallback: hero renders as normal styled text (the
  particle layer is purely additive).
- **Lifecycle:** paused when `document.hidden`, when the hero is scrolled out of
  view (IntersectionObserver), and when the hash router shows the case-study
  detail view (particles relate to the hero; detail view keeps only ambient
  dust). DPR-aware, capped at 2; resize re-samples the name targets.

### 2. `src/style.css` (full restyle, same class names)

New visual system over the existing DOM/classes:

- Base `#03040a`; surfaces as translucent dark panels (`rgba(10,14,24,0.55)`)
  with 1px `rgba(130,150,210,0.14)` borders and backdrop blur, so the starfield
  shows through.
- Text: `#e6ecf5` / dim `#8a94a8` / faint `#5a6478`. Display font stays Space
  Grotesk; mono accents stay Space Mono.
- Accents: keep per-project `accent` colors (cards already consume them);
  global accents shift from purple-dominant to cyan/violet/starfield tones.
- Replace `body::before` radial-orbs backdrop and `body::after` grid with the
  canvas (remove those two layers; keep print + reduced-motion variants sane).
- Cards (`.project`, `.system-card`, `.skill-group`, `.pilot-card`,
  `.contact-card`) get soft inner glow + accent edge glow on hover (reuse
  existing `color-mix` accent pattern).
- Keep: reveal animations, View Transitions, scroll progress (restyle to cyan),
  focus/skip-link styles, print stylesheet (canvas hidden in print).

### 3. `index.html`

- Add `<canvas id="fx" aria-hidden="true"></canvas>` as the first element in
  `<body>`.
- No other structural change (hero text nodes stay — they are the static
  fallback and the sample source).

### 4. `src/main.ts`

- Import and boot `particles.ts` after first render: `initFx(canvas, { heroNameEl })`.
- Notify the fx system on route change (`showHome` ↔ detail) and expose
  `document.hidden` handling (module self-manages listeners; main.ts only
  passes route state).
- Hero name element (`#heroName`): when particles are active, the DOM text is
  visually transparent (particles draw it) but remains in the accessibility
  tree; when gated (reduced motion / coarse pointer), it renders normally.

## Error handling / fallbacks

- Canvas 2D context unavailable or reduced-motion → no fx, current styled site.
- `getImageData` failure (never expected on same-origin) → skip name formation,
  keep ambient dust.
- Any fx exception during boot → catch, log, remove canvas, site unaffected.

## Verification

- `npm run check` (tsc) clean; `npm run build` clean.
- `npm run dev` smoke: particles form the name, pointer scatters, detail view
  keeps dust only, reduced-motion emulation shows static hero.
- Deploy to production (`npm run deploy`), verify on
  `sahiix-portfolio.pages.dev`.

## Non-goals

- No content/copy changes, no new sections, no per-page particle variants, no
  audio, no WebGL (2D canvas only — matches the reference piece).
