import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="text-7xl font-bold tracking-tight text-muted-foreground">404</p>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">页面不存在</h1>
        <p className="text-sm text-muted-foreground">请检查地址是否正确</p>
      </div>
      <Button variant="outline" onClick={() => navigate("/")}>
        返回首页
      </Button>
    </div>
  )
}
