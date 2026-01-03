import { db } from '@ones/db'
import { user } from '@ones/db/schema/auth'
import { count, like } from 'drizzle-orm'
import z from 'zod'

import { protectedProcedure } from '../index'

export const userRouter = {
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        name: z.string().optional(),
        page: z.number().min(1).default(1),
      }),
    )
    .handler(async ({ input }) => {
      const { limit, name, page } = input
      const offset = (page - 1) * limit

      const where = name ? like(user.name, `%${name}%`) : undefined

      const [users, [total]] = await Promise.all([
        db.query.user.findMany({
          limit,
          offset,
          orderBy: (users, { desc }) => [desc(users.createdAt)],
          where: (users, { like }) => (name ? like(users.name, `%${name}%`) : undefined),
        }),
        db.select({ count: count() }).from(user).where(where),
      ])

      return {
        data: users,
        pagination: {
          limit,
          page,
          total: total?.count ?? 0,
          totalPages: Math.ceil((total?.count ?? 0) / limit),
        },
      }
    }),
}
