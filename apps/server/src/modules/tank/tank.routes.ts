import { Router } from 'express'
import { listTankInventory, listTankLevelHistory } from './tank.service'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const data = await listTankInventory()
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

router.get('/level-history', async (req, res, next) => {
  try {
    const allRaw = typeof req.query.all === 'string' ? req.query.all : undefined
    const all = allRaw === '1' || allRaw === 'true'

    const hoursRaw = typeof req.query.hours === 'string' ? Number(req.query.hours) : 24
    const bucketRaw =
      typeof req.query.bucketMinutes === 'string'
        ? Number(req.query.bucketMinutes)
        : 60
    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined
    const endRaw = typeof req.query.end === 'string' ? req.query.end : undefined

    if (!all && (!Number.isFinite(hoursRaw) || hoursRaw <= 0 || hoursRaw > 168)) {
      return res.status(400).json({
        error: 'Invalid hours query param (1~168).'
      })
    }

    if (!Number.isFinite(bucketRaw) || bucketRaw <= 0 || bucketRaw > 1440) {
      return res.status(400).json({
        error: 'Invalid bucketMinutes query param (1~1440).'
      })
    }

    if (typeof limitRaw !== 'undefined' && (!Number.isFinite(limitRaw) || limitRaw <= 0 || limitRaw > 300000)) {
      return res.status(400).json({
        error: 'Invalid limit query param (1~300000).'
      })
    }

    const end = endRaw ? new Date(endRaw) : undefined
    if (endRaw && Number.isNaN(end?.getTime())) {
      return res.status(400).json({
        error: 'Invalid end query param (ISO timestamp).'
      })
    }

    const data = await listTankLevelHistory({
      hours: Math.floor(hoursRaw),
      bucketMinutes: Math.floor(bucketRaw),
      limit: typeof limitRaw === 'number' ? Math.floor(limitRaw) : undefined,
      end,
      all
    })

    res.json({ data })
  } catch (error) {
    next(error)
  }
})

export default router
