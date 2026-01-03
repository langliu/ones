import { db } from '@ones/db'
import { project, task } from '@ones/db/schema/project'
import { eq } from 'drizzle-orm'
import z from 'zod'

import { publicProcedure } from '../index'

const projectSchema = z.object({
  client: z.string().optional(),
  durationLabel: z.string().optional(),
  endDate: z.date(),
  id: z.string(),
  members: z.array(z.string()),
  name: z.string(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  progress: z.number().min(0).max(100),
  startDate: z.date(),
  status: z.enum(['backlog', 'planned', 'active', 'cancelled', 'completed']),
  tags: z.array(z.string()),
  typeLabel: z.string().optional(),
})

const taskSchema = z.object({
  assignee: z.string(),
  endDate: z.date(),
  id: z.string(),
  name: z.string(),
  projectId: z.string(),
  startDate: z.date(),
  status: z.enum(['todo', 'in-progress', 'done']),
})

export const projectRouter = {
  createProject: publicProcedure.input(projectSchema).handler(async ({ input }) => {
    return await db.insert(project).values(input).returning()
  }),

  // Tasks
  createTask: publicProcedure.input(taskSchema).handler(async ({ input }) => {
    return await db.insert(task).values(input).returning()
  }),

  deleteProject: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    return await db.delete(project).where(eq(project.id, input.id))
  }),

  deleteTask: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    return await db.delete(task).where(eq(task.id, input.id))
  }),
  // Projects
  getAllProjects: publicProcedure.handler(async () => {
    return await db.query.project.findMany({
      with: {
        tasks: true,
      },
    })
  }),

  getProject: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    return await db.query.project.findFirst({
      where: eq(project.id, input.id),
      with: {
        tasks: true,
      },
    })
  }),

  updateProject: publicProcedure
    .input(projectSchema.partial().extend({ id: z.string() }))
    .handler(async ({ input }) => {
      const { id, ...data } = input
      return await db.update(project).set(data).where(eq(project.id, id)).returning()
    }),

  updateTask: publicProcedure
    .input(taskSchema.partial().extend({ id: z.string() }))
    .handler(async ({ input }) => {
      const { id, ...data } = input
      return await db.update(task).set(data).where(eq(task.id, id)).returning()
    }),
}
