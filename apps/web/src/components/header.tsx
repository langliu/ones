import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import UserMenu from './user-menu'

export default function Header() {
  const links = [
    { label: '首页', to: '/' },
    { label: '仪表盘', to: '/dashboard' },
    { label: '待办', to: '/todos' },
  ] as const

  return (
    <header className='sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-8'>
          <Link className='flex items-center gap-2 font-bold' to='/'>
            <div className='h-6 w-6 rounded-lg bg-primary/20 p-1 text-primary'>
              <svg
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <title>ONES Logo</title>
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <span className='hidden font-bold sm:inline-block'>ONES</span>
          </Link>
          <nav className='flex items-center gap-6 font-medium text-sm'>
            {links.map(({ to, label }) => (
              <Link
                activeProps={{
                  className: 'text-foreground font-semibold',
                }}
                className={cn(
                  'text-muted-foreground transition-colors hover:text-foreground/80',
                  to === '/' && 'hidden sm:block', // Hide home link on mobile if logo is enough
                )}
                key={to}
                to={to}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
