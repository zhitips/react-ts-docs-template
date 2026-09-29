import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ROLE_LABELS, STATUS_LABELS, users } from "@/data/users"
import type { User } from "@/data/users"

type SortDirection = "asc" | "desc"

type UserSortField = "name" | "email" | "role" | "status" | "createdAt"

type UserSort = {
  field: UserSortField
  direction: SortDirection
}

const PAGE_SIZE = 8

function getUserFieldText(user: User, field: UserSortField): string {
  switch (field) {
    case "name":
      return user.name
    case "email":
      return user.email
    case "role":
      return ROLE_LABELS[user.role]
    case "status":
      return STATUS_LABELS[user.status]
    case "createdAt":
      return user.createdAt
  }
}

function compareUsers(a: User, b: User, sort: UserSort): number {
  const factor = sort.direction === "asc" ? 1 : -1
  return (
    factor *
    getUserFieldText(a, sort.field).localeCompare(getUserFieldText(b, sort.field), "zh")
  )
}

function matchesQuery(user: User, normalizedQuery: string): boolean {
  const haystack = [
    user.name,
    user.email,
    user.role,
    ROLE_LABELS[user.role],
    user.status,
    STATUS_LABELS[user.status],
    user.createdAt,
  ]
    .join(" ")
    .toLowerCase()
  return haystack.includes(normalizedQuery)
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === "asc") {
    return <ArrowUp className="size-3.5" />
  }
  if (direction === "desc") {
    return <ArrowDown className="size-3.5" />
  }
  return <ArrowUpDown className="size-3.5 text-muted-foreground" />
}

function SortableTableHead({
  label,
  field,
  sort,
  onSort,
}: {
  label: string
  field: UserSortField
  sort: UserSort | null
  onSort: (field: UserSortField) => void
}) {
  const isActive = sort !== null && sort.field === field
  return (
    <TableHead
      aria-sort={isActive ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 text-inherit hover:text-foreground"
        onClick={() => onSort(field)}
      >
        {label}
        <SortIcon direction={isActive ? sort.direction : null} />
      </button>
    </TableHead>
  )
}

export function UsersPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<UserSort | null>(null)
  const [pageIndex, setPageIndex] = useState(0)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredUsers = useMemo(
    () => users.filter((user) => matchesQuery(user, normalizedQuery)),
    [normalizedQuery],
  )

  const sortedUsers = useMemo(() => {
    if (sort === null) {
      return filteredUsers
    }
    return [...filteredUsers].sort((a, b) => compareUsers(a, b, sort))
  }, [filteredUsers, sort])

  const pageCount = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE))
  const currentPageIndex = Math.min(pageIndex, pageCount - 1)
  const pageUsers = useMemo(
    () =>
      sortedUsers.slice(currentPageIndex * PAGE_SIZE, (currentPageIndex + 1) * PAGE_SIZE),
    [sortedUsers, currentPageIndex],
  )

  function handleQueryChange(value: string) {
    setQuery(value)
    setPageIndex(0)
  }

  function handleSortClick(field: UserSortField) {
    if (sort === null || sort.field !== field) {
      setSort({ field, direction: "asc" })
      return
    }
    if (sort.direction === "asc") {
      setSort({ field, direction: "desc" })
      return
    }
    setSort(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">用户管理</h1>
        <p className="text-sm text-muted-foreground">
          客户端搜索、排序与分页，点击「查看」跳转详情
        </p>
      </header>

      <main className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">用户列表</h2>
          <div className="relative w-full max-w-80">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="搜索姓名、邮箱、角色、状态或创建时间"
              className="pl-8"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead label="姓名" field="name" sort={sort} onSort={handleSortClick} />
              <SortableTableHead label="邮箱" field="email" sort={sort} onSort={handleSortClick} />
              <SortableTableHead label="角色" field="role" sort={sort} onSort={handleSortClick} />
              <SortableTableHead label="状态" field="status" sort={sort} onSort={handleSortClick} />
              <SortableTableHead
                label="创建时间"
                field="createdAt"
                sort={sort}
                onSort={handleSortClick}
              />
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {normalizedQuery === "" ? "暂无数据" : `未找到匹配「${query.trim()}」的用户`}
                </TableCell>
              </TableRow>
            ) : (
              pageUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{ROLE_LABELS[user.role]}</TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <Badge>正常</Badge>
                    ) : (
                      <Badge variant="outline">已禁用</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            共 {sortedUsers.length} 条 · 第 {currentPageIndex + 1} / {pageCount} 页
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPageIndex === 0}
              onClick={() => setPageIndex(currentPageIndex - 1)}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPageIndex >= pageCount - 1}
              onClick={() => setPageIndex(currentPageIndex + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
