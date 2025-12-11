import { pool } from '../../db/pool'
import type { TankRecord } from './tank.types'

const ACID_TYPE_MAP = {
  '98酸': { id: 1, sortOrder: 1 },
  '发烟硫酸': { id: 2, sortOrder: 2 },
  '试剂酸': { id: 3, sortOrder: 3 },
  // 添加更多酸类型及其对应的ID和排序权重
};

const generateCaseWhen = (field: 'id' | 'sortOrder') => {
  return Object.entries(ACID_TYPE_MAP)
    .map(([acidType, values]) => `WHEN '${acidType}' THEN ${values[field]}`)
    .join('\n      ');
};

const TANK_QUERY = `
  SELECT
    s.tank_id,
    s.tank_name,
    s.acid_type as category_title,
    CASE s.acid_type
      ${generateCaseWhen('id')}
      ELSE 4 -- Default ID if not matched
    END as category_id,
    CASE s.acid_type
      ${generateCaseWhen('sortOrder')}
      ELSE 4 -- Default sort order if not matched
    END as category_sort_order,
    s.capacity as total_capacity,
    COALESCE(m.current_volume, 0) as current_volume,
    CASE s.acid_type
      ${generateCaseWhen('sortOrder')} -- Using category_sort_order for tank_sort_order as well
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
