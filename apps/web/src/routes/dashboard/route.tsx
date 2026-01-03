import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider className='h-svh overflow-hidden'>
        <AppSidebar />
        <SidebarInset className='overflow-hidden'>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
