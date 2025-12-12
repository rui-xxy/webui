import { findTankInventory } from './tank.repository'
import type { TankCategory, TankSummary } from './tank.types'

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

    const percentage = record.levelPercent; // levelPercent 现在就是百分比

    const current = record.totalCapacity > 0 // 根据百分比和总容量计算实际吨数
      ? Number(((percentage / 100) * record.totalCapacity).toFixed(2))
      : 0;

    const tank: TankSummary = {
      id: record.tankId,
      name: record.tankName,
      total: record.totalCapacity,
      current: current, // 现在是计算出的吨数
      percentage: percentage, // 现在是数据库中的百分比
      updatedAt: record.updatedAt.toISOString()
    }

    categories.get(record.categoryId)?.tanks.push(tank)
  })

  return Array.from(categories.values())
}
