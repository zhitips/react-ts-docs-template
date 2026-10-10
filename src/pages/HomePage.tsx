import { Link } from "react-router"
import { ArrowRight, Blocks, ExternalLink, Globe, Search, SunMoon, TextSearch } from "lucide-react"
import { useSearchContext } from "fumadocs-ui/contexts/search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDocCards } from "@/lib/doc-cards"
import { SITE } from "@/lib/site"
import { source } from "@/lib/source"

const FEATURES = [
  { icon: Blocks, title: "MDX 组件", description: "文档中使用 MDX 语法与 React 组件" },
  { icon: TextSearch, title: "全文搜索", description: "⌘K 唤起静态索引，浏览器本地检索" },
  { icon: SunMoon, title: "明暗主题", description: "亮色 / 暗色主题，跟随系统偏好" },
  { icon: Globe, title: "GitHub Pages 部署", description: "构建自动适配子路径静态部署" },
]

const CARD_CLASS =
  "flex flex-col gap-2 rounded-xl border border-border bg-card px-6 py-5 transition-colors hover:border-ring/50 hover:bg-muted/50"

export function HomePage() {
  const { setOpenSearch } = useSearchContext()
  // 文档卡片从页面树自动生成，新增文档无需改首页代码
  const cards = getDocCards(source.getPageTree())

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16">
      <section className="flex flex-col items-center gap-5 text-center">
        <Badge variant="outline">{SITE.badge}</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">{SITE.name}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {SITE.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link to="/docs" />}>
            开始阅读
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<a href={SITE.githubUrl} target="_blank" rel="noreferrer" />}
          >
            GitHub
            <ExternalLink data-icon="inline-end" />
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setOpenSearch(true)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="size-3.5" />
          搜索文档
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans text-xs">
            ⌘K
          </kbd>
        </button>
      </section>

      {cards.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">文档</h2>
            <Link
              to="/docs"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              查看全部
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const inner = (
                <>
                  <h3 className="text-sm font-medium">{card.title}</h3>
                  {card.description !== undefined && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  )}
                </>
              )
              return card.external ? (
                <a key={card.url} href={card.url} target="_blank" rel="noreferrer" className={CARD_CLASS}>
                  {inner}
                </a>
              ) : (
                <Link key={card.url} to={card.url} className={CARD_CLASS}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">特性</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3 rounded-xl border border-border bg-card px-6 py-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4" />
              </span>
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
