import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// 独立测试配置：vitest.config.ts 存在时 Vitest 不读取 vite.config.ts，
// 因此需在此处重复 @ 别名与 react 插件
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
})
