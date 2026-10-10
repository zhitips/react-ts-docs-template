import { flattenTree, type Item, type Root } from "fumadocs-core/page-tree"
import type { ReactNode } from "react"

// 与 src/lib/source.ts 的 baseUrl 保持一致
export const DOC_INDEX_URL = "/docs"

export type DocCard = {
  title: ReactNode
  description?: ReactNode
  url: string
  external: boolean
}

/**
 * 把页面树拍平为首页文档卡片列表。
 *
 * folder 的 index 项排在其子项之前（flattenTree 行为），分隔符被跳过；
 * 文档首页（/docs）不生成卡片，由 Hero 的「开始阅读」入口覆盖。
 */
export function getDocCards(tree: Root): DocCard[] {
  return flattenTree(tree.children)
    .filter((item: Item) => item.url !== DOC_INDEX_URL)
    .map((item) => ({
      title: item.name,
      description: item.description,
      url: item.url,
      external: item.external ?? item.url.startsWith("http"),
    }))
}
