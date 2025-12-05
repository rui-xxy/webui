import { pool } from '../db/pool'
import type { TankRecord } from '../types/tank'

const TANK_QUERY = `
  SELECT
    category_id,
    category_title,
    COALESCE(category_sort_order, 0) AS category_sort_order,
    tank_id,
    tank_name,
    total_capacity,
    current_volume,
    COALESCE(tank_sort_order, 0) AS tank_sort_order,
    updated_at
  FROM vw_storage_tank_inventory
  ORDER BY category_sort_order, category_id, tank_sort_order, tank_id;
`

export async function findTankInventory(): Promise<TankRecord[]> {
  const result = await pool.query(TANK_QUERY)

  return result.rows.map((row) => ({
    tankId: row.tank_id,
    categoryId: row.category_id,
    categoryTitle: row.category_title,
    categorySortOrder: row.category_sort_order,
    tankName: row.tank_name,
    totalCapacity: Number(row.total_capacity),
    currentVolume: Number(row.current_volume),
    tankSortOrder: row.tank_sort_order,
    updatedAt: new Date(row.updated_at)
  }))
}
