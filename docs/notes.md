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

## Suggested follow-ups (not done)

- Add `.env`, `.firebase/`, and `dist/` to `.gitignore`. (`dist/` is already
  there; the other two are not.)
- Un-ignore `package-lock.json` for reproducible installs.
- Pull the Obsidian vault path into an env var so the sync works on more
  than one machine.
- Decide whether `vite-plugin-ssr` is needed; remove if not.
