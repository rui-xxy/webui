import { env } from './config/env'
import { createServer } from './server'

async function bootstrap() {
  const app = createServer()
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(env.SERVER_PORT, () => {
      console.log(`API server listening on port ${env.SERVER_PORT}`)
      resolve()
    })

    server.on('error', (error) => {
      console.error('Failed to start API server', error)
      reject(error)
    })
  })
}

bootstrap().catch((error) => {
  console.error(error)
  process.exit(1)
})
