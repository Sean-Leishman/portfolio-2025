# Notes

Loose observations while documenting the repo. Not authoritative; just things
to be aware of.

## Spelling

The Firebase project id is `portolfio-2c85b` (transposed letters). The
hosting site is the correctly-spelled `2025-portfolio`. Don't "fix" the
project id — it has to match what's actually provisioned in Firebase.

## Generated and ignored files

`.gitignore` excludes `src/generated/` and `public/`. The build needs both:

- `src/generated/content.json` is recreated at build time by the Vite plugin.
- `public/` currently holds `done.svg` (favicon source), `favicon.svg`,
  `vite.svg`. These are not regenerated — losing them means restoring from a
  prior commit or the deployed site.

`package-lock.json` is also ignored. Installs are not reproducible.

## Sync script assumptions

`scripts/sync-obsidian.ts`:

- Hardcodes `OBSIDIAN_VAULT = '/mnt/c/Users/leish/OneDrive/Documents/Obsidian Vault'`.
- Treats `visibility: public` in frontmatter as the publish flag.
- Skips folders named `99 Templates` and `99 Archive`.
- Generates slugs by lowercasing and replacing non-alphanumerics with `-`.
- Resolves wikilinks only to other public posts (by filename or title,
  case-insensitive). Unmatched wikilinks degrade to display text.
- Rewrites image paths to `/src/assets/blog/<filename>`. Images that don't
  resolve in any candidate folder fall back to a vanilla markdown image,
  which probably won't render correctly in the built site.
- Always overwrites the destination file. There is no "deleted from vault"
  signal — orphaned posts in `src/posts/` won't be cleaned up.

## Component injection into MDX

`vite.config.ts` reads `LinkTo.tsx` and `Figure.tsx` source from disk and
passes it to `mdx-bundler` via `files`. If those component paths or names
ever move, the build will fail silently for any post that uses them.

## Dependencies that look unused

- `vite-plugin-ssr` is in devDependencies but not imported in
  `vite.config.ts`. Possibly a leftover from an earlier SSR experiment.
- `node-gyp`, `process`, `esbuild`, `mdx` (the bare `mdx` package separate
  from `@mdx-js/*`) are listed as runtime dependencies; some are likely
  transitive needs that got hoisted in by mistake.

## In-flight changes captured by this commit

The four untracked files committed alongside these docs were the dirty state
when documentation was written:

- `.env` — single line, `EMAIL=...`. Local-only secret. Probably should be
  in `.gitignore` (it currently is not, which is why git sees it as
  untracked rather than ignored). Worth reviewing whether to commit it; for
  now it's being captured to match the working tree.
- `.firebaserc` — Firebase project id mapping. Safe to commit; it's just the
  project alias.
- `firebase.json` — hosting config (site, public dir, rewrites). Safe to
  commit.
- `.firebase/` — Firebase CLI's local cache (`hosting.ZGlzdA.cache`).
  Almost certainly should be `.gitignore`d rather than committed; capturing
  it here is the literal "stage everything" instruction, but a follow-up
  cleanup is warranted.

## Suggested follow-ups (done 2026-09-15)

- `.env` and `.firebase/` are now gitignored and untracked. `.env` (the email)
  remains in history; the repo is public, so treat that address as public.
- `package-lock.json` is committed.
- Vault path comes from `OBSIDIAN_VAULT` (default `~/Projects/Nordorn`).
- Removed `vite-plugin-ssr`, `node-gyp`, `process`, `mdx`. Kept `esbuild`:
  it is a peer dependency of `mdx-bundler`.

### 2026-09-15 — orphan cleanup in the sync

Synced posts now carry `source: obsidian` in frontmatter. After each run the
sync deletes any `src/posts/*.mdx` with that marker whose slug is not a public
note in the vault. Most posts (chess, et-tu-uv, gyrosound, stocktrend,
welcome-post) are hand-written with no marker, so they are never touched — a
naive "not in vault => delete" would have wiped them. Blocked/failed notes stay
in the public index, so their last good version is kept. The pre-commit hook
now uses `git add -A` so deletions get staged. Orphaned images are not swept.
Covered by `scripts/test-leak-gate.sh`.

### 2026-09-15 — performance pass (Lighthouse mobile, local preview)

Home 53 -> 85, post page ~48 -> 82. Live site scored 48 but was serving a 402B empty shell
(stale deploy predating the react-snap fix), so deploying matters as much as any of this.

- Google Fonts `@import` in CSS was ~3s render-blocking and 426KB. Self-hosted latin subsets
  in `src/assets/fonts/` (267KB, dropped the unused `opsz` axis).
- SVG `feTurbulence` grain cost ~300ms style/layout + TBT. Replaced with a 5KB noise tile
  (`src/assets/grain-*.webp`, generated with ImageMagick `+noise Random`).
- Post bodies, MDX runtime and syntax highlighter split out of the main bundle (133 -> 94KB gz).
  `main.tsx` preloads the current post before hydrating and prefetches the rest when idle.
- `createRoot` -> `hydrateRoot`: createRoot re-painted react-snap's HTML after JS, which was the LCP.
  Hydration needed: no adjacent JSX text nodes (`{a} · {b}` -> template string), react-snap
  `minifyHtml.collapseWhitespace: false`, CSS-driven theme icon, and a text-merging renderer
  for react-syntax-highlighter. Guard: `node scripts/check-hydration.cjs` against `npm run preview`.
- `scripts/inline-css.mjs` (post-build) inlines the 5KB CSS and preloads Merriweather.
- `firebase.json`: `trailingSlash: false` (serve `posts/index.html` at `/posts` without a
  redirect), immutable caching for hashed js/css/woff2, 7 days for images.
- Remaining LCP (~4s simulated) is text waiting on the 95KB font. `font-display: optional`
  would fix it at the cost of a fallback font on first slow visits; not done.
