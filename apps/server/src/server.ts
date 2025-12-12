import cors from 'cors'
import express from 'express'
import tanksRouter from './modules/tank/tank.routes'
import productionRouter from './modules/production/production.routes'
import { pool } from './db/pool'

export function createServer() {
  const app = express()

  app.use(
    cors({
      origin: '*'
    })
  )
  app.use(express.json())

  app.get('/healthz', async (_req, res) => {
    try {
      await pool.query('SELECT 1')
      res.json({ status: 'ok' })
    } catch {
      res.status(503).json({ status: 'error' })
    }
  })

  app.use('/api/tanks', tanksRouter)
  app.use('/api/production', productionRouter)

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  )

  return app
}
