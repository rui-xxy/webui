export interface DailyProduction {
  date: string
  windowStart: string
  windowEnd: string
  acid98: number
  reagentAcid: number
  fumingAcid: number
  totalRaw: number
  total98Equivalent: number
}

export interface ProductionTrendResponse {
  data: DailyProduction[]
}

