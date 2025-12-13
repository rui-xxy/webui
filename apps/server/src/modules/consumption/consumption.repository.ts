import { pool } from '../../db/pool'

export async function getMaterialStockAt(
  materialId: number,
  atTime: string
): Promise<number> {
  const result = await pool.query(
    `
      SELECT
        COALESCE(
          SUM(
            s.capacity
            * COALESCE(m.level_percent, 0) / 100.0
          ),
          0
        ) AS total_stock
      FROM tanks s
      LEFT JOIN LATERAL (
        SELECT level_percent
        FROM tank_readings tmd
        WHERE tmd.tank_id = s.tank_id
          AND tmd.recorded_at <= $1
        ORDER BY tmd.recorded_at DESC
        LIMIT 1
      ) m ON TRUE
      WHERE s.material_id = $2
    `,
    [atTime, materialId]
  )

  const value = result.rows[0]?.total_stock
  return value ? Number(value) : 0
}

export async function getMaterialFlowInSum(
  materialId: number,
  startTime: string,
  endTime: string
): Promise<number> {
  const result = await pool.query(
    `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN btrim(mf.unit) IN ('吨', 't', 'T', 'ton', 'tons')
                OR btrim(mf.unit) LIKE '%吨%'
              THEN mf.amount
              WHEN btrim(mf.unit) IN ('立方米', 'm3', 'M3', 'm³')
                OR btrim(mf.unit) LIKE '%方%'
                OR btrim(mf.unit) LIKE '%米%'
              THEN mf.amount * COALESCE(mat.density, 1)
              ELSE mf.amount
            END
          ),
          0
        ) AS flow_total
      FROM material_flows mf
      LEFT JOIN materials mat ON mat.id = mf.material_id
      WHERE mf.material_id = $1
        AND mf.occurred_at >= $2
        AND mf.occurred_at < $3
        AND (
          mf.flow_type = '采购入库'
          OR mf.flow_type ILIKE '%采购入库%'
        )
    `,
    [materialId, startTime, endTime]
  )

  const value = result.rows[0]?.flow_total
  return value ? Number(value) : 0
}
