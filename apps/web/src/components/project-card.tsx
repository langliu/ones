'use client'

import { CalendarBlank, Folder, User } from '@phosphor-icons/react/dist/ssr'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { PriorityBadge } from '@/components/priority-badge'
import { ProjectProgress } from '@/components/project-progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Project } from '@/lib/data/projects'
import { cn } from '@/lib/utils'

type ProjectCardProps = {
  project: Project
  actions?: React.ReactNode
  variant?: 'list' | 'board'
}

function statusConfig(status: Project['status']) {
  switch (status) {
    case 'active':
      return {
        dot: 'bg-teal-600',
        label: '进行中',
        pill: 'text-teal-700 border-teal-200 bg-teal-50',
      }
    case 'planned':
      return {
        dot: 'bg-zinc-900',
        label: '已计划',
        pill: 'text-zinc-900 border-zinc-202 bg-zinc-50',
      }
    case 'backlog':
      return {
        dot: 'bg-orange-600',
        label: '积压中',
        pill: 'text-orange-700 border-orange-200 bg-orange-50',
      }
    case 'completed':
      return {
        dot: 'bg-blue-600',
        label: '已完成',
        pill: 'text-blue-700 border-blue-200 bg-blue-50',
      }
    case 'cancelled':
      return {
        dot: 'bg-rose-600',
        label: '已取消',
        pill: 'text-rose-700 border-rose-200 bg-rose-50',
      }
    default:
      return { dot: 'bg-zinc-400', label: status, pill: 'text-zinc-700 border-zinc-200 bg-zinc-50' }
  }
}

export function ProjectCard({ project, actions, variant = 'list' }: ProjectCardProps) {
  const s = statusConfig(project.status)
  const assignee = project.members?.[0]
  const dueDate = project.endDate
  const isBoard = variant === 'board'

  const initials = assignee
    ? assignee
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : null

  const secondaryLine = (() => {
    const a = project.client
    const b = project.typeLabel
    const c = project.durationLabel
    if (a || b || c) {
      return [a, b, c].filter(Boolean).join(' • ')
    }
    if (project.tags && project.tags.length > 0) {
      return project.tags.join(' • ')
    }
    return ''
  })()

  const dueLabel = (() => {
    if (!dueDate) return '无截止日期'
    return format(dueDate, 'M月 d日', { locale: zhCN })
  })()

  return (
    <div className='group cursor-pointer rounded-2xl border border-border bg-background transition-all hover:shadow-lg/5'>
      <div className='p-4'>
        <div className='flex items-center justify-between'>
          {isBoard ? (
            <div className='flex items-center gap-1.5 font-medium text-muted-foreground text-xs'>
              <CalendarBlank className='h-3.5 w-3.5' />
              <span>{dueLabel}</span>
            </div>
          ) : (
            <div className='text-muted-foreground/60'>
              <Folder className='h-5 w-5' />
            </div>
          )}
          <div className='flex items-center gap-2'>
            {!isBoard && (
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider',
                  s.pill,
                )}
              >
                <span className={cn('inline-block size-1 animate-pulse rounded-full', s.dot)} />
                {s.label}
              </div>
            )}
            {isBoard && <PriorityBadge appearance='inline' level={project.priority} size='sm' />}
            {actions ? <div className='shrink-0'>{actions}</div> : null}
          </div>
        </div>

        <div className='mt-3'>
          <p className='font-bold text-[15px] text-foreground leading-snug transition-colors group-hover:text-primary'>
            {project.name}
          </p>
          <div className='mt-1 truncate font-medium text-muted-foreground/70 text-xs'>
            {secondaryLine}
          </div>
        </div>

        {!isBoard && (
          <div className='mt-4 flex items-center justify-between font-medium text-muted-foreground/80 text-xs'>
            <div className='flex items-center gap-1.5'>
              <CalendarBlank className='h-3.5 w-3.5' />
              <span>{dueDate ? format(dueDate, 'yyyy年 M月 d日', { locale: zhCN }) : '—'}</span>
            </div>
            <PriorityBadge appearance='inline' level={project.priority} size='sm' />
          </div>
        )}

        <div className='mt-4 border-border/40 border-t' />

        <div className='mt-3 flex items-center justify-between'>
          <ProjectProgress project={project} size={isBoard ? 20 : 18} />
          <Avatar className='size-6 border border-border shadow-sm'>
            <AvatarFallback className='bg-muted font-bold text-[10px]'>
              {initials ? initials : <User className='h-3.5 w-3.5 text-muted-foreground' />}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
