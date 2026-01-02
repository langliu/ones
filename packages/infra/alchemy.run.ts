/** biome-ignore-all lint/style/noNonNullAssertion: false positive */
import alchemy from 'alchemy'
import { D1Database, TanStackStart, Worker } from 'alchemy/cloudflare'
import { config } from 'dotenv'

config({ path: './.env' })
config({ path: '../../apps/web/.env' })
config({ path: '../../apps/server/.env' })

const app = await alchemy('ones')

const db = await D1Database('database', {
  migrationsDir: '../../packages/db/src/migrations',
})

export const web = await TanStackStart('web', {
  bindings: {
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    DB: db,
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
  },
  cwd: '../../apps/web',
})

export const server = await Worker('server', {
  bindings: {
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    DB: db,
  },
  compatibility: 'node',
  cwd: '../../apps/server',
  dev: {
    port: 3000,
  },
  entrypoint: 'src/index.ts',
})

console.log(`Web    -> ${web.url}`)
console.log(`Server -> ${server.url}`)

await app.finalize()
