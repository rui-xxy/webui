import { Router } from 'express'
import { listTankInventory } from './tank.service'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const data = await listTankInventory()
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

export default router
