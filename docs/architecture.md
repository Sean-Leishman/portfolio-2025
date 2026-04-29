# Architecture

## Shape

A single-page React app, statically built and pre-rendered into HTML for a
handful of routes, then served from Firebase Hosting. There is no runtime
backend. Content (blog posts) is baked into the bundle at build time as a JSON
manifest.

## Build pipeline

```
Obsidian vault  --(scripts/sync-obsidian.ts)-->  src/posts/*.mdx
src/posts/*.mdx --(vite contentGeneratorPlugin)-->  src/generated/content.json
src/**          --(vite + @mdx-js/rollup)-->        dist/
dist/           --(react-snap)-->                    dist/ with prerendered HTML
dist/           --(firebase deploy)-->               Firebase Hosting
```

### Sync (optional, manual or pre-commit)

`scripts/sync-obsidian.ts` walks an Obsidian vault (path hardcoded to
`/mnt/c/Users/leish/OneDrive/Documents/Obsidian Vault`), filters notes whose
frontmatter contains `visibility: public`, and rewrites them to MDX:

- Wikilinks `[[note]]` and `[[note|text]]` resolve against an in-pass index of
  other public notes; matched links become `<LinkTo>` components, unmatched
  links collapse to plain text.
- Image embeds `![[file.png]]` are resolved against several candidate folders
  inside the vault, copied to `src/assets/blog/`, and rewritten as `<Figure>`
  components.
- Obsidian callouts become bold-headed blockquotes.
- A normalised frontmatter block (`title`, `date`, `tags`, `Summary`, etc.) is
  emitted via `gray-matter`.

The output filename is `${slug-of-title}.mdx` in `src/posts/`.

A Husky `pre-commit` hook runs `npm run sync` and stages any new
`src/posts/*.mdx` and `src/assets/blog/*` files.

### Content generation (Vite plugin)

`vite.config.ts` defines `contentGeneratorPlugin`. On `buildStart` it:

1. Reads every `.md`/`.mdx` in `src/posts/`.
2. Compiles each one with `mdx-bundler`'s `bundleMDX`, injecting the source of
   `LinkTo.tsx` and `Figure.tsx` so those components are available inside the
   compiled MDX.
3. Builds an item record `{ filename, title, date, tags, imageSrc, imageAlt,
   link, compiledMdx }` where `link` comes from `extractLink('posts', title,
   date)` in `src/lib/utils.ts`.
4. Sorts by date desc and writes `src/generated/content.json`.

The same MDX is also handled at module-graph level by `@mdx-js/rollup` (with
`enforce: 'pre'`) so any direct `.mdx` imports work too.

### Routing and rendering

`src/App.tsx` reads `getPosts()` (which returns the generated JSON) and
synchronously builds a `<Route>` per post, in addition to fixed routes for
`/`, `/posts`, `/projects`. Each post route renders `<Post>` which feeds the
pre-compiled MDX string into `MDXRenderer` (uses `@mdx-js/react`'s provider).

### Pre-rendering

`react-snap` config in `package.json` crawls `dist/` starting from `/`,
`/posts`, `/projects`. Because every post route is registered in `App.tsx`,
crawling `/posts` (which links to each post) lets react-snap discover and
snapshot every post page. Puppeteer flags assume a sandboxed/CI-friendly
Chrome.

### Hosting

`firebase.json` maps `dist/` to Firebase Hosting site `2025-portfolio` with a
SPA-style `**` rewrite to `/index.html` — the rewrite matters for any path
that was not pre-rendered (otherwise react-snap's static HTML is served
directly).

## Data sources

- Posts: `src/generated/content.json` (generated, gitignored)
- Projects: `src/lib/projects.tsx` (hand-edited)
- Experience: `src/components/Experience.tsx` /
  `src/components/ExperienceList.tsx` (hand-edited React)

## What is intentionally not here

- No server, no API, no database, no auth.
- No CMS — Obsidian is the editor; the sync script is the import path.
- No incremental build of posts — the whole `content.json` is rewritten each
  build.
