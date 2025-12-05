import { findTankInventory } from '../repositories/tankRepository'
import type { TankCategory, TankSummary } from '../types/tank'

export async function listTankInventory(): Promise<TankCategory[]> {
  const records = await findTankInventory()
  const categories = new Map<number, TankCategory>()

  records.forEach((record) => {
    if (!categories.has(record.categoryId)) {
      categories.set(record.categoryId, {
        title: record.categoryTitle,
        tanks: []
      })
    }

    const percentage =
      record.totalCapacity > 0
        ? Number(((record.currentVolume / record.totalCapacity) * 100).toFixed(2))
        : 0

    const tank: TankSummary = {
      id: record.tankId,
      name: record.tankName,
      total: record.totalCapacity,
      current: record.currentVolume,
      percentage,
      updatedAt: record.updatedAt.toISOString()
    }

    categories.get(record.categoryId)?.tanks.push(tank)
  })

  return Array.from(categories.values())
}
