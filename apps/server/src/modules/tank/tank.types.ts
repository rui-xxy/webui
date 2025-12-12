export interface TankRecord {
  tankId: string
  categoryId: number
  categoryTitle: string
  categorySortOrder: number
  tankName: string
  totalCapacity: number
  levelPercent: number // Renamed from currentVolume to levelPercent
  tankSortOrder: number
  updatedAt: Date
}

export interface TankCategory {
  title: string
  tanks: TankSummary[]
}

export interface TankSummary {
  id: string
  name: string
  total: number
  current: number
  percentage: number
  updatedAt: string
}
