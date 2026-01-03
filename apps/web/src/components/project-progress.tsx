'use client'

import { ListChecks } from '@phosphor-icons/react/dist/ssr'
import { ProgressCircle } from '@/components/progress-circle'
import type { Project } from '@/lib/data/projects'
import { cn } from '@/lib/utils'

export type ProjectProgressProps = {
  project: Project
  className?: string
  /**
   * Progress circle size in pixels, default 18px (matches sidebar Active Projects)
   */
  size?: number
  /**
   * Whether to show the "done / total Tasks" summary text
   */
  showTaskSummary?: boolean
}

function computeProjectProgress(project: Project) {
  const totalTasks = project.tasks?.length ?? project.taskCount ?? 0
  const doneTasks = project.tasks
    ? project.tasks.filter((t) => t.status === 'done').length
    : Math.round(((project.progress ?? 0) / 100) * totalTasks)

  const percent =
    typeof project.progress === 'number'
      ? project.progress
      : totalTasks
        ? Math.round((doneTasks / totalTasks) * 100)
        : 0

  return {
    doneTasks,
    percent: Math.max(0, Math.min(100, percent)),
    totalTasks,
  }
}

function getProgressColor(percent: number): string {
  if (percent >= 80) return '#10b981' // emerald
  if (percent >= 50) return '#f59e0b' // amber
  if (percent > 0) return '#ef4444' // red
  return '#94a3b8' // slate
}

export function ProjectProgress({
  project,
  className,
  size = 18,
  showTaskSummary = true,
}: ProjectProgressProps) {
  const { totalTasks, doneTasks, percent } = computeProjectProgress(project)
  const color = getProgressColor(percent)

  return (
    <div className={cn('flex items-center gap-2 text-muted-foreground text-sm', className)}>
      <ProgressCircle color={color} progress={percent} size={size} />
      <div className='flex items-center gap-4'>
        <span className='font-medium text-foreground/80'>{percent}%</span>
        {showTaskSummary && totalTasks > 0 && (
          <span className='flex items-center gap-1.5 text-xs'>
            <ListChecks className='h-3.5 w-3.5' />
            {doneTasks} / {totalTasks} 任务
          </span>
        )}
      </div>
    </div>
  )
}
