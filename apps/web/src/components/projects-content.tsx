import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ProjectBoardView } from '@/components/project-board-view'
import { ProjectCardsView } from '@/components/project-cards-view'
import { ProjectHeader } from '@/components/project-header'
import { ProjectTimeline } from '@/components/project-timeline'
import { computeFilterCounts, projects } from '@/lib/data/projects'
import { chipsToParams, paramsToChips } from '@/lib/url/filters'
import { DEFAULT_VIEW_OPTIONS, type FilterChip, type ViewOptions } from '@/lib/view-options'
import type { ProjectsSearch } from '@/routes/dashboard.projects'

export function ProjectsContent() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/dashboard/projects' })

  const filters = useMemo(() => {
    const params = new URLSearchParams()
    if (searchParams.status) params.set('status', searchParams.status)
    if (searchParams.priority) params.set('priority', searchParams.priority)
    if (searchParams.tags) params.set('tags', searchParams.tags)
    if (searchParams.members) params.set('members', searchParams.members)
    return paramsToChips(params)
  }, [searchParams])

  const viewOptions = useMemo(
    () => ({
      ...DEFAULT_VIEW_OPTIONS,
      ordering: searchParams.ordering || DEFAULT_VIEW_OPTIONS.ordering,
      showClosedProjects:
        searchParams.showClosedProjects ?? DEFAULT_VIEW_OPTIONS.showClosedProjects,
      viewType: searchParams.viewType || DEFAULT_VIEW_OPTIONS.viewType,
    }),
    [searchParams],
  )

  const updateSearch = (newParams: Partial<ProjectsSearch>) => {
    navigate({
      replace: true,
      search: (prev) => ({ ...prev, ...newParams }) as ProjectsSearch,
      to: '/dashboard/projects',
    })
  }

  const removeFilter = (key: string, value: string) => {
    const next = filters.filter((f) => !(f.key === key && f.value === value))
    applyFilters(next)
  }

  const applyFilters = (chips: FilterChip[]) => {
    const params = chipsToParams(chips)
    updateSearch({
      members: params.get('members') || undefined,
      priority: params.get('priority') || undefined,
      status: params.get('status') || undefined,
      tags: params.get('tags') || undefined,
    })
  }

  const setViewOptions = (options: ViewOptions) => {
    updateSearch({
      ordering: options.ordering,
      showClosedProjects: options.showClosedProjects,
      viewType: options.viewType,
    })
  }

  const filteredProjects = useMemo(() => {
    let list = projects.slice()

    if (!viewOptions.showClosedProjects) {
      list = list.filter((p) => p.status !== 'completed' && p.status !== 'cancelled')
    }

    const statusSet = new Set<string>()
    const prioritySet = new Set<string>()
    const tagSet = new Set<string>()
    const memberSet = new Set<string>()

    for (const { key, value } of filters) {
      const k = key.trim().toLowerCase()
      const v = value.trim().toLowerCase()
      if (k.startsWith('status')) statusSet.add(v)
      else if (k.startsWith('priority')) prioritySet.add(v)
      else if (k.startsWith('tag')) tagSet.add(v)
      else if (k === 'pic' || k.startsWith('member')) memberSet.add(v)
    }

    if (statusSet.size) list = list.filter((p) => statusSet.has(p.status.toLowerCase()))
    if (prioritySet.size) list = list.filter((p) => prioritySet.has(p.priority.toLowerCase()))
    if (tagSet.size) list = list.filter((p) => p.tags.some((t) => tagSet.has(t.toLowerCase())))
    if (memberSet.size) {
      const members = Array.from(memberSet)
      list = list.filter((p) =>
        p.members.some((m) => members.some((mv) => m.toLowerCase().includes(mv))),
      )
    }

    const sorted = list.slice()
    if (viewOptions.ordering === 'alphabetical') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (viewOptions.ordering === 'date')
      sorted.sort((a, b) => (a.endDate?.getTime() || 0) - (b.endDate?.getTime() || 0))
    return sorted
  }, [filters, viewOptions])

  // 计算筛选计数器（基于未过滤的原始数据，或者根据当前上下文）
  // 通常计数器显示的是“如果应用此筛选会得到多少个结果”
  const filterCounts = useMemo(() => computeFilterCounts(projects), [])

  return (
    <div className='m-0.5 flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm'>
      <ProjectHeader
        counts={filterCounts}
        filters={filters}
        onFiltersChange={applyFilters}
        onRemoveFilter={removeFilter}
        onViewOptionsChange={setViewOptions}
        viewOptions={viewOptions}
      />
      <div className='flex flex-1 flex-col overflow-hidden'>
        {viewOptions.viewType === 'timeline' && <ProjectTimeline projects={filteredProjects} />}
        {viewOptions.viewType === 'list' && <ProjectCardsView projects={filteredProjects} />}
        {viewOptions.viewType === 'board' && <ProjectBoardView projects={filteredProjects} />}
      </div>
    </div>
  )
}
