import { Router } from 'express'
import { getSummaryService, listDepartmentsService, listWorkTasksService } from './work-task.service'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const department =
      typeof req.query.department === 'string' ? req.query.department : undefined
    const status = typeof req.query.status === 'string' ? req.query.status : undefined
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined

    const data = await listWorkTasksService({ department, status, limit, offset })
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

router.get('/departments', async (_req, res, next) => {
  try {
    const data = await listDepartmentsService()
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

router.get('/summary', async (req, res, next) => {
  try {
    const department =
      typeof req.query.department === 'string' ? req.query.department : undefined

    const data = await getSummaryService({ department })
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

export default router

