import { Link, NavLink, Outlet } from "react-router"
import { cn } from "cn"
import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger"
import { SITE } from "@/lib/site"

const NAV_ITEMS = [
  { to: "/", label: "首页" },
  { to: "/users", label: "表格示例" },
  { to: "/docs", label: "文档" },
  { to: "/about", label: "关于" },
]

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link to="/" className="text-base font-semibold tracking-tight">
            {SITE.name}
          </Link>
          <div className="flex items-center">
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="ms-2 flex items-center gap-1.5 border-l border-border ps-2">
              <FullSearchTrigger hideIfDisabled className="hidden w-40 md:inline-flex" />
              <SearchTrigger hideIfDisabled className="md:hidden" />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
