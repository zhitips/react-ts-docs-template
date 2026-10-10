# React 文档模板

[English](./README.en.md) | 中文

基于 React + TypeScript + Vite 与 [fumadocs](https://fumadocs.vercel.app/) 的文档站模板：MDX 编写文档、全文搜索、明暗主题，开箱即可部署到 GitHub Pages。

## 特性

- 📝 **MDX 组件化文档** —— Shiki 代码高亮、内置 Callout / Card 等组件，`content/docs` 加文件即生效
- 🔍 **全文搜索** —— ⌘K 唤起，构建期生成静态索引，浏览器本地检索，无需后端服务
- 🌗 **明暗主题** —— 跟随系统偏好，顶栏一键切换，全站统一生效
- 🚀 **GitHub Pages 部署** —— 构建自动适配子路径 base，附 GitHub Actions 工作流
- 🧱 **页面体系** —— 首页（文档卡片自动生成）、关于页、404 兜底，shadcn 风格 ui 组件

## 技术栈

React 19 · React Router 8 · TypeScript · Vite · fumadocs · Tailwind CSS v4 · shadcn ui

## 快速开始

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

通过 GitHub 「Use this template」复制本仓库后，按下文[部署](#部署github-pages)即可上线。

## 写文档

1. 在 `content/docs` 下创建 MDX 文件，frontmatter 声明标题与描述：

   ````mdx
   ---
   title: 指南
   description: 文档的一句话描述，会显示在标题下方。
   ---

   ## 一级标题

   正文内容。
   ````

2. 编辑 `content/docs/meta.json`，`pages` 数组控制侧边栏顺序，`"..."` 表示其余页面按默认顺序追加
3. 文件路径即路由路径：`content/docs/guide.mdx` 对应 `/docs/guide`

更多用法见站内文档[《新增文档》](https://zhitips.github.io/react-ts-docs-template/docs/getting-started)。

## 站点配置

- **品牌信息**（名称、描述、GitHub 地址）统一在 `.env` 的 `VITE_SITE_NAME` / `VITE_SITE_DESCRIPTION` / `VITE_GITHUB_URL` 配置，改一处即全站生效（`.env.development` 与 `.env.production` 需保持一致）
- **base 路径**：vite base 按环境从 `.env.development` / `.env.production` 的 `VITE_BASE_PATH` 读取

## 部署（GitHub Pages）

通过「Use this template」复制本仓库后：

1. 把 `.env.production` 中的 `VITE_BASE_PATH` 改为 `/<你的仓库名>/`
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**（一次性）
3. Actions 页手动触发 **Deploy to GitHub Pages** 工作流

绑定自定义域名（根路径部署）时，把 `VITE_BASE_PATH` 改为 `/` 即可。

## 开发

```bash
pnpm dev         # 本地开发
pnpm build       # 生成搜索索引 + 类型检查 + 构建
pnpm preview     # 预览构建产物
pnpm test        # 单元测试（单次运行）
pnpm test:watch  # 单元测试（监听模式）
pnpm lint        # Oxlint 检查
```

单元测试使用 [Vitest](https://vitest.dev)（独立配置文件 `vitest.config.ts`，Vitest 不会读取 `vite.config.ts`），环境为 jsdom + Testing Library，测试 API 显式导入。

### 扩展 Oxlint 配置

开发生产环境应用时，建议安装 `oxlint-tsgolint` 启用类型感知的 lint 规则，并编辑 `.oxlintrc.json`：

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

## 维护者参考

- [fumadocs 集成架构](./docs/fumadocs-integration.md) —— Vite SPA 集成方式、依赖版本配对等架构决策
