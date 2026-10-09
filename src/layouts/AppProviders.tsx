import { Outlet } from "react-router"
import { RootProvider } from "fumadocs-ui/provider/react-router"

export function AppProviders() {
  return (
    // SPA 模式无 /api/search 服务端，暂不启用文档搜索
    <RootProvider search={{ enabled: false }}>
      <Outlet />
    </RootProvider>
  )
}
