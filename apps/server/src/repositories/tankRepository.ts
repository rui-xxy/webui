import { pool } from '../db/pool'
import type { TankRecord } from '../types/tank'

const TANK_QUERY = `
  SELECT
    s.tank_id,
    s.tank_name,
    s.acid_type as category_title,
    CASE s.acid_type
      WHEN '98酸' THEN 1
      WHEN '发烟硫酸' THEN 2
      WHEN '试剂酸' THEN 3
      ELSE 4
    END as category_id,
    CASE s.acid_type
      WHEN '98酸' THEN 1
      WHEN '发烟硫酸' THEN 2
      WHEN '试剂酸' THEN 3
      ELSE 4
    END as category_sort_order,
    s.capacity as total_capacity,
    COALESCE(m.current_volume, 0) as current_volume,
    CASE s.acid_type
      WHEN '98酸' THEN 1
      WHEN '发烟硫酸' THEN 2
      WHEN '试剂酸' THEN 3
      ELSE 4
    END as tank_sort_order,
    COALESCE(m.recorded_at, s.updated_at) as updated_at
  FROM storage_tanks s
  LEFT JOIN (
    SELECT DISTINCT ON (tank_id)
      tank_id,
      current_volume,
      recorded_at
    FROM tank_monitoring_data
    ORDER BY tank_id, recorded_at DESC
  ) m ON s.tank_id = m.tank_id
  ORDER BY category_sort_order, category_id, tank_sort_order, s.tank_id;
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
