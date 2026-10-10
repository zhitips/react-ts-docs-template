// 站点品牌信息单一来源：顶栏、首页、文档侧边栏、标签页标题与 meta 均从此取值。
// 修改位置：.env.development / .env.production 的 VITE_SITE_* 变量（复制模板后改 .env，而不是改这里）；
// 未配置时回退到以下默认值。
export const SITE = {
  name: import.meta.env.VITE_SITE_NAME ?? "React 文档模板",
  description:
    import.meta.env.VITE_SITE_DESCRIPTION ??
    "基于 React + TypeScript + Vite 与 fumadocs 的文档站模板：MDX 编写文档、全文搜索、明暗主题，开箱即可部署到 GitHub Pages。",
  githubUrl:
    import.meta.env.VITE_GITHUB_URL ??
    "https://github.com/zhitips/react-ts-docs-template",
} as const
