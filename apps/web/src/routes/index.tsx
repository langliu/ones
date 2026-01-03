import {
  ArrowRight,
  ChartBar,
  CheckCircle,
  Funnel,
  GithubLogo,
  Kanban,
  Lightning,
} from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { orpc } from '@/utils/orpc'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions())

  return (
    <div className='min-h-screen bg-background text-foreground selection:bg-primary/20'>
      {/* Hero Section */}
      <section className='relative isolate overflow-hidden pt-14 lg:pt-24'>
        <div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
          <div
            className='relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <div className='mb-8 flex justify-center'>
              <div className='relative rounded-full px-3 py-1 text-muted-foreground text-sm leading-6 ring-1 ring-border transition-all hover:ring-foreground/20'>
                <span className='mr-2 font-semibold text-primary'>最新</span>
                时间线视图现已上线。{' '}
                <Link
                  className='font-semibold text-foreground'
                  search={{}}
                  to='/dashboard/projects'
                >
                  立即体验 <span aria-hidden='true'>&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className='bg-linear-to-b from-foreground to-foreground/60 bg-clip-text pb-2 font-bold text-4xl text-transparent tracking-tight sm:text-6xl'>
              为高效团队打造的 <br /> 项目管理工具
            </h1>
            <p className='mt-6 text-lg text-muted-foreground leading-8'>
              规划、追踪并交付您的最佳成果。一款专为现代软件开发工作流量身定制的线性、快速且直观的工具。
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'relative gap-2 overflow-hidden rounded-full bg-linear-to-r from-primary to-purple-600 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40',
                )}
                search={{}}
                to='/dashboard/projects'
              >
                开始使用 <ArrowRight className='h-4 w-4' />
              </Link>
              <Button className='rounded-full px-8 text-base' size='lg' variant='ghost'>
                <GithubLogo className='mr-2 h-5 w-5' />
                GitHub 点赞
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-border/20 p-2 ring-1 ring-border/40 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4'>
              <div className='overflow-hidden rounded-lg border border-border/50 bg-background shadow-2xl'>
                {/* Abstract UI Representation */}
                <div className='relative flex h-[300px] w-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-muted/50 to-muted md:h-[500px]'>
                  <div className='absolute inset-0 grid grid-cols-20 gap-px bg-foreground/10 opacity-[0.03]' />
                  <div className='relative z-10 flex flex-col items-center gap-4 p-8'>
                    <div className='w-full max-w-2xl space-y-4 rounded-xl border border-border bg-card p-4 shadow-xl md:p-6'>
                      <div className='flex items-center gap-4 border-border/50 border-b pb-4'>
                        <div className='h-3 w-3 rounded-full bg-red-500/80' />
                        <div className='h-3 w-3 rounded-full bg-yellow-500/80' />
                        <div className='h-3 w-3 rounded-full bg-green-500/80' />
                        <div className='ml-4 h-2 w-32 rounded-full bg-muted-foreground/20' />
                      </div>
                      <div className='space-y-3'>
                        {[1, 2, 3].map((i) => (
                          <div
                            className='flex items-center gap-4 rounded-lg border border-border/40 bg-muted/30 p-3 transition-colors hover:bg-muted/50'
                            key={i}
                          >
                            <div className='h-4 w-4 rounded-full border-2 border-primary/40' />
                            <div className='h-2 w-full max-w-[200px] rounded-full bg-foreground/10' />
                            <div className='ml-auto h-2 w-12 rounded-full bg-primary/20' />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden='true'
          className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
        >
          <div
            className='relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
        <div className='mx-auto mb-16 max-w-2xl lg:text-center'>
          <h2 className='font-semibold text-base text-primary leading-7'>部署更迅速</h2>
          <p className='mt-2 font-bold text-3xl text-foreground tracking-tight sm:text-4xl'>
            管理项目所需的一切
          </p>
          <p className='mt-6 text-lg text-muted-foreground leading-8'>
            专为速度和效率设计。即时切换视图，使用强大的查询进行过滤，永远不会迷失进度。
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {/* Feature 1 */}
          <div className='group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md'>
            <div className='mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110'>
              <Kanban className='h-6 w-6' />
            </div>
            <h3 className='mb-3 font-semibold text-xl'>看板</h3>
            <p className='text-muted-foreground'>
              使用灵活的看板可视化您的工作流。拖放任务以即时更新状态。
            </p>
          </div>

          {/* Feature 2 */}
          <div className='group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md'>
            <div className='mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110'>
              <ChartBar className='h-6 w-6' />
            </div>
            <h3 className='mb-3 font-semibold text-xl'>时间线视图</h3>
            <p className='text-muted-foreground'>
              使用甘特图风格的时间线提前规划。轻松调整日期和依赖关系。
            </p>
          </div>

          {/* Feature 3 */}
          <div className='group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md'>
            <div className='mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 transition-transform group-hover:scale-110'>
              <Funnel className='h-6 w-6' />
            </div>
            <h3 className='mb-3 font-semibold text-xl'>强大的筛选</h3>
            <p className='text-muted-foreground'>
              多维度的任务分析。保存自定义视图并通过 URL 分享特定上下文。
            </p>
          </div>

          {/* Feature 4 */}
          <div className='group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md'>
            <div className='mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-transform group-hover:scale-110'>
              <Lightning className='h-6 w-6' />
            </div>
            <h3 className='mb-3 font-semibold text-xl'>即时同步</h3>
            <p className='text-muted-foreground'>
              更改会在所有视图中即时反映。基于 URL 的状态管理确保了深层链接能力。
            </p>
          </div>

          {/* API Status Feature */}
          <div className='flex flex-col items-center gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm md:col-span-2 md:flex-row'>
            <div className='flex-1 space-y-4'>
              <h3 className='flex items-center gap-2 font-semibold text-xl'>
                <span>系统状态</span>
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${healthCheck.data ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}
                />
              </h3>
              <p className='text-muted-foreground'>
                与我们强大的 API 后端实时连接，确保您的数据始终安全并同步。
              </p>
              <div className='flex w-fit items-center gap-2 rounded bg-muted/50 px-3 py-1 font-mono text-muted-foreground text-sm'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                API: {healthCheck.isLoading ? '连接中...' : healthCheck.data ? '在线' : '离线'}
              </div>
            </div>

            <div className='shrink-0'>
              <Link
                className={buttonVariants({ variant: 'outline' })}
                search={{}}
                to='/dashboard/projects'
              >
                查看仪表盘
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-border border-t bg-muted/20 py-12'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8'>
          <p className='text-muted-foreground text-sm'>
            &copy; {new Date().getFullYear()} Ones Inc. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <Link
              className='font-semibold text-muted-foreground text-sm leading-6 hover:text-foreground'
              to='/'
            >
              隐私政策
            </Link>
            <Link
              className='font-semibold text-muted-foreground text-sm leading-6 hover:text-foreground'
              to='/'
            >
              服务条款
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
