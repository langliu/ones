import type { RouterClient } from '@orpc/server'

import { protectedProcedure, publicProcedure } from '../index'
import { projectRouter } from './project'
import { todoRouter } from './todo'

import { userRouter } from './user'

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK'
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: 'This is private',
      user: context.session?.user,
    }
  }),
  project: projectRouter,
  todo: todoRouter,
  user: userRouter,
}
export type AppRouter = typeof appRouter
export type AppRouterClient = RouterClient<typeof appRouter>
