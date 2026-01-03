export type Project = {
  id: string
  name: string
  taskCount: number
  progress: number
  startDate: Date
  endDate: Date
  status: 'backlog' | 'planned' | 'active' | 'cancelled' | 'completed'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  tags: string[]
  members: string[]
  client?: string
  typeLabel?: string
  durationLabel?: string
  tasks: Array<{
    id: string
    name: string
    assignee: string
    status: 'todo' | 'in-progress' | 'done'
    startDate: Date
    endDate: Date
  }>
}

// 固定参考日期，保持演示时间线稳定
const _today = new Date(2024, 0, 23) // 2024年1月23日
const _base = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate() - 7)
const _d = (offsetDays: number) =>
  new Date(_base.getFullYear(), _base.getMonth(), _base.getDate() + offsetDays)

export const projects: Project[] = [
  {
    client: 'Acme Bank',
    durationLabel: '2周',
    endDate: _d(27),
    id: '1',
    members: ['张三'],
    name: 'Fintech Mobile App Redesign',
    priority: 'high',
    progress: 35,
    startDate: _d(3),
    status: 'active',
    tags: ['frontend', 'feature'],
    taskCount: 4,
    tasks: [
      {
        assignee: 'ZS',
        endDate: _d(10),
        id: '1-1',
        name: '需求调研 & 信息架构',
        startDate: _d(3),
        status: 'done',
      },
      {
        assignee: 'ZS',
        endDate: _d(12),
        id: '1-2',
        name: '线框图设计',
        startDate: _d(7),
        status: 'in-progress',
      },
      {
        assignee: 'LS',
        endDate: _d(19),
        id: '1-3',
        name: 'UI套件 & 视觉设计',
        startDate: _d(13),
        status: 'todo',
      },
      {
        assignee: 'LS',
        endDate: _d(27),
        id: '1-4',
        name: '原型制作 & 交付',
        startDate: _d(20),
        status: 'todo',
      },
    ],
    typeLabel: 'MVP',
  },
  {
    client: 'Acme Corp 内部',
    durationLabel: '2周',
    endDate: _d(24),
    id: '2',
    members: ['张三'],
    name: '内部项目管理系统',
    priority: 'medium',
    progress: 20,
    startDate: _d(3),
    status: 'active',
    tags: ['backend'],
    taskCount: 6,
    tasks: [
      {
        assignee: 'PM',
        endDate: _d(5),
        id: '2-1',
        name: '定义 MVP 范围',
        startDate: _d(3),
        status: 'done',
      },
      {
        assignee: 'BE',
        endDate: _d(10),
        id: '2-2',
        name: '数据库架构设计',
        startDate: _d(6),
        status: 'in-progress',
      },
      {
        assignee: 'BE',
        endDate: _d(15),
        id: '2-3',
        name: 'API 端点开发',
        startDate: _d(11),
        status: 'todo',
      },
      {
        assignee: 'BE',
        endDate: _d(18),
        id: '2-4',
        name: '角色 & 权限系统',
        startDate: _d(16),
        status: 'todo',
      },
      {
        assignee: 'FE',
        endDate: _d(21),
        id: '2-5',
        name: 'UI 界面实现',
        startDate: _d(19),
        status: 'todo',
      },
      {
        assignee: 'QA',
        endDate: _d(24),
        id: '2-6',
        name: 'QA & 上线',
        startDate: _d(22),
        status: 'todo',
      },
    ],
    typeLabel: '改进',
  },
  {
    client: 'Acme Learning',
    durationLabel: '3周',
    endDate: _d(28),
    id: '3',
    members: ['张三'],
    name: 'AI 学习平台',
    priority: 'urgent',
    progress: 40,
    startDate: _d(14),
    status: 'active',
    tags: ['feature', 'urgent'],
    taskCount: 3,
    tasks: [
      {
        assignee: 'ZS',
        endDate: _d(16),
        id: '3-1',
        name: '课程大纲设计',
        startDate: _d(14),
        status: 'done',
      },
      {
        assignee: 'LS',
        endDate: _d(23),
        id: '3-2',
        name: '课程播放器 UI',
        startDate: _d(17),
        status: 'in-progress',
      },
      {
        assignee: 'BE',
        endDate: _d(28),
        id: '3-3',
        name: '支付集成',
        startDate: _d(24),
        status: 'todo',
      },
    ],
    typeLabel: '改版',
  },
  {
    client: 'Acme Corp 内部',
    durationLabel: '—',
    endDate: _d(35),
    id: '4',
    members: [],
    name: '内部 CRM 系统',
    priority: 'low',
    progress: 0,
    startDate: _d(18),
    status: 'backlog',
    tags: ['bug'],
    taskCount: 4,
    tasks: [
      {
        assignee: 'PM',
        endDate: _d(21),
        id: '4-1',
        name: '需求收集',
        startDate: _d(18),
        status: 'todo',
      },
      {
        assignee: 'BE',
        endDate: _d(25),
        id: '4-2',
        name: '数据模型设计',
        startDate: _d(22),
        status: 'todo',
      },
      {
        assignee: 'FE',
        endDate: _d(31),
        id: '4-3',
        name: '核心界面开发',
        startDate: _d(26),
        status: 'todo',
      },
      {
        assignee: 'QA',
        endDate: _d(35),
        id: '4-4',
        name: 'QA & UAT',
        startDate: _d(32),
        status: 'todo',
      },
    ],
    typeLabel: '新建',
  },
  {
    client: 'Acme Retail',
    durationLabel: '1周',
    endDate: _d(0),
    id: '5',
    members: ['张三'],
    name: '电商网站',
    priority: 'medium',
    progress: 100,
    startDate: _d(-7),
    status: 'completed',
    tags: ['frontend'],
    taskCount: 5,
    tasks: [
      {
        assignee: 'ZS',
        endDate: _d(-5),
        id: '5-1',
        name: '信息架构 & 站点地图',
        startDate: _d(-7),
        status: 'done',
      },
      {
        assignee: 'LS',
        endDate: _d(-3),
        id: '5-2',
        name: '商品列表 UI',
        startDate: _d(-5),
        status: 'done',
      },
      {
        assignee: 'LS',
        endDate: _d(-1),
        id: '5-3',
        name: '购物车 & 结算流程',
        startDate: _d(-3),
        status: 'done',
      },
      {
        assignee: 'BE',
        endDate: _d(0),
        id: '5-4',
        name: '支付网关',
        startDate: _d(-1),
        status: 'done',
      },
      {
        assignee: 'QA',
        endDate: _d(0),
        id: '5-5',
        name: '上线检查清单',
        startDate: _d(-2),
        status: 'done',
      },
    ],
    typeLabel: '审核',
  },
  {
    client: 'Acme Marketing',
    durationLabel: '2周',
    endDate: _d(18),
    id: '6',
    members: ['张三'],
    name: '营销网站改版',
    priority: 'medium',
    progress: 10,
    startDate: _d(5),
    status: 'planned',
    tags: ['frontend', 'feature'],
    taskCount: 3,
    tasks: [
      {
        assignee: 'ZS',
        endDate: _d(9),
        id: '6-1',
        name: '落地页布局',
        startDate: _d(5),
        status: 'todo',
      },
      {
        assignee: 'LS',
        endDate: _d(14),
        id: '6-2',
        name: '英雄插图设计',
        startDate: _d(10),
        status: 'todo',
      },
      {
        assignee: 'QA',
        endDate: _d(18),
        id: '6-3',
        name: '内容审核',
        startDate: _d(15),
        status: 'todo',
      },
    ],
    typeLabel: '阶段1',
  },
  {
    client: 'Acme Corp 内部',
    durationLabel: '1周',
    endDate: _d(20),
    id: '7',
    members: ['张三'],
    name: '设计系统优化',
    priority: 'low',
    progress: 0,
    startDate: _d(8),
    status: 'planned',
    tags: ['backend'],
    taskCount: 4,
    tasks: [
      {
        assignee: 'ZS',
        endDate: _d(10),
        id: '7-1',
        name: 'Token 审计',
        startDate: _d(8),
        status: 'todo',
      },
      {
        assignee: 'ZS',
        endDate: _d(13),
        id: '7-2',
        name: '组件清单',
        startDate: _d(11),
        status: 'todo',
      },
      {
        assignee: 'PM',
        endDate: _d(17),
        id: '7-3',
        name: '废弃计划',
        startDate: _d(14),
        status: 'todo',
      },
      {
        assignee: 'ZS',
        endDate: _d(20),
        id: '7-4',
        name: '文档更新',
        startDate: _d(18),
        status: 'todo',
      },
    ],
    typeLabel: '重构',
  },
  {
    client: 'Acme SaaS',
    durationLabel: '1周',
    endDate: _d(-3),
    id: '8',
    members: ['张三'],
    name: '引导流程 A/B 测试',
    priority: 'high',
    progress: 100,
    startDate: _d(-10),
    status: 'completed',
    tags: ['feature', 'urgent'],
    taskCount: 3,
    tasks: [
      {
        assignee: 'PM',
        endDate: _d(-8),
        id: '8-1',
        name: '假设 & 指标设定',
        startDate: _d(-10),
        status: 'done',
      },
      {
        assignee: 'ZS',
        endDate: _d(-5),
        id: '8-2',
        name: '变体设计',
        startDate: _d(-8),
        status: 'done',
      },
      {
        assignee: 'PM',
        endDate: _d(-3),
        id: '8-3',
        name: '分析 & 学习',
        startDate: _d(-5),
        status: 'done',
      },
    ],
    typeLabel: '实验',
  },
]

export type FilterCounts = {
  status: Record<string, number>
  priority: Record<string, number>
  tags: Record<string, number>
  members: Record<string, number>
}

export function computeFilterCounts(list: Project[]): FilterCounts {
  const res: FilterCounts = {
    members: {},
    priority: {},
    status: {},
    tags: {},
  }

  for (const p of list) {
    // status
    res.status[p.status] = (res.status[p.status] || 0) + 1
    // priority
    res.priority[p.priority] = (res.priority[p.priority] || 0) + 1
    // tags
    for (const t of p.tags) {
      const id = t.toLowerCase()
      res.tags[id] = (res.tags[id] || 0) + 1
    }
    // members buckets
    if (p.members.length === 0) {
      res.members['no-member'] = (res.members['no-member'] || 0) + 1
    }
    if (p.members.length > 0) {
      res.members.current = (res.members.current || 0) + 1
    }
    if (p.members.some((m) => m.toLowerCase() === '张三')) {
      res.members.zhangsan = (res.members.zhangsan || 0) + 1
    }
  }

  return res
}
