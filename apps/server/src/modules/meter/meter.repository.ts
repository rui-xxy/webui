import { pool } from '../../db/pool'

type MeterTableConfig = {
  table: 'meters' | 'utility_meters'
  idColumn: 'id' | 'meter_id'
  hasMultiplier: boolean
  hasUnit: boolean
  hasType: boolean
}

type DailyMeterUsageRow = {
  day: string
  meter_name: string
  usage: string | number
}

let meterTableConfigCache: MeterTableConfig | null = null

async function resolveMeterTableConfig(): Promise<MeterTableConfig> {
  if (meterTableConfigCache) return meterTableConfigCache

  const tableCheck = await pool.query<{
    meters: string | null
    utility_meters: string | null
  }>(
    "SELECT to_regclass('public.meters') AS meters, to_regclass('public.utility_meters') AS utility_meters"
  )

  const row = tableCheck.rows[0]
  const table: MeterTableConfig['table'] = row?.meters
    ? 'meters'
    : row?.utility_meters
      ? 'utility_meters'
      : 'meters'

  const columnCheck = await pool.query<{ column_name: string }>(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
    `,
    [table]
  )

  const columns = new Set(
    columnCheck.rows.map((col: { column_name: string }) => col.column_name)
  )
  const idColumn: MeterTableConfig['idColumn'] = columns.has('id')
    ? 'id'
    : columns.has('meter_id')
      ? 'meter_id'
      : 'id'

  const hasMultiplier = columns.has('multiplier')
  const hasUnit = columns.has('unit')
  const hasType = columns.has('type')

  meterTableConfigCache = { table, idColumn, hasMultiplier, hasUnit, hasType }
  return meterTableConfigCache
}

export async function findDailyElectricUsageByMeterNames(
  meterNames: string[],
  startDate: string,
  endDate: string
): Promise<{ date: string; meterName: string; usage: number }[]> {
  if (meterNames.length === 0) return []

  const { table: metersTable, idColumn, hasMultiplier } =
    await resolveMeterTableConfig()

  const multiplierExpression = hasMultiplier ? 'COALESCE(m.multiplier, 1)' : '1'

  const sql = `
    WITH daily_last AS (
      SELECT DISTINCT ON (mr.meter_id, mr.recorded_at::date)
        mr.meter_id,
        mr.recorded_at::date AS day,
        mr.reading_value,
        mr.is_reset
      FROM meter_readings mr
      JOIN ${metersTable} m ON m.${idColumn} = mr.meter_id
      WHERE m.name = ANY($1)
        AND mr.recorded_at::date BETWEEN $2::date AND ($3::date + 1)
      ORDER BY mr.meter_id, mr.recorded_at::date, mr.recorded_at DESC
    ),
    with_next AS (
      SELECT
        meter_id,
        day,
        reading_value,
        is_reset,
        LEAD(reading_value) OVER (PARTITION BY meter_id ORDER BY day) AS next_value,
        LEAD(is_reset) OVER (PARTITION BY meter_id ORDER BY day) AS next_is_reset
      FROM daily_last
    ),
    usage AS (
      SELECT
        meter_id,
        day,
        CASE
          WHEN next_value IS NULL THEN NULL
          WHEN next_is_reset OR next_value < reading_value THEN next_value
          ELSE next_value - reading_value
        END AS usage_value
      FROM with_next
    )
    SELECT
      u.day::text AS day,
      m.name AS meter_name,
      COALESCE(u.usage_value, 0) * ${multiplierExpression} AS usage
    FROM usage u
    JOIN ${metersTable} m ON m.${idColumn} = u.meter_id
    WHERE u.day BETWEEN $2::date AND $3::date
      AND m.name = ANY($1)
      AND u.usage_value IS NOT NULL
    ORDER BY u.day, m.name;
  `

  const result = await pool.query<DailyMeterUsageRow>(sql, [
    meterNames,
    startDate,
    endDate
  ])

  return result.rows.map((row: DailyMeterUsageRow) => ({
    date: row.day,
    meterName: row.meter_name,
    usage: Number(row.usage)
  }))
}

export async function findDailyUsageByMeterUnit(
  unitCandidates: string[],
  startDate: string,
  endDate: string
): Promise<{ date: string; meterName: string; usage: number }[]> {
  if (unitCandidates.length === 0) return []

  const { table: metersTable, idColumn, hasMultiplier, hasUnit } =
    await resolveMeterTableConfig()

  if (!hasUnit) {
    throw new Error('Meters table missing unit column; cannot query water meters.')
  }

  const multiplierExpression = hasMultiplier ? 'COALESCE(m.multiplier, 1)' : '1'

  const sql = `
    WITH selected_meters AS (
      SELECT
        m.${idColumn} AS meter_id,
        m.name AS meter_name,
        ${multiplierExpression} AS multiplier
      FROM ${metersTable} m
      WHERE btrim(m.unit) = ANY($1)
    ),
    daily_last AS (
      SELECT DISTINCT ON (mr.meter_id, mr.recorded_at::date)
        mr.meter_id,
        mr.recorded_at::date AS day,
        mr.reading_value,
        mr.is_reset
      FROM meter_readings mr
      JOIN selected_meters sm ON sm.meter_id = mr.meter_id
      WHERE mr.recorded_at::date BETWEEN $2::date AND ($3::date + 1)
      ORDER BY mr.meter_id, mr.recorded_at::date, mr.recorded_at DESC
    ),
    with_next AS (
      SELECT
        meter_id,
        day,
        reading_value,
        is_reset,
        LEAD(reading_value) OVER (PARTITION BY meter_id ORDER BY day) AS next_value,
        LEAD(is_reset) OVER (PARTITION BY meter_id ORDER BY day) AS next_is_reset
      FROM daily_last
    ),
    usage AS (
      SELECT
        meter_id,
        day,
        CASE
          WHEN next_value IS NULL THEN NULL
          WHEN next_is_reset OR next_value < reading_value THEN next_value
          ELSE next_value - reading_value
        END AS usage_value
      FROM with_next
    )
    SELECT
      u.day::text AS day,
      sm.meter_name AS meter_name,
      COALESCE(u.usage_value, 0) * sm.multiplier AS usage
    FROM usage u
    JOIN selected_meters sm ON sm.meter_id = u.meter_id
    WHERE u.day BETWEEN $2::date AND $3::date
      AND u.usage_value IS NOT NULL
    ORDER BY u.day, sm.meter_name;
  `

  const result = await pool.query<DailyMeterUsageRow>(sql, [
    unitCandidates,
    startDate,
    endDate
  ])

  return result.rows.map((row: DailyMeterUsageRow) => ({
    date: row.day,
    meterName: row.meter_name,
    usage: Number(row.usage)
  }))
}
