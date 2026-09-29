import { createBrowserRouter } from "react-router"
import { RootLayout } from "@/layouts/root-layout"
import { AboutPage } from "@/pages/about-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { UserDetailPage } from "@/pages/user-detail-page"
import { UsersPage } from "@/pages/users-page"

export const router = createBrowserRouter([
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
])
