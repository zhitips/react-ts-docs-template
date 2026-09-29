import { Link, useParams } from "react-router"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ROLE_LABELS, STATUS_LABELS, users } from "@/data/users"
import type { User } from "@/data/users"

const DETAIL_ITEMS = [
  { key: "id", label: "ID" },
  { key: "email", label: "邮箱" },
  { key: "role", label: "角色" },
  { key: "createdAt", label: "创建时间" },
] as const

function getDetailText(user: User, key: (typeof DETAIL_ITEMS)[number]["key"]): string {
  switch (key) {
    case "id":
      return String(user.id)
    case "email":
      return user.email
    case "role":
      return ROLE_LABELS[user.role]
    case "createdAt":
      return user.createdAt
  }
}

export function UserDetailPage() {
  const { userId } = useParams()
  const user = users.find((item) => item.id === Number(userId))

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        返回列表
      </Link>

      {user === undefined ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-16 text-center">
          <p className="text-lg font-medium">用户不存在</p>
          <p className="text-sm text-muted-foreground">
            未找到 ID 为「{userId}」的用户，请从列表重新进入
          </p>
        </div>
      ) : (
        <section className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
            {user.status === "active" ? (
              <Badge>{STATUS_LABELS.active}</Badge>
            ) : (
              <Badge variant="outline">{STATUS_LABELS.disabled}</Badge>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 px-6 py-5 sm:grid-cols-4">
            {DETAIL_ITEMS.map((item) => (
              <div key={item.key} className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="text-sm font-medium break-all">
                  {getDetailText(user, item.key)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
