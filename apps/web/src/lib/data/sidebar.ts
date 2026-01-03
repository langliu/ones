export type NavItemId = 'inbox' | 'my-tasks' | 'projects' | 'clients' | 'performance'

export type SidebarFooterItemId = 'settings' | 'templates' | 'help'

export type NavItem = {
  id: NavItemId
  label: string
  badge?: number
  isActive?: boolean
}

export type ActiveProjectSummary = {
  id: string
  name: string
  color: string
  progress: number
}

export type SidebarFooterItem = {
  id: SidebarFooterItemId
  label: string
}

export const navItems: NavItem[] = [
  { badge: 24, id: 'inbox', label: '收件箱' },
  { id: 'my-tasks', label: '我的任务' },
  { id: 'projects', isActive: true, label: '项目' },
  { id: 'clients', label: '客户' },
  { id: 'performance', label: '性能' },
]

export const activeProjects: ActiveProjectSummary[] = [
  { color: '#EF4444', id: 'ai-learning', name: 'AI 学习平台', progress: 25 },
  { color: '#F97316', id: 'fintech-app', name: 'Fintech 移动应用', progress: 80 },
  { color: '#22C55E', id: 'ecommerce-admin', name: '电商管理后台', progress: 65 },
  { color: '#94A3B8', id: 'healthcare-app', name: '医疗预约应用', progress: 10 },
]

export const footerItems: SidebarFooterItem[] = [
  { id: 'settings', label: '设置' },
  { id: 'templates', label: '模板' },
  { id: 'help', label: '帮助' },
]
