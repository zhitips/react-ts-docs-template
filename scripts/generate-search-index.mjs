// 生成 fumadocs 静态搜索索引（ZBSearch），供浏览器端本地搜索使用
// 用法：node scripts/generate-search-index.mjs（pnpm gen:search）
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { register } from "fumadocs-mdx/node"

// 注册 fumadocs-mdx 的 Node 加载器后，才能导入含宏的 src/lib/source.ts
register()

const { createFromSource } = await import("fumadocs-core/search/server")
const { source } = await import("../src/lib/source.ts")

const response = await createFromSource(source).staticGET()
const json = await response.text()

const outPath = path.resolve(import.meta.dirname, "../public/search-index.json")
await mkdir(path.dirname(outPath), { recursive: true })
await writeFile(outPath, json)

console.log(`搜索索引已生成: public/search-index.json (${(json.length / 1024).toFixed(1)} kB)`)
