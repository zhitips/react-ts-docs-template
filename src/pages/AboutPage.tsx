import { Badge } from "@/components/ui/badge"

const TECH_STACK = [
  "React 19",
  "React Router 8",
  "TypeScript",
  "Vite",
  "Tailwind CSS v4",
  "shadcn ui",
]

export function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">关于</h1>
        <p className="text-sm text-muted-foreground">
          zhitips 组织内部的 React + TypeScript 前端模板
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card px-6 py-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">模板说明</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            模板内置 React Router 数据模式路由、顶部导航布局，以及带搜索、排序、分页的表格示例页，
            可作为新项目的起步骨架。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">技术栈</h2>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
