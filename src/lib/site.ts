// 站点品牌信息单一来源：顶栏、首页、文档侧边栏、标签页标题与 meta 均从此取值。
// 修改位置：.env.development / .env.production 的 VITE_SITE_* 变量（复制模板后改 .env，而不是改这里）；
// 未配置时回退到以下默认值。
export const SITE = {
  name: import.meta.env.VITE_SITE_NAME ?? "React TS 模板",
  description:
    import.meta.env.VITE_SITE_DESCRIPTION ??
    "自带文档站的 React + TypeScript 项目模板：MDX 编写文档、全文搜索、明暗主题，开箱即可部署到 GitHub Pages。",
  badge: import.meta.env.VITE_SITE_BADGE ?? "zhitips 内部前端模板",
  githubUrl:
    import.meta.env.VITE_GITHUB_URL ??
    "https://github.com/zhitips/react-ts-docs-template",
} as const
