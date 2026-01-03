import { CalendarDays, ChevronDown, Filter, LayoutGrid, List, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { FilterCounts } from '@/lib/data/projects'
import type { FilterChip, ViewOptions } from '@/lib/view-options'

interface ProjectHeaderProps {
  filters: FilterChip[]
  onRemoveFilter: (key: string, value: string) => void
  onFiltersChange: (chips: FilterChip[]) => void
  counts: FilterCounts
  viewOptions: ViewOptions
  onViewOptionsChange: (options: ViewOptions) => void
}

export function ProjectHeader({
  filters,
  onRemoveFilter,
  onFiltersChange,
  counts,
  viewOptions,
  onViewOptionsChange,
}: ProjectHeaderProps) {
  const addFilter = (key: string, value: string) => {
    // 检查是否已存在
    if (filters.some((f) => f.key === key && f.value === value)) return
    onFiltersChange([...filters, { key, value }])
  }

  const toggleFilter = (key: string, value: string) => {
    if (filters.some((f) => f.key === key && f.value === value)) {
      onRemoveFilter(key, value)
    } else {
      addFilter(key, value)
    }
  }

  return (
    <div className='sticky top-0 z-10 border-border border-b bg-card/50 backdrop-blur-sm'>
      <div className='flex flex-col gap-4 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='font-bold text-2xl tracking-tight'>项目</h1>
            <p className='mt-0.5 font-medium text-muted-foreground text-xs'>
              管理您的工程进度、任务和团队
            </p>
          </div>

          <div className='flex items-center gap-3'>
            {/* 筛选引擎 */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button className='h-9 gap-2 shadow-sm' size='sm' variant='outline'>
                    <Filter className='h-3.5 w-3.5' />
                    <span>筛选</span>
                    {filters.length > 0 && (
                      <span className='ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground'>
                        {filters.length}
                      </span>
                    )}
                    <ChevronDown className='h-3.5 w-3.5 opacity-50' />
                  </Button>
                }
              />
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>按状态筛选</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(['backlog', 'planned', 'active', 'completed', 'cancelled'] as const).map(
                    (s) => (
                      <DropdownMenuCheckboxItem
                        checked={filters.some((f) => f.key === 'Status' && f.value === s)}
                        key={s}
                        onCheckedChange={() => toggleFilter('Status', s)}
                      >
                        <div className='flex w-full items-center justify-between'>
                          <span className='capitalize'>{s}</span>
                          <span className='text-[10px] text-muted-foreground'>
                            {counts.status?.[s] || 0}
                          </span>
                        </div>
                      </DropdownMenuCheckboxItem>
                    ),
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel>按优先级筛选</DropdownMenuLabel>
                  {(['urgent', 'high', 'medium', 'low'] as const).map((p) => (
                    <DropdownMenuCheckboxItem
                      checked={filters.some((f) => f.key === 'Priority' && f.value === p)}
                      key={p}
                      onCheckedChange={() => toggleFilter('Priority', p)}
                    >
                      <div className='flex w-full items-center justify-between'>
                        <span className='capitalize'>{p}</span>
                        <span className='text-[10px] text-muted-foreground'>
                          {counts.priority?.[p] || 0}
                        </span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>

                {filters.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='justify-center text-destructive text-xs focus:text-destructive'
                      onClick={() => onFiltersChange([])}
                    >
                      清空所有筛选
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 视图切换器 */}
            <div className='flex items-center rounded-lg border border-border/50 bg-muted/50 p-1 shadow-inner'>
              <Button
                className='h-7 w-8 rounded-md shadow-sm transition-all'
                onClick={() => onViewOptionsChange({ ...viewOptions, viewType: 'list' })}
                size='icon-sm'
                title='列表视图'
                variant={viewOptions.viewType === 'list' ? 'secondary' : 'ghost'}
              >
                <List className='h-4 w-4' />
              </Button>
              <Button
                className='h-7 w-8 rounded-md shadow-sm transition-all'
                onClick={() => onViewOptionsChange({ ...viewOptions, viewType: 'board' })}
                size='icon-sm'
                title='看板视图'
                variant={viewOptions.viewType === 'board' ? 'secondary' : 'ghost'}
              >
                <LayoutGrid className='h-4 w-4' />
              </Button>
              <Button
                className='h-7 w-8 rounded-md shadow-sm transition-all'
                onClick={() => onViewOptionsChange({ ...viewOptions, viewType: 'timeline' })}
                size='icon-sm'
                title='时间线视图'
                variant={viewOptions.viewType === 'timeline' ? 'secondary' : 'ghost'}
              >
                <CalendarDays className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* 活跃筛选 Chip 展示区域 */}
        {filters.length > 0 && (
          <div className='flex flex-wrap items-center gap-2'>
            {filters.map((filter, index) => (
              <div
                className='fade-in zoom-in inline-flex animate-in items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-medium text-[11px] text-primary duration-200'
                key={`${filter.key}-${filter.value}-${index}`}
              >
                <span className='opacity-70'>{filter.key}:</span>
                <span className='capitalize'>{filter.value}</span>
                <button
                  className='rounded-sm p-0.5 transition-colors hover:bg-primary/20'
                  onClick={() => onRemoveFilter(filter.key, filter.value)}
                  type='button'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            ))}
            <Button
              className='h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground'
              onClick={() => onFiltersChange([])}
              size='sm'
              variant='ghost'
            >
              重置
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
