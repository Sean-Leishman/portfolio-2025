# portfolio-2025

## Purpose

Sean Leishman's current personal portfolio site. A static React SPA that
showcases projects, work experience, and a blog of MDX posts. Posts are sourced
from a private Obsidian vault: notes flagged `visibility: public` are converted
to MDX by a sync script and committed into the repo. The site is pre-rendered
to static HTML with `react-snap` and deployed to Firebase Hosting. Supersedes
the older `portfolio` repo.

## Tech stack

- React 19 + TypeScript, routed with `react-router-dom` v7
- Vite 7 build, with a custom plugin that compiles MDX into a JSON manifest at
  build time (`src/generated/content.json`)
- Tailwind CSS v4 (via `@tailwindcss/vite`) + `@tailwindcss/typography`
- MDX via `@mdx-js/rollup` and `mdx-bundler`, with `remark-gfm`,
  `remark-frontmatter`, `remark-mdx-frontmatter`, `remark-math`
- `react-snap` for static pre-rendering of `/`, `/posts`, `/projects`
- Firebase Hosting (site `2025-portfolio`, project `portolfio-2c85b` [sic])
- Husky pre-commit hook that runs the Obsidian sync

## Key files / entry points

- `index.html`, `src/main.tsx`, `src/App.tsx` — SPA entry and routing
- `src/pages/{Home,Posts,Projects}.tsx` — top-level pages
- `src/components/Post.tsx` + `MDXRenderer.tsx` — renders compiled MDX
- `src/posts/*.mdx` — committed blog posts (output of the sync)
- `src/lib/projects.tsx` — hand-maintained projects list
- `src/lib/content.ts` — reads `src/generated/content.json`
- `vite.config.ts` — `contentGeneratorPlugin` walks `src/posts` and writes
  `src/generated/content.json`
- `scripts/sync-obsidian.ts` — pulls public notes from the Obsidian vault
- `.husky/pre-commit` — runs `npm run sync` then stages new posts/assets
- `firebase.json`, `.firebaserc` — hosting config

## Run / dev

```
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build && react-snap
npm run preview  # serve the built dist/
npm run sync     # tsx scripts/sync-obsidian.ts (reads Obsidian vault)
npm run lint
```

`.env` provides `EMAIL` (used by `EmailLink`). Deploy is `firebase deploy`
against the `dist/` output.

## Conventions noticed

- 4-space indent in TS/TSX, single quotes, no semicolons in some files but
  present in others — not consistent
- Posts list is generated at build time and read synchronously; route paths
  for posts come from `extractLink(directory, title, date)` in `src/lib/utils.ts`
- Projects are hardcoded in `src/lib/projects.tsx`, not synced
- Asset paths in MDX use `/src/assets/...` and are copied through by
  `vite-plugin-static-copy`
- `src/generated/` and `public/` are gitignored; `package-lock.json` is too

## Gaps / unknowns

- Obsidian vault path is hardcoded to a Windows OneDrive path under WSL
  (`/mnt/c/Users/leish/...`); sync is single-machine
- No tests
- `.firebaserc` project id is misspelled (`portolfio-2c85b`); kept as-is
  because it matches the actual Firebase project
- `vite-plugin-ssr` is in devDependencies but unused as far as I can see
