import {
  CaretRight,
  CaretUpDown,
  ChartBar,
  CheckSquare,
  Folder,
  Gear,
  Layout,
  MagnifyingGlass,
  Question,
  Tray,
  Users,
} from '@phosphor-icons/react/dist/ssr'
import { Link, useLocation } from '@tanstack/react-router'
import { ProgressCircle } from '@/components/progress-circle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  activeProjects,
  footerItems,
  type NavItemId,
  navItems,
  type SidebarFooterItemId,
} from '@/lib/data/sidebar'

const navItemIcons: Record<NavItemId, React.ComponentType<{ className?: string }>> = {
  clients: Users,
  inbox: Tray,
  'my-tasks': CheckSquare,
  performance: ChartBar,
  projects: Folder,
}

const footerItemIcons: Record<SidebarFooterItemId, React.ComponentType<{ className?: string }>> = {
  help: Question,
  settings: Gear,
  templates: Layout,
}

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className='border-border/40 border-r-0 border-none shadow-none'>
      <SidebarHeader className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-800 text-primary-foreground shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)]'>
              <svg
                aria-label='工作空间图标'
                className='h-4 w-4'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <title>工作空间图标</title>
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <div className='flex flex-col'>
              <span className='font-semibold text-sm'>工作空间</span>
              <span className='text-muted-foreground text-xs'>专业版</span>
            </div>
          </div>
          <button className='rounded-md p-1 hover:bg-accent' type='button'>
            <CaretUpDown className='h-4 w-4 text-muted-foreground' />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className='gap-0 px-0'>
        <SidebarGroup>
          <div className='relative px-0 py-0'>
            <MagnifyingGlass className='absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              className='h-9 rounded-lg border border-border bg-muted/50 pl-8 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/20'
              placeholder='搜索'
            />
            <kbd className='pointer-events-none absolute top-1/2 right-4 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex'>
              <span className='text-xs'>⌘</span>K
            </kbd>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = navItemIcons[item.id]
                const isActive = item.to ? location.pathname === item.to : item.isActive
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      className='h-9 rounded-lg px-3 font-normal text-muted-foreground'
                      isActive={isActive}
                      // biome-ignore lint/suspicious/noExplicitAny: Authorized use of any to bridge generic string to router type
                      render={item.to ? <Link search={{}} to={item.to as any} /> : undefined}
                    >
                      {Icon && <Icon className='h-[18px] w-[18px]' />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className='rounded-full bg-muted px-2 text-muted-foreground'>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className='px-3 font-medium text-muted-foreground text-xs'>
            活跃项目
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeProjects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton
                    className='group h-9 rounded-lg px-3'
                    render={
                      <Link
                        className='text-blue-600 text-sm hover:underline dark:text-blue-400'
                        search={{}}
                        to='/dashboard/projects'
                      />
                    }
                  >
                    <ProgressCircle color={project.color} progress={project.progress} size={18} />
                    <span className='flex-1 truncate text-sm'>{project.name}</span>
                    <span className='rounded p-0.5 opacity-0 hover:bg-accent group-hover:opacity-100'>
                      <span className='text-lg text-muted-foreground'>···</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-border/40 border-t p-2'>
        <SidebarMenu>
          {footerItems.map((item) => {
            const Icon = footerItemIcons[item.id]
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton className='h-9 rounded-lg px-3 text-muted-foreground'>
                  {Icon && <Icon className='h-[18px] w-[18px]' />}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <div className='mt-2 flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-accent'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatar-profile.jpg' />
            <AvatarFallback>ZS</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-col'>
            <span className='font-medium text-sm'>张三</span>
            <span className='text-muted-foreground text-xs'>zhangsan@mail.com</span>
          </div>
          <CaretRight className='h-4 w-4 text-muted-foreground' />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
