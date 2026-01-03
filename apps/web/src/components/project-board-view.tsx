'use client'

import {
  CheckCircle,
  CircleNotch,
  DotsThreeVertical,
  Plus,
  Spinner,
  StackSimple,
} from '@phosphor-icons/react/dist/ssr'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import type { Project } from '@/lib/data/projects'

function columnStatusIcon(status: Project['status']): React.JSX.Element {
  switch (status) {
    case 'backlog':
      return <StackSimple className='h-4 w-4 text-muted-foreground/60' />
    case 'planned':
      return <Spinner className='h-4 w-4 animate-spin text-muted-foreground/60' />
    case 'active':
      return <CircleNotch className='h-4 w-4 animate-spin text-primary' />
    case 'completed':
      return <CheckCircle className='h-4 w-4 text-emerald-500' />
    default:
      return <StackSimple className='h-4 w-4 text-muted-foreground' />
  }
}

type ProjectBoardViewProps = {
  projects: Project[]
  loading?: boolean
}

const COLUMN_ORDER: Array<Project['status']> = ['backlog', 'planned', 'active', 'completed']

function columnStatusLabel(status: Project['status']): string {
  switch (status) {
    case 'backlog':
      return '积压中'
    case 'planned':
      return '已计划'
    case 'active':
      return '进行中'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return status
  }
}

export function ProjectBoardView({ projects, loading = false }: ProjectBoardViewProps) {
  const [items, setItems] = useState<Project[]>(projects)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    setItems(projects)
  }, [projects])

  const groups = useMemo(() => {
    const m = new Map<Project['status'], Project[]>()
    for (const s of COLUMN_ORDER) m.set(s, [])
    for (const p of items) {
      const group = m.get(p.status)
      if (group) {
        group.push(p)
      }
    }
    return m
  }, [items])

  const onDropTo = (status: Project['status']) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/id')
    if (!id) return
    setDraggingId(null)
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const draggableCard = (p: Project) => (
    <li
      className={`transition-all ${
        draggingId === p.id
          ? 'scale-[0.95] cursor-grabbing opacity-50'
          : 'cursor-grab active:cursor-grabbing'
      }`}
      draggable
      key={p.id}
      onDragEnd={() => setDraggingId(null)}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/id', p.id)
        setDraggingId(p.id)
      }}
      onKeyDown={() => {
        // Accessibility for dragging could be complex, for now at least allow focus
      }}
    >
      <ProjectCard
        actions={
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  className='h-7 w-7 rounded-lg group-hover:bg-background/80'
                  size='icon'
                  type='button'
                  variant='ghost'
                >
                  <DotsThreeVertical className='h-4 w-4' />
                </Button>
              }
            />
            <PopoverContent align='end' className='w-40 p-2'>
              <div className='space-y-1'>
                {COLUMN_ORDER.map((s) => (
                  <button
                    className='w-full rounded-md px-2 py-1.5 text-left font-medium text-xs transition-colors hover:bg-accent'
                    key={s}
                    onClick={() =>
                      setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: s } : x)))
                    }
                    type='button'
                  >
                    移至 {columnStatusLabel(s)}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        }
        project={p}
        variant='board'
      />
    </li>
  )

  if (loading) {
    return (
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {COLUMN_ORDER.map((s) => (
            <div className='space-y-4 rounded-2xl bg-muted/40 p-4' key={s}>
              <Skeleton className='h-6 w-24' />
              <div className='space-y-4'>
                {Array.from({ length: 2 }).map((_, i) => {
                  const key = `skeleton-${s}-${i}`
                  return <Skeleton className='h-40 rounded-2xl' key={key} />
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const total = items.length
  if (total === 0) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-12 text-muted-foreground opacity-60'>
        <StackSimple className='mb-4 h-12 w-12' />
        <p className='font-medium text-sm'>暂无匹配项目</p>
      </div>
    )
  }

  return (
    <div className='flex-1 overflow-auto bg-muted/5 p-6'>
      <div className='flex h-full items-start gap-6'>
        {COLUMN_ORDER.map((status) => (
          <ul
            className='flex max-h-full w-80 shrink-0 flex-col'
            key={status}
            onDragOver={onDragOver}
            onDrop={onDropTo(status)}
          >
            <div className='sticky top-0 z-10 flex items-center justify-between bg-transparent px-3 py-4'>
              <div className='flex items-center gap-2.5'>
                {columnStatusIcon(status)}
                <span className='font-bold text-[13px] text-foreground/90 uppercase tracking-wide'>
                  {columnStatusLabel(status)}
                </span>
                <span className='rounded bg-muted px-1.5 py-0.5 font-bold text-[11px] text-muted-foreground/80 tabular-nums'>
                  {groups.get(status)?.length ?? 0}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Button
                  className='h-7 w-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
                  size='icon-sm'
                  type='button'
                  variant='ghost'
                >
                  <Plus className='h-3.5 w-3.5' />
                </Button>
                <Button
                  className='h-7 w-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
                  size='icon-sm'
                  type='button'
                  variant='ghost'
                >
                  <DotsThreeVertical className='h-3.5 w-3.5' />
                </Button>
              </div>
            </div>
            <div className='no-scrollbar min-h-[200px] flex-1 space-y-4 overflow-y-auto px-1 pb-12'>
              {(groups.get(status) ?? []).map(draggableCard)}
              <Button
                className='h-10 w-full rounded-2xl border border-border/60 border-dashed font-medium text-muted-foreground text-xs hover:border-border hover:bg-muted/50'
                size='sm'
                type='button'
                variant='ghost'
              >
                <Plus className='mr-2 h-3.5 w-3.5' />
                添加项目
              </Button>
            </div>
          </ul>
        ))}
      </div>
    </div>
  )
}
