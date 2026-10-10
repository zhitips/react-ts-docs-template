# React Docs Template

English | [中文](./README.md)

A docs site template built on React + TypeScript + Vite and [fumadocs](https://fumadocs.vercel.app/): write docs in MDX, with full-text search and light/dark themes — ready to deploy to GitHub Pages out of the box.

## Features

- 📝 **MDX docs** — Shiki syntax highlighting, built-in Callout / Card components; drop a file into `content/docs` and it goes live
- 🔍 **Full-text search** — ⌘K to open, static index generated at build time, searched locally in the browser; no backend required
- 🌗 **Light/dark theme** — follows system preference, one-click toggle in the navbar, applied site-wide
- 🚀 **GitHub Pages deployment** — builds adapt to sub-path base automatically, with a GitHub Actions workflow included
- 🧱 **Page scaffolding** — home page (doc cards generated automatically), about page, 404 fallback, and shadcn-style ui components

## Tech Stack

React 19 · React Router 8 · TypeScript · Vite · fumadocs · Tailwind CSS v4 · shadcn ui

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

After copying this repo via GitHub's "Use this template", follow [Deployment](#deployment-github-pages) below to go live.

## Writing Docs

1. Create an MDX file under `content/docs` with frontmatter for the title and description:

   ````mdx
   ---
   title: Guide
   description: A one-line description shown under the title.
   ---

   ## Heading

   Body content.
   ````

2. Edit `content/docs/meta.json` — the `pages` array controls sidebar order, and `"..."` appends the remaining pages in default order
3. The file path is the route: `content/docs/guide.mdx` maps to `/docs/guide`

See the in-site doc ["Adding Docs"](https://zhitips.github.io/react-ts-docs-template/docs/getting-started) for more.

## Site Configuration

- **Branding** (name, description, GitHub URL) is configured via `VITE_SITE_NAME` / `VITE_SITE_DESCRIPTION` / `VITE_GITHUB_URL` in `.env` — change them once and the whole site follows (keep `.env.development` and `.env.production` in sync)
- **Base path**: the vite base is read per environment from `VITE_BASE_PATH` in `.env.development` / `.env.production`

## Deployment (GitHub Pages)

After copying this repo via "Use this template":

1. Set `VITE_BASE_PATH` in `.env.production` to `/<your-repo-name>/`
2. In repo Settings → Pages, choose **GitHub Actions** as the Source (one-time)
3. Trigger the **Deploy to GitHub Pages** workflow manually from the Actions tab

For a custom domain (root-path deployment), set `VITE_BASE_PATH` to `/`.

## Development

```bash
pnpm dev         # local dev server
pnpm build       # generate search index + type check + build
pnpm preview     # preview the production build
pnpm test        # unit tests (run once)
pnpm test:watch  # unit tests (watch mode)
pnpm lint        # Oxlint
```

Unit tests run with [Vitest](https://vitest.dev) (standalone `vitest.config.ts` — Vitest does not read `vite.config.ts`), using jsdom + Testing Library with explicit imports.

### Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Maintainer Notes

- [fumadocs integration architecture](./docs/fumadocs-integration.md) — Vite SPA integration approach, dependency version pairing, and other architectural decisions
