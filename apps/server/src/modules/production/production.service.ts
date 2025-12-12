import { getFlowOutSum, getStockAt } from './production.repository'
import type { DailyProduction } from './production.types'

const MATERIALS = {
  acid98: { materialId: 1, concentration: 98 },
  fumingAcid: { materialId: 2, concentration: 105 },
  reagentAcid: { materialId: 3, concentration: 93 }
} as const

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

export async function listDailyProductionTrend(
  startDate: string,
  endDate: string
): Promise<DailyProduction[]> {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)

  if (!start || !end || start > end) {
    return []
  }

  const results: DailyProduction[] = []
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

    const [start98, end98, flow98] = await Promise.all([
      getStockAt(MATERIALS.acid98.materialId, windowStartStr),
      getStockAt(MATERIALS.acid98.materialId, windowEndStr),
      getFlowOutSum(MATERIALS.acid98.materialId, windowStartStr, windowEndStr)
    ])

    const [startFy, endFy, flowFy] = await Promise.all([
      getStockAt(MATERIALS.fumingAcid.materialId, windowStartStr),
      getStockAt(MATERIALS.fumingAcid.materialId, windowEndStr),
      getFlowOutSum(
        MATERIALS.fumingAcid.materialId,
        windowStartStr,
        windowEndStr
      )
    ])

    const [startJp, endJp, flowJp] = await Promise.all([
      getStockAt(MATERIALS.reagentAcid.materialId, windowStartStr),
      getStockAt(MATERIALS.reagentAcid.materialId, windowEndStr),
      getFlowOutSum(
        MATERIALS.reagentAcid.materialId,
        windowStartStr,
        windowEndStr
      )
    ])

    const acid98 = end98 - start98 + flow98
    const fumingAcid = endFy - startFy + flowFy
    const reagentAcid = endJp - startJp + flowJp

    const totalRaw = acid98 + fumingAcid + reagentAcid
    const total98Equivalent =
      acid98 +
      (fumingAcid * MATERIALS.fumingAcid.concentration) /
        MATERIALS.acid98.concentration +
      reagentAcid

    results.push({
      date: formatDateKey(current),
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      acid98: Number(acid98.toFixed(2)),
      fumingAcid: Number(fumingAcid.toFixed(2)),
      reagentAcid: Number(reagentAcid.toFixed(2)),
      totalRaw: Number(totalRaw.toFixed(2)),
      total98Equivalent: Number(total98Equivalent.toFixed(2))
    })

    current.setDate(current.getDate() + 1)
  }

  return results
}
