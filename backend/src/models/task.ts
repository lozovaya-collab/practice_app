export interface TaskStatuses {
  id: number
  name: string
}

export type TaskStatusesCreateParams = Omit<TaskStatuses, 'id'>

export interface Task {
  id: number
  status_id: number
  author_id: number
  created_date: string
  update_date: string
  title: string
  description: string | null
}

export type TaskCreateParams = Pick<
  Task,
  'title' | 'description' | 'status_id' | 'author_id'
>
export interface TaskUpdateParams {
  id: number
  title?: string
  description?: string
  status_id?: number
}
export interface TaskUpdateBodyParams {
  title?: string
  description?: string
}
