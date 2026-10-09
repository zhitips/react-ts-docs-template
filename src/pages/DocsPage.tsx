import { use } from "react"
import { useParams } from "react-router"
import { DocsLayout } from "fumadocs-ui/layouts/notebook"
import {
  DocsBody,
  DocsDescription,
  DocsPage as FumadocsDocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/notebook/page"
import { getMDXComponents } from "@/components/mdx"
import { docs, source } from "@/lib/source"

function DocsContent({ path }: { path: string }) {
  const page = docs.getPage(path)
  if (!page) throw new Error(`未知文档: ${path}`)

  // 文档内容按需加载（async 分包）
  const { toc } = use(page.load())
  const Mdx = page.body

  return (
    <FumadocsDocsPage toc={toc} tableOfContent={{ 
      single: true,
      style: 'block'
    }}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <Mdx components={getMDXComponents()} />
      </DocsBody>
    </FumadocsDocsPage>
  )
}

export function DocsPage() {
  const params = useParams()
  const slugs = (params["*"] ?? "").split("/").filter(Boolean)
  const page = source.getPage(slugs)
  if (!page) throw new Response(null, { status: 404 })

  return (
    <DocsLayout tree={source.getPageTree()} nav={{ title: "React TS 模板" }}>
      <DocsContent path={page.path} />
    </DocsLayout>
  )
}
