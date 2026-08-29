# CSmohmmadSH.github.io

Personal portfolio — Cloud & DevOps. Built with [Astro](https://astro.build) as a static site,
deployed to GitHub Pages by GitHub Actions on every push to `main`.

No framework runtime, no backend. One HTML page, one CSS file, one small JS module for the
background canvas.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve dist/ exactly as Pages will
```

Node 18.20+ or 20+ required.

## Where things live

```
public/                 static files copied verbatim to the site root
  cv.pdf                linked from the header "Download CV" button
  avatar.svg            placeholder monogram — replace with your photo (see below)
  favicon.svg
  .nojekyll             stops Pages ignoring the /_astro/ folder
src/
  data/site.js          ALL copy and data — edit here, not in components
  styles/global.css     design tokens, layout, responsive and reduced-motion rules
  scripts/canvas.js     background cluster topology
  components/           Header, Hero, Work, Stack, About, Contact, Background
  layouts/Base.astro    <head>, fonts, meta
  pages/index.astro     assembles the page
astro.config.mjs        site URL + base path
.github/workflows/deploy.yml
```

### Editing content

Everything the page renders — nav, hero copy, highlights, the Task Tracker case study, the
pipeline steps, spec table, project cards, stack chips, about paragraphs, fact rows — is exported
from `src/data/site.js`. Change a string there and the page updates. The components only handle
markup.

### Using your real avatar

```bash
curl -L "https://avatars.githubusercontent.com/u/106165079?v=4" -o public/avatar.jpg
```

Then set `avatar: '/avatar.jpg'` in `src/data/site.js`.

### Replacing the CV

Drop the new PDF at `public/cv.pdf`. The path stays stable, so the header link never changes.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` via
`actions/deploy-pages`. In the repo: **Settings → Pages → Source → GitHub Actions**.

Because this is a *user* site (`<username>.github.io`), the site lives at the domain root and
`base` stays `/`. If you ever move it to a project repo, set both in `astro.config.mjs`:

```js
site: 'https://CSmohmmadSH.github.io',
base: '/portfolio',
```

and prefix internal asset paths with `import.meta.env.BASE_URL`.

## Notes on the port

Recreated from the design handoff at high fidelity — colours, type, spacing and motion values are
unchanged. Three things the handoff listed as open were closed here:

- **Responsive pass.** Gutters drop 48 → 26 → 20px, the header stacks below 640px, the nav numbers
  hide, contact buttons go full width, and the decorative rings are dropped on small screens.
- **`prefers-reduced-motion`.** All CSS animation is neutralised, the canary meter freezes at a
  representative 38/62 split, the sheen is removed, and the canvas renders one static frame with no
  `requestAnimationFrame` loop.
- **Canvas cost.** The particle mesh is O(n²); the count drops from 150 to 70 below 700px wide or on
  devices reporting ≤4 cores, and the loop pauses while the tab is hidden.

Scroll reveals use CSS `animation-timeline: view()`. Browsers without it (Safari < 26, Firefox)
show the content immediately because `animation-fill-mode` is `both` — no fallback needed, no
IntersectionObserver.
