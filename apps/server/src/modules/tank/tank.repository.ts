import { pool } from '../../db/pool'
import type { TankBasic, TankRecord } from './tank.types'

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

const TANK_BASICS_QUERY = `
  SELECT tank_id, tank_name
  FROM tanks
  ORDER BY tank_id;
`

const TANK_LEVEL_HISTORY_QUERY = `
  WITH bucketed AS (
    SELECT
      to_timestamp(floor(extract(epoch from recorded_at) / ($3 * 60)) * ($3 * 60)) AS bucket,
      tank_id,
      AVG(level_percent)::float AS level_percent
    FROM tank_readings
    WHERE recorded_at >= $1 AND recorded_at <= $2
    GROUP BY bucket, tank_id
  )
  SELECT
    bucket,
    jsonb_object_agg(tank_id, level_percent) AS levels
  FROM bucketed
  GROUP BY bucket
  ORDER BY bucket ASC
  LIMIT $4;
`

const TANK_READING_MIN_TS_QUERY = `
  SELECT MIN(recorded_at) AS min_recorded_at
  FROM tank_readings;
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

export async function findTankBasics(): Promise<TankBasic[]> {
  const result = await pool.query(TANK_BASICS_QUERY)

  return result.rows.map((row) => ({
    id: row.tank_id,
    name: row.tank_name
  }))
}

export async function findTankLevelHistory(options: {
  start: Date
  end: Date
  bucketMinutes: number
  limit: number
}): Promise<{ timestamp: string; levels: Record<string, number> }[]> {
  const result = await pool.query(TANK_LEVEL_HISTORY_QUERY, [
    options.start,
    options.end,
    options.bucketMinutes,
    options.limit
  ])

  return result.rows.map((row) => {
    const rawLevels = (row.levels ?? {}) as Record<string, unknown>
    const levels: Record<string, number> = {}

    Object.entries(rawLevels).forEach(([tankId, value]) => {
      levels[tankId] = Number(value ?? 0)
    })

    return {
      timestamp: new Date(row.bucket).toISOString(),
      levels
    }
  })
}

export async function findTankReadingsMinRecordedAt(): Promise<Date | null> {
  const result = await pool.query(TANK_READING_MIN_TS_QUERY)
  const min = result.rows?.[0]?.min_recorded_at
  if (!min) return null
  return new Date(min)
}

