import {
  findDailyElectricUsageByMeterNames,
  findDailyUsageByMeterUnit
} from './meter.repository'
import type { DailyElectricTotalPoint } from './meter.types'

const INCLUDED_IN_TOTAL = [
  '1#变压器',
  '2#变压器',
  '1#电机',
  '2#电机',
  '1#电炉',
  '2#电炉',
  '丰联变压器'
] as const

const SUBTRACT_FROM_TOTAL = ['安环部电表'] as const

function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildDateRange(start: Date, end: Date): string[] {
  const dates: string[] = []
  const cursor = new Date(start.getTime())
  while (cursor <= end) {
    dates.push(formatDateKey(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export async function listTotalElectricDailyUsage(
  startDate: string,
  endDate: string
): Promise<DailyElectricTotalPoint[]> {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end || start > end) return []

  const meterNames = [
    ...INCLUDED_IN_TOTAL,
    ...SUBTRACT_FROM_TOTAL
  ] as unknown as string[]

  const usageRows = await findDailyElectricUsageByMeterNames(
    meterNames,
    startDate,
    endDate
  )

  const pointsByDate = new Map<string, DailyElectricTotalPoint>()
  buildDateRange(start, end).forEach((dateKey) => {
    pointsByDate.set(dateKey, { date: dateKey, value: 0, meters: {} })
  })

  usageRows.forEach((row) => {
    const point = pointsByDate.get(row.date)
    if (!point) return
    point.meters[row.meterName] = row.usage
  })

  pointsByDate.forEach((point) => {
    const included = INCLUDED_IN_TOTAL.reduce(
      (sum, name) => sum + (point.meters[name] ?? 0),
      0
    )
    const subtract = SUBTRACT_FROM_TOTAL.reduce(
      (sum, name) => sum + (point.meters[name] ?? 0),
      0
    )
    point.value = Number((included - subtract).toFixed(2))
  })

  return Array.from(pointsByDate.values()).filter(
    (point) => Object.keys(point.meters).length > 0
  )
}

const WATER_UNIT_CANDIDATES = ['立方米', 'm3', 'M3', 'm³'] as const

export async function listTotalWaterDailyUsage(
  startDate: string,
  endDate: string
): Promise<DailyElectricTotalPoint[]> {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end || start > end) return []

  const usageRows = await findDailyUsageByMeterUnit(
    [...WATER_UNIT_CANDIDATES],
    startDate,
    endDate
  )

  const pointsByDate = new Map<string, DailyElectricTotalPoint>()
  buildDateRange(start, end).forEach((dateKey) => {
    pointsByDate.set(dateKey, { date: dateKey, value: 0, meters: {} })
  })

  usageRows.forEach((row) => {
    const point = pointsByDate.get(row.date)
    if (!point) return
    point.meters[row.meterName] = row.usage
  })

  pointsByDate.forEach((point) => {
    const total = Object.values(point.meters).reduce(
      (sum, value) => sum + value,
      0
    )
    point.value = Number(total.toFixed(2))
  })

  return Array.from(pointsByDate.values()).filter(
    (point) => Object.keys(point.meters).length > 0
  )
}
