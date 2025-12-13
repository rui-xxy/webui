export interface DailyConsumptionPoint {
  date: string
  windowStart: string
  windowEnd: string
  value: number
}

export interface ConsumptionTrendResponse {
  data: DailyConsumptionPoint[]
}

