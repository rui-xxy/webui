import { getMaterialFlowInSum, getMaterialStockAt } from './consumption.repository'
import type { DailyConsumptionPoint } from './consumption.types'

function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatTimestampLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export async function listHydrogenPeroxideDailyConsumption(
  startDate: string,
  endDate: string
): Promise<DailyConsumptionPoint[]> {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)

  if (!start || !end || start > end) {
    return []
  }

  const materialId = 4
  const results: DailyConsumptionPoint[] = []
  const current = new Date(start.getTime())

  while (current <= end) {
    const windowStart = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
      8,
      0,
      0,
      0
    )
    const windowEnd = new Date(windowStart.getTime() + 24 * 60 * 60 * 1000)

    const windowStartStr = formatTimestampLocal(windowStart)
    const windowEndStr = formatTimestampLocal(windowEnd)

    const [startStock, endStock, inflow] = await Promise.all([
      getMaterialStockAt(materialId, windowStartStr),
      getMaterialStockAt(materialId, windowEndStr),
      getMaterialFlowInSum(materialId, windowStartStr, windowEndStr)
    ])

    const consumption = startStock - endStock + inflow

    results.push({
      date: formatDateKey(current),
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      value: Number(consumption.toFixed(2))
    })

    current.setDate(current.getDate() + 1)
  }

  return results
}

