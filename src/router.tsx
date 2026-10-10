import { createBrowserRouter } from "react-router"
import { AppProviders } from "@/layouts/AppProviders"
import { RootLayout } from "@/layouts/RootLayout"
import { AboutPage } from "@/pages/AboutPage"
import { DocsPage } from "@/pages/DocsPage"
import { HomePage } from "@/pages/HomePage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    element: <AppProviders />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "about", element: <AboutPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "/docs/*",
        element: <DocsPage />,
        errorElement: <NotFoundPage />,
      },
    ],
  },
], {
  // 跟随 vite base：dev "/"，生产由 .env.production 的 VITE_BASE_PATH 配置
  basename: import.meta.env.BASE_URL,
})
