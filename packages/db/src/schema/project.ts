import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const project = sqliteTable('project', {
  client: text('client'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  durationLabel: text('duration_label'),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  id: text('id').primaryKey(),
  members: text('members', { mode: 'json' }).$type<string[]>().default(sql`'[]'`).notNull(),
  name: text('name').notNull(),
  priority: text('priority', { enum: ['urgent', 'high', 'medium', 'low'] }).notNull(),
  progress: integer('progress').default(0).notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  status: text('status', {
    enum: ['backlog', 'planned', 'active', 'cancelled', 'completed'],
  }).notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default(sql`'[]'`).notNull(),
  typeLabel: text('type_label'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
})

export const task = sqliteTable('task', {
  assignee: text('assignee').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  projectId: text('project_id')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['todo', 'in-progress', 'done'] }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
})

export const projectRelations = relations(project, ({ many }) => ({
  tasks: many(task),
}))

export const taskRelations = relations(task, ({ one }) => ({
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
}))
