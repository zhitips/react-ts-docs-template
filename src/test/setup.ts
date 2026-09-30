import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"

// 显式 import 风格（globals: false）下 RTL 不会自动清理 DOM，需手动注册
afterEach(cleanup)
