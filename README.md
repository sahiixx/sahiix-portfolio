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
index.html              semantic sections (hero / work / about / skills / contact) + #detail mount
src/main.ts             render data + interactions (router, rotator, reveal, scroll, form)
src/data.ts             ← edit content here
src/style.css           bespoke dark theme, gradients, scroll-reveal, responsive
functions/api/contact.ts  Cloudflare Pages Function — POST /api/contact (Resend-backed)
vite.config.ts          base "./" so the build also opens as a static file
```

## Case-study pages

Each project card links to a full case-study view via a hash route —
`#/sahiix-os`, `#/jarvis`, … The router (`src/main.ts`, `route()` / `renderDetail`)
swaps `#home` for `#detail` and renders the project's `longDescription`,
`highlights`, role/status/year, and stack. Browser back / the "All work" link
returns home. Deep-linking to `#/<id>` works on a cold load. The content for
every case study lives in `src/data.ts` (the `longDescription` and `highlights`
arrays on each project).

## Contact form

The form POSTs JSON to `/api/contact` (see `functions/api/contact.ts`, a
Cloudflare Pages Function). The flow is honest about delivery:

- **Resend configured** (`RESEND_API_KEY` env set in the Pages dashboard) →
  the message is forwarded to Resend and delivered to `CONTACT_TO`
  (defaults to `CONTACT_FROM`). Set `CONTACT_FROM` to a sender on a
  Resend-verified domain.
- **No key configured** → the function returns `503`, and the client falls
  back to opening the visitor's mail client (`mailto:`). So the form always
  works, even before you wire up delivery.

To run the function locally, use `npx wrangler pages dev dist` (it serves the
static build *and* the `functions/` directory together). Plain `vite preview`
serves the static build only — `/api/contact` 404s there, and the form
correctly falls back to `mailto:`.

## Deploy (Cloudflare Pages)

Static site + one Pages Function (`functions/api/contact.ts`). Two ways:

**Git-connected (recommended):** connect the repo in the Cloudflare dashboard,
build command `npm run build`, output `dist`. Set the secrets below in
Settings → Environment variables. Push to main deploys.

**CLI:** `npm run deploy` (builds, then `wrangler pages deploy dist`).

Secrets (`wrangler pages secret put …` or the dashboard):

| Var | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | no | Resend key; enables email delivery from `/api/contact` |
| `CONTACT_FROM` | if Resend | sender on a Resend-verified domain |
| `CONTACT_TO` | no | destination (defaults to `CONTACT_FROM`) |

With no `RESEND_API_KEY`, `/api/contact` returns `503` and the form falls
back to `mailto:` — it always works.

### After you confirm the deployed domain

Update three placeholders in `index.html` (`canonical`, `og:url`, JSON-LD
`url`) and the `https://sahiix.os/` URLs in `public/robots.txt` and
`public/sitemap.xml`. Then set an `og:image` (see gap note below).

### Known gap: social preview image

There is no raster `og:image` yet — generating one needs a headless browser
or a screenshot tool, which this no-deps stack deliberately avoids. Options
later: a hand-authored `og.png` in `public/`, or a one-off Puppeteer/Playwright
script run locally. The card tags (`og:title`, `og:description`, `twitter:card`)
are wired; only the image is missing.

## Notes

- Project `url: ""` renders a disabled link and the card still opens its
  case study — drop in a live/repo URL to enable the external "View" link.
- `prefers-reduced-motion` disables animations.
- Hash-routed case studies (`#/<id>`) are URL fragments, not separate pages —
  they don't need sitemap entries, and `document.title` updates per route for
  shareability.