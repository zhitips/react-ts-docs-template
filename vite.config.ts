import { readdirSync, statSync } from "node:fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { createFromSource } from "fumadocs-core/search/server"
import { fumadocsMdx } from "fumadocs-mdx/vite"
import { defineConfig, type Plugin } from "vite"

// 递归取目录最新 mtime，作为 dev 索引缓存失效依据
function latestMtime(dir: string): number {
  let latest = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    latest = Math.max(
      latest,
      entry.isDirectory() ? latestMtime(full) : statSync(full).mtimeMs,
    )
  }
  return latest
}

// dev 下即时生成 /search-index.json，文档改动无需重启
function fumadocsSearchDevServer(): Plugin {
  const contentDir = path.resolve(__dirname, "content/docs")
  const sourceFile = path.resolve(__dirname, "src/lib/source.ts")
  let cached: { body: string; stamp: number } | undefined

  return {
    name: "fumadocs-static-search-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/search-index.json", async (_req, res) => {
        try {
          const stamp = Math.max(latestMtime(contentDir), statSync(sourceFile).mtimeMs)
          if (!cached || cached.stamp !== stamp) {
            const { source } = await server.ssrLoadModule("/src/lib/source.ts")
            const response = await createFromSource(source).staticGET()
            cached = { body: await response.text(), stamp }
          }
          res.setHeader("Content-Type", "application/json")
          res.end(cached.body)
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(error) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [fumadocsMdx(), react(), tailwindcss(), fumadocsSearchDevServer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
