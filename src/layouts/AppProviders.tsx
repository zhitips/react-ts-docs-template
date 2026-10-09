import { Outlet } from "react-router"
import { RootProvider } from "fumadocs-ui/provider/react-router"
import { StaticSearchDialog } from "@/components/StaticSearchDialog"

export function AppProviders() {
  return (
    // 静态搜索：索引由 scripts/generate-search-index.mjs（构建）与
    // vite 中间件（dev）生成于 /search-index.json，浏览器端本地查询
    <RootProvider search={{ SearchDialog: StaticSearchDialog }}>
      <Outlet />
    </RootProvider>
  )
}
