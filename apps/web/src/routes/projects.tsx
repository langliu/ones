import { createFileRoute } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { ProjectsContent } from '@/components/projects-content'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return search as Record<string, string>
  },
})

function ProjectsPage() {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider className='h-svh overflow-hidden'>
        <AppSidebar />
        <SidebarInset className='overflow-hidden'>
          <ProjectsContent />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
