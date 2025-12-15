import { getWorkTaskSummary, listWorkTaskDepartments, listWorkTasks } from './work-task.repository'
import type { WorkTaskRecord, WorkTaskSummary } from './work-task.types'

export async function listWorkTasksService(options: {
  department?: string
  status?: string
  limit?: number
  offset?: number
}): Promise<WorkTaskRecord[]> {
  const limit = Math.min(2000, Math.max(1, options.limit ?? 200))
  const offset = Math.max(0, options.offset ?? 0)

  return listWorkTasks({
    department: options.department,
    status: options.status,
    limit,
    offset
  })
}

export async function listDepartmentsService(): Promise<string[]> {
  return listWorkTaskDepartments()
}

export async function getSummaryService(options?: {
  department?: string
}): Promise<WorkTaskSummary> {
  const summary = await getWorkTaskSummary({ department: options?.department })
  return summary
}

