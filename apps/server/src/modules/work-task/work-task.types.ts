export type WorkTaskStatus = '进行中' | '已完成' | '延期' | '搁置' | (string & {})

export interface WorkTaskRecord {
  id: number
  taskName: string
  completionDescription: string | null
  department: string | null
  responsiblePerson: string | null
  status: WorkTaskStatus
  startTime: string | null
  completionTime: string | null
  remainingDays: string | null
  source: string | null
  createdAt: string
  updatedAt: string
}

export interface WorkTaskSummary {
  total: number
  byStatus: Record<string, number>
}

