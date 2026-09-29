export type UserStatus = "active" | "disabled"

export type UserRole = "admin" | "editor" | "viewer"

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "管理员",
  editor: "编辑",
  viewer: "查看者",
}

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "正常",
  disabled: "已禁用",
}

export const users: User[] = [
  { id: 1, name: "王伟", email: "wei.wang@example.com", role: "admin", status: "active", createdAt: "2024-03-12" },
  { id: 2, name: "李娜", email: "na.li@example.com", role: "editor", status: "active", createdAt: "2024-04-03" },
  { id: 3, name: "张敏", email: "min.zhang@example.com", role: "viewer", status: "disabled", createdAt: "2024-05-21" },
  { id: 4, name: "刘洋", email: "yang.liu@example.com", role: "admin", status: "active", createdAt: "2024-06-08" },
  { id: 5, name: "陈静", email: "jing.chen@example.com", role: "editor", status: "active", createdAt: "2024-07-15" },
  { id: 6, name: "杨帆", email: "fan.yang@example.com", role: "viewer", status: "active", createdAt: "2024-08-02" },
  { id: 7, name: "赵磊", email: "lei.zhao@example.com", role: "editor", status: "disabled", createdAt: "2024-08-28" },
  { id: 8, name: "黄丽", email: "li.huang@example.com", role: "viewer", status: "active", createdAt: "2024-09-19" },
  { id: 9, name: "周杰", email: "jie.zhou@example.com", role: "editor", status: "active", createdAt: "2024-10-25" },
  { id: 10, name: "吴悦", email: "yue.wu@example.com", role: "viewer", status: "active", createdAt: "2024-11-11" },
  { id: 11, name: "徐强", email: "qiang.xu@example.com", role: "admin", status: "active", createdAt: "2024-12-06" },
  { id: 12, name: "孙莹", email: "ying.sun@example.com", role: "editor", status: "active", createdAt: "2025-01-14" },
  { id: 13, name: "马丽", email: "li.ma@example.com", role: "viewer", status: "disabled", createdAt: "2025-02-20" },
  { id: 14, name: "朱军", email: "jun.zhu@example.com", role: "editor", status: "active", createdAt: "2025-03-07" },
  { id: 15, name: "胡明", email: "ming.hu@example.com", role: "viewer", status: "active", createdAt: "2025-03-29" },
  { id: 16, name: "郭艳", email: "yan.guo@example.com", role: "editor", status: "active", createdAt: "2025-04-18" },
  { id: 17, name: "何平", email: "ping.he@example.com", role: "viewer", status: "active", createdAt: "2025-05-09" },
  { id: 18, name: "高飞", email: "fei.gao@example.com", role: "viewer", status: "disabled", createdAt: "2025-05-30" },
  { id: 19, name: "林霞", email: "xia.lin@example.com", role: "editor", status: "active", createdAt: "2025-06-21" },
  { id: 20, name: "罗涛", email: "tao.luo@example.com", role: "viewer", status: "active", createdAt: "2025-07-12" },
  { id: 21, name: "郑洁", email: "jie.zheng@example.com", role: "editor", status: "active", createdAt: "2025-08-01" },
  { id: 22, name: "梁鑫", email: "xin.liang@example.com", role: "viewer", status: "active", createdAt: "2025-08-23" },
  { id: 23, name: "宋雨", email: "yu.song@example.com", role: "editor", status: "disabled", createdAt: "2025-09-10" },
  { id: 24, name: "唐悦", email: "yue.tang@example.com", role: "viewer", status: "active", createdAt: "2025-09-26" },
]
