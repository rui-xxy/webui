import { config } from 'dotenv'
import { z } from 'zod'

config()

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SERVER_PORT: z.coerce.number().default(4000),
  PGHOST: z.string().min(1, 'PGHOST is required'),
  PGPORT: z.coerce.number().default(5432),
  PGDATABASE: z.string().min(1, 'PGDATABASE is required'),
  PGUSER: z.string().min(1, 'PGUSER is required'),
  PGPASSWORD: z.string().min(1, 'PGPASSWORD is required')
})

export const env = EnvSchema.parse(process.env)
