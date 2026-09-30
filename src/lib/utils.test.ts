import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("合并多个类名", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center")
  })

  it("过滤假值", () => {
    expect(cn("flex", false, undefined, null, "items-center")).toBe("flex items-center")
  })
})
