import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProjectBoardView } from '@/components/project-board-view'
import { ProjectCardsView } from '@/components/project-cards-view'
import { ProjectHeader } from '@/components/project-header'
import { ProjectTimeline } from '@/components/project-timeline'
import { computeFilterCounts, projects } from '@/lib/data/projects'
import { chipsToParams, paramsToChips } from '@/lib/url/filters'
import { DEFAULT_VIEW_OPTIONS, type FilterChip, type ViewOptions } from '@/lib/view-options'

export function ProjectsContent() {
  const navigate = useNavigate()
  // 修正路由路径获取
  const searchParams = useSearch({ from: '/projects' }) as Record<string, string>

  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)
  const [filters, setFilters] = useState<FilterChip[]>([])

  const isSyncingRef = useRef(false)
  const prevParamsRef = useRef<string>('')

  const removeFilter = (key: string, value: string) => {
    const next = filters.filter((f) => !(f.key === key && f.value === value))
    setFilters(next)
    replaceUrlFromChips(next)
  }

  const applyFilters = (chips: FilterChip[]) => {
    setFilters(chips)
    replaceUrlFromChips(chips)
  }

  useEffect(() => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      params.set(key, value)
    }
    const currentParams = params.toString()

    if (prevParamsRef.current === currentParams) return

    if (isSyncingRef.current) {
      isSyncingRef.current = false
      return
    }

    prevParamsRef.current = currentParams
    const chips = paramsToChips(params)
    setFilters(chips)
  }, [searchParams])

  const replaceUrlFromChips = (chips: FilterChip[]) => {
    const params = chipsToParams(chips)
    const paramsObj: Record<string, string> = {}
    params.forEach((value, key) => {
      paramsObj[key] = value
    })

    isSyncingRef.current = true
    prevParamsRef.current = params.toString()
    navigate({
      replace: true,
      search: paramsObj,
      to: '/projects',
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
