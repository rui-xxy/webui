import { pool } from '../../db/pool'
import type { TankRecord } from './tank.types'

// ACID_TYPE_MAP 和 generateCaseWhen 已不再需要，因为我们现在直接从 materials 表中获取信息

const TANK_QUERY = `
  SELECT
    s.tank_id,
    s.tank_name,
    mt.name as category_title,  -- 从 materials 表获取名称
    s.material_id as category_id, -- 使用 material_id 作为 category_id
    s.material_id as category_sort_order, -- 使用 material_id 作为排序依据 (materials 表未设置单独排序字段前)
    s.capacity as total_capacity,
    COALESCE(m.level_percent, 0) as level_percent,
    s.material_id as tank_sort_order, -- 使用 material_id 作为 tank_sort_order
    COALESCE(m.recorded_at, s.updated_at) as updated_at
  FROM tanks s
  LEFT JOIN materials mt ON s.material_id = mt.id -- 新增的 JOIN
  LEFT JOIN (
    SELECT DISTINCT ON (tank_id)
      tank_id,
      level_percent,
      recorded_at
    FROM tank_readings
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
    levelPercent: Number(row.level_percent),
    tankSortOrder: row.tank_sort_order,
    updatedAt: new Date(row.updated_at)
  }))
}

