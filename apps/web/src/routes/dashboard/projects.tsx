import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { ProjectsContent } from '@/components/projects-content'

const projectsSearchSchema = z.object({
  members: z.string().optional(),
  ordering: z.enum(['manual', 'alphabetical', 'date']).optional(),
  priority: z.string().optional(),
  showClosedProjects: z.boolean().optional(),
  // Filters
  status: z.string().optional(),
  tags: z.string().optional(),
  // Timeline specific
  viewMode: z.enum(['Day', 'Week', 'Month', 'Quarter']).optional(),
  viewStartDate: z.string().optional(),
  viewType: z.enum(['list', 'board', 'timeline']).optional(),
  zoom: z.number().optional(),
})

export type ProjectsSearch = z.infer<typeof projectsSearchSchema>

export const Route = createFileRoute('/dashboard/projects')({
  component: ProjectsPage,
  validateSearch: (search) => projectsSearchSchema.parse(search),
})

function ProjectsPage() {
  return <ProjectsContent />
}
