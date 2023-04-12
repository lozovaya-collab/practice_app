import type { Pool, QueryResult } from 'pg'
import type { TaskStatuses, TaskStatusesCreateParams } from '@models/task'

import { getPool } from './pg'

export class TaskStatusesService {
  protected pool: Pool

  constructor() {
    this.pool = getPool()
  }

  public async getAll(): Promise<TaskStatuses[] | null> {
    try {
      const { rows }: QueryResult<TaskStatuses> = await this.pool.query(
        `select
          *
        from
          task_statuses
        order by id desc`,
      )

      return rows
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async getById(id: number): Promise<TaskStatuses | false | null> {
    try {
      const { rows }: QueryResult<TaskStatuses> = await this.pool.query(
        `select
          ts.*
        from
          task_statuses as ts
        where
          ts.id = $1`,
        [id],
      )

      if (!rows[0]) {
        return false
      }

      return rows[0]
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async create(
    task: TaskStatusesCreateParams,
  ): Promise<TaskStatuses | null> {
    try {
      const { rows }: QueryResult<TaskStatuses> = await this.pool.query(
        `insert into
          task_statuses (name)
        values
          ($1)
        returning *`,
        [task.name],
      )

      if (!rows[0]) {
        return null
      }

      return rows[0]
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      await this.pool.query(
        `delete from
          task_statuses
        where
          id = $1`,
        [id],
      )

      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}
