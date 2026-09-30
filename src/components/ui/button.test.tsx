import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("渲染按钮文本", () => {
    render(<Button>保存</Button>)
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument()
  })

  it("点击触发 onClick", async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>保存</Button>)
    await userEvent.setup().click(screen.getByRole("button", { name: "保存" }))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
