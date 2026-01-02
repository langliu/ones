import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  client: {
    VITE_SERVER_URL: z.url(),
  },
  clientPrefix: 'VITE_',
  emptyStringAsUndefined: true,
  // biome-ignore lint/suspicious/noExplicitAny: false positive
  runtimeEnv: (import.meta as any).env,
})
