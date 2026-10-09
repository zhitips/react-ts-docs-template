import { createBrowserRouter } from "react-router"
import { AppProviders } from "@/layouts/AppProviders"
import { RootLayout } from "@/layouts/RootLayout"
import { AboutPage } from "@/pages/AboutPage"
import { DocsPage } from "@/pages/DocsPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { UserDetailPage } from "@/pages/UserDetailPage"
import { UsersPage } from "@/pages/UsersPage"

export const router = createBrowserRouter([
  {
    element: <AppProviders />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <UsersPage /> },
          { path: "users/:userId", element: <UserDetailPage /> },
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
  // 跟随 vite base：dev "/"，GitHub Pages 构建 "/react-ts-template/"
  basename: import.meta.env.BASE_URL,
})
