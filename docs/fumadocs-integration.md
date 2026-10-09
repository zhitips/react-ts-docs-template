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
   - 搜索采用静态索引方案（无服务端，见「静态搜索」）
   - 代价：无 SSR/预渲染，文档页 SEO 弱

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
| [src/layouts/AppProviders.tsx](../src/layouts/AppProviders.tsx) | `RootProvider`（来自 `fumadocs-ui/provider/react-router`），包住全部路由；挂载静态搜索对话框 |
| [src/router.tsx](../src/router.tsx) | 无路径根节点（AppProviders）+ `/docs/*` 子树（与 RootLayout 平级，文档页不套应用顶栏） |
| [src/design.css](../src/design.css) | fumadocs 样式入口：`shadcn.css` + `preset.css` |
| [src/components/StaticSearchDialog.tsx](../src/components/StaticSearchDialog.tsx) | 静态搜索对话框：`useStaticSearch` 下载索引后本地查询（ZBSearch） |
| [scripts/generate-search-index.mjs](../scripts/generate-search-index.mjs) | 构建期索引导出脚本（`pnpm gen:search`），产物 `public/search-index.json` |
| [vite.config.ts](../vite.config.ts) | `fumadocsMdx()` 插件（最前）+ dev 即时索引中间件 `fumadocsSearchDevServer()` |

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

## 静态搜索（ZBSearch）

SPA 无 `/api/search` 服务端，搜索走官方静态模式（fumadocs v16 默认引擎为 [ZBSearch](https://www.zbsearch.dev)，见官方 [搜索文档](https://fumadocs.dev/docs/search/orama)）：

- **数据链路**：`createFromSource(source).staticGET()` 导出序列化索引 → `useStaticSearch({ from: "/search-index.json" })` 浏览器下载后本地查询，首次打开搜索时才加载，不影响首屏。
- **构建**：`pnpm build` 前置执行 `pnpm gen:search`（`scripts/generate-search-index.mjs`），生成 `public/search-index.json`（已 gitignore），vite 自动拷入 dist。
- **dev**：`vite.config.ts` 的 `fumadocsSearchDevServer()` 中间件按请求即时生成 `/search-index.json`（以 content 目录与 source.ts 的 mtime 做缓存失效），改文档无需重启。
- **Node 脚本原理**：`register()`（`fumadocs-mdx/node`）注册模块加载钩子后才能导入含宏的 `src/lib/source.ts`；读取 `.ts` 需要 Node 类型剥离，故脚本命令带 `--experimental-strip-types`（Node 22.6+，22.18+/23+ 可省略）。
- **自定义对话框**：默认对话框请求 `/api/search`（SPA 下不可用），故用 `search={{ SearchDialog: StaticSearchDialog }}` 替换。
- 索引 JSON 含全部文档正文摘要（当前约 21 kB），文档量大时体积可观，官方建议大文档站改用云方案（Algolia/Orama Cloud）。

## 部署（GitHub Pages）

部署地址：<https://zhitips.github.io/react-ts-docs-template/>（子路径）。工作流 [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)，**仅手动触发**（`workflow_dispatch`，不随 push 自动部署）。

- **触发路径**：仓库 Actions 页 → Deploy to GitHub Pages → Run workflow。
- **前提 1**：workflow 文件需存在于**默认分支 main**（GitHub 的 Run workflow 按钮只列出默认分支上的工作流；日常开发在 dev 分支，合并到 main 后 UI 才能触发）。
- **前提 2（一次性）**：Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。
- **流程**：pnpm install → `pnpm build`（含搜索索引生成）→ `cp dist/index.html dist/404.html` → 上传部署。

子路径部署的适配点（改仓库名/换部署方式时需同步检查）：

| 位置 | 适配 |
| --- | --- |
| `vite.config.ts` | `base` 用 `loadEnv` 从 `.env.development` / `.env.production` 的 `VITE_BASE_PATH` 读取；复制模板/改仓库名后只需改 `.env.production` 一行 |
| `src/router.tsx` | `createBrowserRouter` 的 `basename: import.meta.env.BASE_URL` |
| `src/components/StaticSearchDialog.tsx` | 索引 URL `` `${import.meta.env.BASE_URL}search-index.json` `` |
| `index.html` | favicon 用 `%BASE_URL%` 占位符 |
| workflow | `404.html` 复制（SPA 深链回退）+ `.nojekyll` |

注意：SPA 深链直开返回 404 状态码但页面正常渲染（Pages 静态托管无重写）；若绑定自定义域名（根路径部署），把 `.env.production` 的 `VITE_BASE_PATH` 改为 `/` 即可。

## 已知限制



- **构建警告**：`Module "node:fs/promises" has been externalized...` 来自 fumadocs `renderToMarkdown` 的浏览器存根，仅被 `getText()`（AI/LLM 接口）动态调用，不在文档渲染路径，可忽略。
- **测试**：`vitest.config.ts` 未加 `fumadocsMdx()` 插件（现有测试不涉及 MDX 内容）。若未来测试需要 import 文档内容或 `@/lib/source`，需将插件同步加入 vitest 配置。
- **类型检查**：`content/` 不在 tsconfig include 内，MDX 文件不参与 `tsc` 类型检查，属预期行为。

## 验证清单

改动 fumadocs 相关代码后，依次确认：

```bash
pnpm dev     # /docs 渲染正常：标题/描述/TOC/代码高亮/表格；/docs/xxx 随意路径落到 404
pnpm build   # 索引生成 + tsc 类型检查 + 构建；产物含各文档独立 chunk 与 search-index.json
pnpm test    # 现有测试不受影响
pnpm lint    # 无新增告警
```

- ⌘K 打开搜索框，输入关键词应出结果并可跳转（索引来自 `/search-index.json`）
- 明暗主题切换（文档页右下角 fumadocs theme switch）下，文档页配色应跟随应用 token 变化
