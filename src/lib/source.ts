import { loader } from "fumadocs-core/source"
import { defineDocs } from "fumadocs-mdx/macro"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // 文档内容按需加载，避免打进主 chunk
    async: true,
  },
})

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: "/docs",
})
