# React + TypeScript + Vite

English | [中文](./README.md)

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Testing

Unit tests run with [Vitest](https://vitest.dev) using a standalone `vitest.config.ts` (Vitest does not read `vite.config.ts`). The setup uses jsdom, Testing Library, and explicit imports (no globals).

```bash
pnpm test        # run once
pnpm test:watch  # watch mode
```

## Deployment (GitHub Pages)

After copying this repo via "Use this template":

1. Set `VITE_BASE_PATH` in `.env.production` to `/<your-repo-name>/` (the vite base is read per environment from `.env.development` / `.env.production`)
2. In repo Settings → Pages, choose **GitHub Actions** as the Source (one-time)
3. Trigger the **Deploy to GitHub Pages** workflow manually from the Actions tab

For a custom domain (root-path deployment), set `VITE_BASE_PATH` to `/`.

## Expanding the Oxlint configuration

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
