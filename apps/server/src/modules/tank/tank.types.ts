export interface TankRecord {
  tankId: number
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
  id: number
  name: string
  total: number
  current: number
  percentage: number
  updatedAt: string
}
