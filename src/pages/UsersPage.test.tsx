import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"
import { users } from "@/data/users"
import { UsersPage } from "./UsersPage"

const PAGE_SIZE = 8
const pageCount = Math.ceil(users.length / PAGE_SIZE)

function renderUsersPage() {
  const router = createMemoryRouter([
    {
      path: "/",
      element: <UsersPage />,
    },
  ])
  return render(<RouterProvider router={router} />)
}

describe("UsersPage", () => {
  it("渲染用户表格与分页信息", () => {
    renderUsersPage()
    expect(screen.getByRole("columnheader", { name: /姓名/ })).toBeInTheDocument()
    expect(screen.getByText(`共 ${users.length} 条 · 第 1 / ${pageCount} 页`)).toBeInTheDocument()
    // 表头 1 行 + 当前页数据 8 行
    expect(screen.getAllByRole("row")).toHaveLength(PAGE_SIZE + 1)
  })

  it("搜索按姓名过滤", async () => {
    renderUsersPage()
    await userEvent.setup().type(
      screen.getByPlaceholderText("搜索姓名、邮箱、角色、状态或创建时间"),
      "陈",
    )
    expect(screen.getByText("陈静")).toBeInTheDocument()
    expect(screen.queryByText("王伟")).not.toBeInTheDocument()
    expect(screen.getByText("共 1 条 · 第 1 / 1 页")).toBeInTheDocument()
  })

  it("点击下一页切换分页", async () => {
    renderUsersPage()
    await userEvent.setup().click(screen.getByRole("button", { name: "下一页" }))
    expect(
      screen.getByText(`共 ${users.length} 条 · 第 2 / ${pageCount} 页`),
    ).toBeInTheDocument()
  })
})
