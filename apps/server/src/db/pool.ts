import { Pool } from 'pg'
import { env } from '../config/env'

export const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  database: env.PGDATABASE,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000
})

pool.on('error', (error) => {
  console.error('[pg] unexpected error on idle client', error)
})
