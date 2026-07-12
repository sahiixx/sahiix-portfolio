# SAHIIX — Portfolio

A personal portfolio site for SAHIIX — AI-native operating systems & real-time
voice agents. Built as a **new repo** with its own tooling: Vite + vanilla
TypeScript + hand-written CSS (no React/Tailwind — keeps `node_modules` light
and the design fully bespoke).

## Why this stack

A portfolio is mostly static content + scroll animation — a framework is
overkill. Vanilla TS lets the design shine, the bundle is tiny, and there's no
runtime framework tax. Chosen disk-light (~60MB `node_modules`) over a
React/Tailwind install (~300MB).

## Commands

```bash
npm install      # vite + typescript only
npm run dev      # dev server on http://127.0.0.1:5174
npm run build    # → dist/  (static, base "./", hostable anywhere)
npm run preview  # serve the production build
npm run check    # tsc --noEmit
```

## Content is one file

All visible content lives in **`src/data.ts`** — `identity` (name, tagline, bio,
email, socials, the hero rotator words), `projects[]`, `skillGroups[]`, `stats[]`.
Edit there; the UI renders from it. Add a project by appending to the array.

## Structure

```
index.html          semantic sections (hero / work / about / skills / contact)
src/main.ts         render data + interactions (rotator, reveal, scroll, form)
src/data.ts         ← edit content here
src/style.css       bespoke dark theme, gradients, scroll-reveal, responsive
vite.config.ts      base "./" so the build also opens as a static file
```

## Notes

- The contact form has **no backend** — it opens the visitor's mail client
  (`mailto:`) as a graceful fallback. Wire `form.submit` to a real endpoint
  (Cloudflare Worker, Formspree, etc.) to capture submissions.
- Project `url: ""` renders a disabled "View" (no link) — drop in a live/repo
  URL to enable.
- `prefers-reduced-motion` disables animations.