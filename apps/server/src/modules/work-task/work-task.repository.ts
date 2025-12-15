import { pool } from '../../db/pool'
import type { WorkTaskRecord } from './work-task.types'

const WORK_TASK_LIST_QUERY = `
  SELECT
    id,
    task_name,
    completion_description,
    department,
    responsible_person,
    status,
    start_time,
    completion_time,
    remaining_days,
    source,
    created_at,
    updated_at
  FROM work_tasks
  WHERE
    ($1::text IS NULL OR department ILIKE '%' || $1 || '%')
    AND ($2::text IS NULL OR status = $2)
  ORDER BY updated_at DESC, id DESC
  LIMIT $3 OFFSET $4;
`

const WORK_TASK_DEPARTMENTS_QUERY = `
  WITH parts AS (
    SELECT trim(value) AS department
    FROM work_tasks, unnest(string_to_array(coalesce(department, ''), ',')) AS value
  )
  SELECT DISTINCT department
  FROM parts
  WHERE department <> ''
  ORDER BY department;
`

const WORK_TASK_SUMMARY_QUERY = `
  SELECT status, COUNT(*)::int AS cnt
  FROM work_tasks
  WHERE ($1::text IS NULL OR department ILIKE '%' || $1 || '%')
  GROUP BY status;
`

const toIsoOrNull = (value: unknown): string | null => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export async function listWorkTasks(options: {
  department?: string
  status?: string
  limit: number
  offset: number
}): Promise<WorkTaskRecord[]> {
  const department = options.department?.trim() || null
  const status = options.status?.trim() || null

  const result = await pool.query(WORK_TASK_LIST_QUERY, [
    department,
    status,
    options.limit,
    options.offset
  ])

  return result.rows.map((row) => ({
    id: Number(row.id),
    taskName: String(row.task_name ?? ''),
    completionDescription: row.completion_description ?? null,
    department: row.department ?? null,
    responsiblePerson: row.responsible_person ?? null,
    status: String(row.status ?? ''),
    startTime: toIsoOrNull(row.start_time),
    completionTime: toIsoOrNull(row.completion_time),
    remainingDays: row.remaining_days ?? null,
    source: row.source ?? null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  }))
}

export async function listWorkTaskDepartments(): Promise<string[]> {
  const result = await pool.query(WORK_TASK_DEPARTMENTS_QUERY)
  return result.rows.map((row) => String(row.department))
}

export async function getWorkTaskSummary(options?: {
  department?: string
}): Promise<{ total: number; byStatus: Record<string, number> }> {
  const department = options?.department?.trim() || null
  const result = await pool.query(WORK_TASK_SUMMARY_QUERY, [department])

  const byStatus: Record<string, number> = {}
  let total = 0

  result.rows.forEach((row) => {
    const status = String(row.status ?? '')
    const cnt = Number(row.cnt ?? 0)
    byStatus[status] = cnt
    total += cnt
  })

  return { total, byStatus }
}

