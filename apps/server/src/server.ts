import cors from 'cors'
import express from 'express'
import tanksRouter from './routes/tanks'

export function createServer() {
  const app = express()

  app.use(
    cors({
      origin: '*'
    })
  )
  app.use(express.json())

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/tanks', tanksRouter)

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
