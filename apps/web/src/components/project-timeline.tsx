'use client'

import {
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from '@phosphor-icons/react/dist/ssr'
import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PriorityGlyphIcon } from '@/components/priority-badge'
import { DraggableBar } from '@/components/project-timeline-draggable-bar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { projects as initialProjects, type Project } from '@/lib/data/projects'
import { cn } from '@/lib/utils'

// Fixed "today" so the demo stays visually consistent over time.
const FIXED_TODAY = new Date(2024, 0, 23)

interface ProjectTimelineProps {
  projects?: Project[]
}

export function ProjectTimeline({ projects: propProjects }: ProjectTimelineProps) {
  const [projects, setProjects] = useState(propProjects || initialProjects)

  useEffect(() => {
    if (propProjects) {
      setProjects(propProjects)
    }
  }, [propProjects])

  const [expandedProjects, setExpandedProjects] = useState<string[]>(projects.map((p) => p.id))
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month' | 'Quarter'>('Week')
  const [zoom, setZoom] = useState(1)
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean
    type: 'project' | 'task' | null
    projectId: string | null
    taskId: string | null
  }>({ isOpen: false, projectId: null, taskId: null, type: null })
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')

  const [viewStartDate, setViewStartDate] = useState(() =>
    startOfWeek(addWeeks(FIXED_TODAY, -1), { weekStartsOn: 1 }),
  )
  const timelineRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollToTodayRef = useRef(true)
  const [todayOffsetDays, setTodayOffsetDays] = useState<number | null>(null)
  const nameColWidth = 280

  const viewModes = useMemo(() => ['Day', 'Week', 'Month', 'Quarter'] as const, [])

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const goToToday = () => {
    shouldAutoScrollToTodayRef.current = true
    setViewStartDate(startOfWeek(addWeeks(FIXED_TODAY, -1), { weekStartsOn: 1 }))
  }

  const navigateTime = (direction: 'prev' | 'next') => {
    const step = direction === 'next' ? 1 : -1
    const weeksStep = viewMode === 'Quarter' ? 12 : viewMode === 'Month' ? 4 : 1
    setViewStartDate((d) => (step === 1 ? addWeeks(d, weeksStep) : subWeeks(d, weeksStep)))
  }

  const getDates = React.useCallback((): Date[] => {
    const daysToRender =
      viewMode === 'Day' ? 21 : viewMode === 'Week' ? 60 : viewMode === 'Month' ? 90 : 120
    return Array.from({ length: daysToRender }).map((_, i) => addDays(viewStartDate, i))
  }, [viewMode, viewStartDate])

  const dates = useMemo(() => getDates(), [getDates])

  const baseCellWidth =
    viewMode === 'Day' ? 140 : viewMode === 'Week' ? 60 : viewMode === 'Month' ? 40 : 20
  const cellWidth = baseCellWidth * zoom
  const timelineWidth = dates.length * cellWidth

  useEffect(() => {
    const diff = differenceInCalendarDays(FIXED_TODAY, viewStartDate)
    if (diff >= 0 && diff < dates.length) {
      setTodayOffsetDays(diff)
    } else {
      setTodayOffsetDays(null)
    }
  }, [viewStartDate, dates.length])

  const handleUpdateTask = (projectId: string, taskId: string, newStart: Date) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          tasks: p.tasks.map((t) => {
            if (t.id !== taskId) return t
            const duration = differenceInCalendarDays(t.endDate, t.startDate)
            return {
              ...t,
              endDate: addDays(newStart, duration),
              startDate: newStart,
            }
          }),
        }
      }),
    )
  }

  const handleUpdateTaskDuration = (
    projectId: string,
    taskId: string,
    newStart: Date,
    newEnd: Date,
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          tasks: p.tasks.map((t) => {
            if (t.id !== taskId) return t
            return { ...t, endDate: newEnd, startDate: newStart }
          }),
        }
      }),
    )
  }

  const handleUpdateProject = (projectId: string, newStart: Date) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        const duration = differenceInCalendarDays(p.endDate, p.startDate)
        return {
          ...p,
          endDate: addDays(newStart, duration),
          startDate: newStart,
        }
      }),
    )
  }

  const handleUpdateProjectDuration = (projectId: string, newStart: Date, newEnd: Date) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return { ...p, endDate: newEnd, startDate: newStart }
      }),
    )
  }

  const handleDoubleClick = (
    type: 'project' | 'task',
    projectId: string,
    taskId: string | null = null,
  ) => {
    const item =
      type === 'project'
        ? projects.find((p) => p.id === projectId)
        : projects.find((p) => p.id === projectId)?.tasks.find((t) => t.id === taskId)

    if (item) {
      setEditDialog({ isOpen: true, projectId, taskId, type })
      setEditStartDate(format(item.startDate, 'yyyy-MM-dd'))
      setEditEndDate(format(item.endDate, 'yyyy-MM-dd'))
    }
  }

  const handleSaveEdit = () => {
    const { type, projectId, taskId } = editDialog
    const newStart = new Date(editStartDate)
    const newEnd = new Date(editEndDate)

    if (Number.isNaN(newStart.getTime()) || Number.isNaN(newEnd.getTime())) return

    if (type === 'project' && projectId) {
      handleUpdateProjectDuration(projectId, newStart, newEnd)
    } else if (type === 'task' && projectId && taskId) {
      handleUpdateTaskDuration(projectId, taskId, newStart, newEnd)
    }

    setEditDialog({ isOpen: false, projectId: null, taskId: null, type: null })
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-hidden border-border/50 border-t bg-background'>
      {/* Timeline Controls */}
      <div className='flex h-14 shrink-0 items-center justify-between border-border/50 border-b px-4'>
        <div className='flex items-center gap-2'>
          <Button className='h-8 font-medium' onClick={goToToday} size='sm' variant='outline'>
            今天
          </Button>
          <div className='ml-1 flex items-center overflow-hidden rounded-md border shadow-sm'>
            <Button
              className='h-8 w-8 rounded-none border-r'
              onClick={() => navigateTime('prev')}
              size='icon-sm'
              variant='ghost'
            >
              <CaretLeft className='h-4 w-4' />
            </Button>
            <Button
              className='h-8 w-8 rounded-none'
              onClick={() => navigateTime('next')}
              size='icon-sm'
              variant='ghost'
            >
              <CaretRight className='h-4 w-4' />
            </Button>
          </div>
          <span className='ml-2 min-w-[120px] font-semibold text-sm'>
            {format(viewStartDate, 'yyyy年 M月', { locale: zhCN })}
          </span>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1.5 rounded-md border bg-muted/30 p-0.5'>
            {viewModes.map((mode) => (
              <Button
                className={cn(
                  'h-7 px-3 font-medium text-xs transition-all',
                  viewMode === mode
                    ? 'bg-background shadow-sm hover:bg-background'
                    : 'hover:bg-muted/50',
                )}
                key={mode}
                onClick={() => setViewMode(mode)}
                size='sm'
                variant={viewMode === mode ? 'secondary' : 'ghost'}
              >
                {mode === 'Day' ? '日' : mode === 'Week' ? '周' : mode === 'Month' ? '月' : '季'}
              </Button>
            ))}
          </div>

          <div className='flex items-center gap-2 border-border/50 border-l pl-4'>
            <Button
              className='h-8 w-8 text-muted-foreground hover:text-foreground'
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              size='icon-sm'
              variant='ghost'
            >
              <MagnifyingGlassMinus className='h-4 w-4' />
            </Button>
            <div className='w-12 select-none text-center font-mono text-[11px] text-muted-foreground'>
              {Math.round(zoom * 100)}%
            </div>
            <Button
              className='h-8 w-8 text-muted-foreground hover:text-foreground'
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              size='icon-sm'
              variant='ghost'
            >
              <MagnifyingGlassPlus className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-auto bg-muted/5' ref={timelineRef}>
        <div className='relative' style={{ width: nameColWidth + timelineWidth }}>
          {/* Top Header Row */}
          <div className='sticky top-0 z-40 flex h-10 border-border/50 border-b bg-background/95 backdrop-blur-sm'>
            {/* Top-Left Corner: Project Name Header */}
            <div
              className='sticky left-0 z-50 flex h-full shrink-0 items-center border-border/50 border-r bg-background px-4'
              style={{ width: nameColWidth }}
            >
              <span className='font-bold text-muted-foreground text-xs uppercase tracking-wider'>
                项目名称
              </span>
            </div>

            {/* Dates sequence */}
            <div className='flex'>
              {dates.map((date) => {
                const isWeekend = date.getDay() === 0 || date.getDay() === 6
                const isToday = isSameDay(date, FIXED_TODAY)
                return (
                  <div
                    className={cn(
                      'flex shrink-0 flex-col items-center justify-center border-border/20 border-r',
                      isWeekend && viewMode === 'Day' ? 'bg-muted/20' : '',
                    )}
                    key={date.toISOString()}
                    style={{ width: cellWidth }}
                  >
                    <span
                      className={cn(
                        'font-bold text-[10px] uppercase tracking-tighter',
                        isToday ? 'text-primary' : 'text-muted-foreground/50',
                      )}
                    >
                      {format(date, 'EEE', { locale: zhCN })}
                    </span>
                    <span
                      className={cn(
                        'font-extrabold text-[13px] tabular-nums',
                        isToday ? 'text-primary' : 'text-foreground/80',
                      )}
                    >
                      {format(date, 'd')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rows Content */}
          <div className='flex flex-col'>
            {projects.map((project) => (
              <div className='flex flex-col border-border/10 border-b' key={project.id}>
                {/* Project Row */}
                <div className='group flex h-[54px] min-w-full'>
                  {/* Sticky Name Cell */}
                  <button
                    className={cn(
                      'sticky left-0 z-20 flex shrink-0 cursor-pointer items-center gap-3 border-border/50 border-r bg-background px-4 transition-all duration-200',
                      'shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:shadow-[4px_0_12px_-4px_rgba(0,0,0,0.2)]',
                      expandedProjects.includes(project.id)
                        ? 'bg-muted'
                        : 'bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900',
                    )}
                    onClick={() => toggleProject(project.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') toggleProject(project.id)
                    }}
                    style={{ width: nameColWidth }}
                    type='button'
                  >
                    <CaretDown
                      className={cn(
                        'h-4 w-4 text-muted-foreground/60 transition-transform duration-200',
                        !expandedProjects.includes(project.id) && '-rotate-90',
                      )}
                    />
                    <div className='flex min-w-0 flex-1 flex-col'>
                      <span className='truncate font-bold text-[13px] transition-colors group-hover:text-primary'>
                        {project.name}
                      </span>
                      <span className='font-medium text-[10px] text-muted-foreground italic opacity-70'>
                        {project.client}
                      </span>
                    </div>
                    <div className='min-w-[24px] rounded bg-muted/30 px-1.5 text-center font-extrabold text-[11px] text-muted-foreground tabular-nums'>
                      {project.taskCount}
                    </div>
                  </button>

                  {/* Timeline segment */}
                  <div className='relative flex-1' style={{ width: timelineWidth }}>
                    {/* Background Grid */}
                    <div className='pointer-events-none absolute inset-0 flex'>
                      {dates.map((date) => {
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6
                        return (
                          <div
                            className={cn(
                              'h-full flex-none border-border/20 border-r',
                              isWeekend && viewMode === 'Day' ? 'bg-muted/20' : '',
                            )}
                            key={date.toISOString()}
                            style={{ width: cellWidth }}
                          />
                        )
                      })}
                    </div>

                    <DraggableBar
                      cellWidth={cellWidth}
                      item={{
                        endDate: project.endDate,
                        id: project.id,
                        name: project.name,
                        progress: project.progress,
                        startDate: project.startDate,
                      }}
                      onDoubleClick={() => handleDoubleClick('project', project.id)}
                      onUpdateDuration={(id, newStart, newEnd) =>
                        handleUpdateProjectDuration(id, newStart, newEnd)
                      }
                      onUpdateStart={(id, newStart) => handleUpdateProject(id, newStart)}
                      variant='project'
                      viewStartDate={viewStartDate}
                    />
                  </div>
                </div>

                {/* Task Rows */}
                {expandedProjects.includes(project.id) &&
                  project.tasks.map((task) => (
                    <div className='group flex h-10 border-border/5 border-t' key={task.id}>
                      <button
                        className='sticky left-0 z-20 flex shrink-0 cursor-pointer items-center border-border/50 border-r bg-zinc-50 px-4 pl-12 text-left shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] transition-all duration-200 group-hover:bg-zinc-100 dark:bg-zinc-900 dark:group-hover:bg-zinc-800'
                        onClick={() => {}}
                        style={{ width: nameColWidth }}
                        type='button'
                      >
                        <span className='truncate font-medium text-muted-foreground/80 text-xs transition-colors group-hover:text-foreground'>
                          {task.name}
                        </span>
                        <div className='ml-auto flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                          <PriorityGlyphIcon level={project.priority} size='sm' />
                        </div>
                      </button>

                      {/* Timeline segment */}
                      <div
                        className='relative flex-1 bg-muted/2 transition-colors group-hover:bg-muted/5'
                        style={{ width: timelineWidth }}
                      >
                        <div className='pointer-events-none absolute inset-0 flex'>
                          {dates.map((date) => {
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6
                            return (
                              <div
                                className={cn(
                                  'h-full flex-none border-border/20 border-r',
                                  isWeekend && viewMode === 'Day' ? 'bg-muted/20' : '',
                                )}
                                key={date.toISOString()}
                                style={{ width: cellWidth }}
                              />
                            )
                          })}
                        </div>

                        <DraggableBar
                          cellWidth={cellWidth}
                          item={{
                            endDate: task.endDate,
                            id: task.id,
                            name: task.name,
                            startDate: task.startDate,
                            status: task.status,
                          }}
                          onDoubleClick={() => handleDoubleClick('task', project.id, task.id)}
                          onUpdateDuration={(id, newStart, newEnd) =>
                            handleUpdateTaskDuration(project.id, id, newStart, newEnd)
                          }
                          onUpdateStart={(id, newStart) =>
                            handleUpdateTask(project.id, id, newStart)
                          }
                          variant='task'
                          viewStartDate={viewStartDate}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Today Line */}
          {todayOffsetDays != null && (
            <div
              className='pointer-events-none absolute z-30'
              style={{
                bottom: 0,
                left: nameColWidth + (todayOffsetDays || 0) * cellWidth + cellWidth / 2,
                top: 40,
                width: 2,
              }}
            >
              <div className='h-full w-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]'>
                <div className='absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-primary' />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Date Dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setEditDialog({ isOpen: false, projectId: null, taskId: null, type: null })
        }}
        open={editDialog.isOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>编辑日期</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4 font-sans'>
            <div className='space-y-2'>
              <label
                className='font-bold text-muted-foreground text-sm uppercase'
                htmlFor='item-name'
              >
                名称 {editDialog.type === 'project' ? '(项目)' : '(任务)'}
              </label>
              <Input
                className='bg-muted font-bold'
                disabled
                id='item-name'
                value={
                  editDialog.type === 'project'
                    ? projects.find((p) => p.id === editDialog.projectId)?.name || ''
                    : projects
                        .find((p) => p.id === editDialog.projectId)
                        ?.tasks.find((t) => t.id === editDialog.taskId)?.name || ''
                }
              />
            </div>
            <div className='flex gap-4'>
              <div className='flex-1 space-y-2'>
                <label
                  className='font-bold text-muted-foreground text-sm uppercase'
                  htmlFor='start-date'
                >
                  开始日期
                </label>
                <Input
                  className='font-mono'
                  id='start-date'
                  onChange={(e) => setEditStartDate(e.target.value)}
                  type='date'
                  value={editStartDate}
                />
              </div>
              <div className='flex-1 space-y-2'>
                <label
                  className='font-bold text-muted-foreground text-sm uppercase'
                  htmlFor='end-date'
                >
                  截止日期
                </label>
                <Input
                  className='font-mono'
                  id='end-date'
                  onChange={(e) => setEditEndDate(e.target.value)}
                  type='date'
                  value={editEndDate}
                />
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button
              onClick={() =>
                setEditDialog({ isOpen: false, projectId: null, taskId: null, type: null })
              }
              variant='outline'
            >
              取消
            </Button>
            <Button className='px-8 font-bold' onClick={handleSaveEdit}>
              保存修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
