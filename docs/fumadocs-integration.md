# fumadocs 集成说明

本文档记录项目中 fumadocs 文档框架的集成方式与维护要点，供后续维护参考。

- 官方安装指南：<https://www.fumadocs.dev/docs/manual-installation/react-router>
- 官方参考示例：[fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs) 仓库 `examples/react-router-min`

## 架构决策

集成时有两个关键取舍，后续改动前请先了解：

1. **保持 Vite SPA 模式，未迁移 React Router framework 模式**。
   官方 react-router 指南基于 framework 模式（`@react-router/dev`、`routes.ts`、loader、SSR）；本项目是 `createBrowserRouter` SPA，因此走了官方 Vite 插件路线（同 Waku/Tanstack Start 的支持方式），文档页全客户端渲染：
   - 无 loader，slug 从 `useParams()['*']` 获取
   - 页面树用同步的 `source.getPageTree()` 直接传入 `DocsLayout`
   - 文档正文通过 React 19 的 `use(page.load())` 懒加载
   - 代价：无 SSR/预渲染，文档页 SEO 弱；搜索无服务端可用（见「已知限制」）

2. **主题用 `fumadocs-ui/css/shadcn.css`，且 import 写在 `src/design.css`（不写进 index.css）**。
   shadcn.css 把 fumadocs 的 `--color-fd-*` 变量映射到项目现有的 shadcn token（`--background`、`--primary` 等），文档页与应用页视觉统一，暗色模式自动跟随 `.dark` 体系。design.css 由 index.css 末尾引入，保持单一 Tailwind v4 context。

## 依赖

| 包 | 角色 | 必须性 |
| --- | --- | --- |
| `fumadocs-core` | 内容源 API（`loader`、页面树、路由解析）；同时是另外两个包的 peer dependency | 必须 |
| `fumadocs-mdx` | 构建层：vite 插件 + `defineDocs` 宏，负责把 `content/docs/*.mdx` 编译成模块（含 Shiki 高亮、remark 插件） | 当前方案下必须 |
| `fumadocs-ui` | UI 层：DocsLayout / DocsPage / RootProvider / 内置 MDX 组件 / 主题 CSS | 使用官方 UI 则必须 |

三者互不替代：`fumadocs-ui` 与 `fumadocs-mdx` 互不依赖，但都以 `fumadocs-core` 为 peer。

另有 devDependency `@types/mdx`（提供 `mdx/types` 的 `MDXComponents` 类型）。

**版本配对注意**：`fumadocs-ui` 对 `fumadocs-core` 是**精确版本** peer 要求（如 ui@16.17.0 要求 core@16.17.0），`fumadocs-mdx` 则是 `^` 范围。升级时三个包建议一起升、版本对齐官方 monorepo 的发布版本，否则 install 会出现 peer 警告（仅警告，补丁级差异实际可用）。

## 文件清单

| 文件 | 职责 |
| --- | --- |
| `content/docs/*.mdx`、`meta.json` | 文档内容源；`meta.json` 的 `pages` 数组控制侧边栏顺序，`"..."` 表示其余页面按默认顺序追加 |
| [src/lib/source.ts](../src/lib/source.ts) | 定义内容源：`defineDocs`（`async: true` 按文档分包）+ `loader`（baseUrl `/docs`） |
| [src/components/mdx.tsx](../src/components/mdx.tsx) | `getMDXComponents`：fumadocs 默认 MDX 组件 + 自定义组件合并处 |
| [src/pages/DocsPage.tsx](../src/pages/DocsPage.tsx) | `/docs/*` 路由组件（SPA 适配核心，见下） |
| [src/layouts/AppProviders.tsx](../src/layouts/AppProviders.tsx) | `RootProvider`（来自 `fumadocs-ui/provider/react-router`），包住全部路由；搜索在此禁用 |
| [src/router.tsx](../src/router.tsx) | 无路径根节点（AppProviders）+ `/docs/*` 子树（与 RootLayout 平级，文档页不套应用顶栏） |
| [src/design.css](../src/design.css) | fumadocs 样式入口：`shadcn.css` + `preset.css` |
| [vite.config.ts](../vite.config.ts) | `fumadocsMdx()` 插件，置于插件数组最前 |

## 工作机制（非显而易见的部分）

- **宏转换**：`fumadocs-mdx/macro` 的 `defineDocs` 本体只会抛错，必须由 vite 插件在构建期转换。转换结果（可在 dev server 请求 `/src/lib/source.ts` 查看）：frontmatter 即时收集、正文以 `() => import(...)` 懒加载。如果运行时报 "this macro was not compiled"，检查插件是否加载、`dir` 路径是否正确。
- **async 分包**：`docs: { async: true }` 使每篇文档成为独立 chunk（构建产物中的 `*.mdx_*.js`）。`DocsPage.tsx` 里 `use(page.load())` 消费该 promise 拿 toc 与正文组件。
- **路由与 404**：`source.getPage(slugs)` 未命中时抛 `Response(404)`，由 docs 路由上的 `errorElement: <NotFoundPage />` 兜底。
- **RootProvider 必须在 Router 上下文内**：它内部使用 react-router 的 Link/navigate，因此放在路由树的根节点元素里，而不是 `main.tsx`。
- **CSS 链路**：`index.css` 末尾 `@import "./design.css"` → design.css 引入 fumadocs 两个 CSS → `preset.css` 内含 Tailwind v4 的 `@plugin`（typography），由 `@tailwindcss/vite` 在同一 CSS context 处理。**不要**把 fumadocs 样式直接写进 index.css 顶部或另建 CSS 入口。

## 新增文档

1. 在 `content/docs/` 下新建 `.mdx` 文件，frontmatter 至少写 `title`（可选 `description`）；
2. 如需控制顺序，把文件名（不含扩展名）加入 `content/docs/meta.json` 的 `pages` 数组；
3. 路由即文件路径：`content/docs/guide.mdx` → `/docs/guide`，子目录 `advanced/config.mdx` → `/docs/advanced/config`。

MDX 内可直接使用 fumadocs 内置组件（`<Callout>`、`<Card>` 等，完整列表见 `defaultMdxComponents`）；自定义组件在 `src/components/mdx.tsx` 中注册。

## 已知限制

- **搜索已禁用**：`AppProviders.tsx` 中 `search={{ enabled: false }}`。SPA 无 `/api/search` 服务端。后续启用方案：
  - `fumadocs-core/search/client/flexsearch-static` + 构建期生成静态索引 JSON（无服务端方案，见官方 [FlexSearch 静态导出文档](https://fumadocs.dev/docs/search/flexsearch)）；
  - 或迁移 React Router framework 模式，走官方 `api/search` 路由（同时获得 SSR/预渲染）。
- **构建警告**：`Module "node:fs/promises" has been externalized...` 来自 fumadocs `renderToMarkdown` 的浏览器存根，仅被 `getText()`（AI/LLM 接口）动态调用，不在文档渲染路径，可忽略。
- **测试**：`vitest.config.ts` 未加 `fumadocsMdx()` 插件（现有测试不涉及 MDX 内容）。若未来测试需要 import 文档内容或 `@/lib/source`，需将插件同步加入 vitest 配置。
- **类型检查**：`content/` 不在 tsconfig include 内，MDX 文件不参与 `tsc` 类型检查，属预期行为。

## 验证清单

改动 fumadocs 相关代码后，依次确认：

```bash
pnpm dev     # /docs 渲染正常：标题/描述/TOC/代码高亮/表格；/docs/xxx 随意路径落到 404
pnpm build   # tsc 类型检查 + 构建；产物含各文档独立 chunk（async 分包生效）
pnpm test    # 现有测试不受影响
pnpm lint    # 无新增告警
```

明暗主题切换（文档页右下角 fumadocs theme switch）下，文档页配色应跟随应用 token 变化。
