import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url()
      .default('http://localhost:3000'),

    NEXT_PUBLIC_API_BASE_URL: z
      .string()
      .url()
      .default('http://localhost:3000/api'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
  },
})
