import { Blocks, ExternalLink, Globe, SunMoon, TextSearch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/site"

const TECH_STACK = [
  "React 19",
  "React Router 8",
  "TypeScript",
  "Vite",
  "fumadocs",
  "Tailwind CSS v4",
  "shadcn ui",
]

const FEATURES = [
  {
    icon: Blocks,
    title: "MDX 组件化文档",
    description: "Shiki 代码高亮、内置 Callout / Card 等组件，在 content/docs 加文件即生效",
  },
  {
    icon: TextSearch,
    title: "全文搜索",
    description: "⌘K 唤起，构建期生成静态索引，浏览器本地检索，无需后端服务",
  },
  {
    icon: SunMoon,
    title: "明暗主题",
    description: "跟随系统偏好，顶栏一键切换，全站统一生效",
  },
  {
    icon: Globe,
    title: "GitHub Pages 部署",
    description: "构建自动适配子路径静态部署，附 GitHub Actions 工作流",
  },
]

const DEPLOY_STEPS = [
  "把 .env.production 中的 VITE_BASE_PATH 改为 /<你的仓库名>/（vite base 按环境从 .env.development / .env.production 读取）",
  "仓库 Settings → Pages → Source 选 GitHub Actions（一次性）",
  "Actions 页手动触发 Deploy to GitHub Pages 工作流",
]

const CARD_CLASS = "flex flex-col gap-4 rounded-xl border border-border bg-card px-6 py-5"

export function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">关于本模板</h1>
        <p className="text-sm text-muted-foreground">{SITE.description}</p>
      </header>

      <section className={CARD_CLASS}>
        <h2 className="text-sm font-medium">模板定位</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          为 React 技术栈打造的文档站起步骨架：内置路由、布局、搜索与主题体系，
          复制后只需替换文档内容与品牌配置，即可得到一个可部署的文档站。
          适合个人项目文档、开源仓库文档与团队内部文档，
          尤其适合希望用 MDX 与 React 组件编写文档的团队。
        </p>
      </section>

      <section className={CARD_CLASS}>
        <h2 className="text-sm font-medium">特性</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4 text-muted-foreground" />
                {title}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={CARD_CLASS}>
        <h2 className="text-sm font-medium">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <section className={CARD_CLASS}>
        <h2 className="text-sm font-medium">快速开始</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            render={
              <a href={`${SITE.githubUrl}/generate`} target="_blank" rel="noreferrer" />
            }
          >
            Use this template
            <ExternalLink data-icon="inline-end" />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href={SITE.githubUrl} target="_blank" rel="noreferrer" />}
          >
            查看源码
            <ExternalLink data-icon="inline-end" />
          </Button>
        </div>
        <ol className="flex flex-col gap-2">
          {DEPLOY_STEPS.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="text-sm leading-relaxed text-muted-foreground">
          绑定自定义域名（根路径部署）时，把 VITE_BASE_PATH 改为 / 即可。
          站点品牌信息（名称、描述、GitHub 地址）统一在 .env 的 VITE_SITE_NAME /
          VITE_SITE_DESCRIPTION / VITE_GITHUB_URL 配置，改一处即全站生效。
        </p>
      </section>
    </div>
  )
}
