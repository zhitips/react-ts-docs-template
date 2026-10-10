# React + TypeScript + Vite

[English](./README.en.md) | 中文

本模板提供了一套最小化配置，让 React 在 Vite 中开箱即用，包含 HMR（热模块替换）和部分 Oxlint 规则。

目前提供两个官方插件：

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) 使用 [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) 使用 [SWC](https://swc.rs/)

## React Compiler

本模板未启用 React Compiler，因为它会影响开发与构建性能。如需启用，请参阅[这份文档](https://react.dev/learn/react-compiler/installation)。

## 测试

单元测试使用 [Vitest](https://vitest.dev) 运行，采用独立配置文件 `vitest.config.ts`（Vitest 不会读取 `vite.config.ts`）。测试环境为 jsdom，配合 Testing Library，测试 API 采用显式导入（不启用 globals）。

```bash
pnpm test        # 单次运行
pnpm test:watch  # 监听模式
```

## 部署（GitHub Pages）

通过「Use this template」复制本仓库后：

1. 把 `.env.production` 中的 `VITE_BASE_PATH` 改为 `/<你的仓库名>/`（vite base 按环境从 `.env.development` / `.env.production` 读取）
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**（一次性）
3. Actions 页手动触发 **Deploy to GitHub Pages** 工作流

绑定自定义域名（根路径部署）时，把 `VITE_BASE_PATH` 改为 `/` 即可。

站点品牌信息（名称、描述、徽章文案、GitHub 地址）统一在 `.env` 的 `VITE_SITE_NAME` / `VITE_SITE_DESCRIPTION` / `VITE_SITE_BADGE` / `VITE_GITHUB_URL` 配置，改一处即全站生效（`.env.development` 与 `.env.production` 需保持一致）。

## 扩展 Oxlint 配置

如果你在开发生产环境应用，建议安装 `oxlint-tsgolint` 启用类型感知的 lint 规则，并编辑 `.oxlintrc.json`：

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

完整规则列表与分类请查阅 [Oxlint 规则文档](https://oxc.rs/docs/guide/usage/linter/rules)。
