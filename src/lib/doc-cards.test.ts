import { describe, expect, it } from "vitest"
import type { Root } from "fumadocs-core/page-tree"
import { getDocCards } from "./doc-cards"

// 手写页面树：索引页 + 普通页 + 分隔符 + 含 index/子页/外链的 folder
const tree: Root = {
  name: "React TS 模板",
  children: [
    { type: "page", name: "简介", url: "/docs" },
    { type: "separator", name: "分隔" },
    { type: "page", name: "新增文档", url: "/docs/getting-started", description: "如何新增一篇文档" },
    {
      type: "folder",
      name: "进阶",
      index: { type: "page", name: "进阶总览", url: "/docs/advanced" },
      children: [
        { type: "page", name: "配置", url: "/docs/advanced/config" },
        { type: "page", name: "示例站", url: "https://example.com", external: true },
      ],
    },
  ],
}

describe("getDocCards", () => {
  it("排除文档首页（/docs），保留其余页面", () => {
    const urls = getDocCards(tree).map((card) => card.url)
    expect(urls).not.toContain("/docs")
    expect(urls).toContain("/docs/getting-started")
  })

  it("跳过分隔符，folder 的 index 项排在其子项之前", () => {
    expect(getDocCards(tree).map((card) => card.url)).toEqual([
      "/docs/getting-started",
      "/docs/advanced",
      "/docs/advanced/config",
      "https://example.com",
    ])
  })

  it("保留标题与描述，按 url 推断外链", () => {
    const cards = getDocCards(tree)
    const started = cards.find((card) => card.url === "/docs/getting-started")
    expect(started?.title).toBe("新增文档")
    expect(started?.description).toBe("如何新增一篇文档")
    expect(started?.external).toBe(false)

    const external = cards.find((card) => card.url === "https://example.com")
    expect(external?.external).toBe(true)
  })
})
