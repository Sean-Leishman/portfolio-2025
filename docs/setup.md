# Setup

## Prerequisites

- Node 20+ (Vite 7 and `@types/node ^24` suggest a recent Node).
- npm (a `package-lock.json` is committed-then-gitignored; `package-lock.json`
  is in `.gitignore`).
- For `react-snap` to run during `build`: a working Chromium that Puppeteer
  can launch with the flags listed in `package.json` under `reactSnap`.
- For `npm run sync`: an Obsidian vault at the path hardcoded inside
  `scripts/sync-obsidian.ts` (currently
  `/mnt/c/Users/leish/OneDrive/Documents/Obsidian Vault`). Edit that constant
  if running on a different machine.
- For deploys: Firebase CLI logged in to the `portolfio-2c85b` project.

## Install

```
npm install
```

This also runs `husky` (`prepare` script) which wires up the
`.husky/pre-commit` hook.

## Environment

Create `.env` at the repo root with:

```
EMAIL=<your address>
```

`EmailLink.tsx` consumes this. There are no other env vars.

## Day-to-day commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR. The `contentGeneratorPlugin` runs at startup so posts are picked up. |
| `npm run build` | `tsc -b && vite build && react-snap`. Produces `dist/` with pre-rendered HTML. |
| `npm run preview` | Serves the built `dist/` locally. |
| `npm run sync` | Runs `scripts/sync-obsidian.ts` once, copying public notes from the Obsidian vault into `src/posts/` and images into `src/assets/blog/`. |
| `npm run lint` | ESLint over the repo. |

The pre-commit hook also runs `npm run sync` and stages any new
`src/posts/*.mdx` / `src/assets/blog/*` files. To skip it for a one-off
commit, use git's normal hook-skip mechanism — but be aware the synced posts
are part of the source of truth, not an artifact.

## Deploy

```
npm run build
firebase deploy --only hosting
```

`firebase.json` points to site `2025-portfolio`, public dir `dist`, with a SPA
rewrite of `**` to `/index.html`.

## Things that can trip you up

- `src/generated/` and `public/` are gitignored. The build will recreate
  `src/generated/content.json`. `public/` only contains `done.svg`,
  `favicon.svg`, `vite.svg`; if those go missing, restore from git history (a
  prior version should still have them tracked, or copy from the deployed
  site).
- `package-lock.json` is gitignored too, which makes installs non-reproducible
  across machines. If lockfile drift causes problems, that's why.
- The Obsidian vault path is Windows-under-WSL specific. On any other host,
  `npm run sync` will exit early or error.
- `react-snap` needs Puppeteer's Chromium. On WSL/CI you may need to install
  `chromium-browser` or set `puppeteerExecutablePath`.
