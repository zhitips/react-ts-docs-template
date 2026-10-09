import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fumadocsMdx } from "fumadocs-mdx/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [fumadocsMdx(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
