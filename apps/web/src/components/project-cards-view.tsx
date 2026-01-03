'use client'

import { Folders } from '@phosphor-icons/react/dist/ssr'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/lib/data/projects'

interface ProjectCardsViewProps {
  projects: Project[]
}

export function ProjectCardsView({ projects }: ProjectCardsViewProps) {
  if (projects.length === 0) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-12 text-muted-foreground opacity-60'>
        <Folders className='mb-4 h-12 w-12' />
        <p className='font-medium text-sm'>未找到任何项目</p>
      </div>
    )
  }

  return (
    <div className='no-scrollbar flex-1 overflow-auto bg-muted/5'>
      <div className='grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} variant='list' />
        ))}
      </div>
    </div>
  )
}
