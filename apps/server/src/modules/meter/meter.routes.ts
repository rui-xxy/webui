import { Router } from 'express'
import { listTotalElectricDailyUsage } from './meter.service'

const router = Router()

router.get('/electric/total/trend', async (req, res, next) => {
  try {
    const start =
      typeof req.query.start === 'string' ? req.query.start : undefined
    const end = typeof req.query.end === 'string' ? req.query.end : undefined

    if (!start || !end) {
      return res.status(400).json({
        error: 'Missing start or end query params (YYYY-MM-DD).'
      })
    }

    const data = await listTotalElectricDailyUsage(start, end)
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

export default router

