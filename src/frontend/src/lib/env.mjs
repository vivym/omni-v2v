import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url()
      .default('https://v2v.sota.wiki'),

    NEXT_PUBLIC_API_BASE_URL: z
      .string()
      .url()
      .default('https://api.v2v.sota.wiki'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
  },
})
