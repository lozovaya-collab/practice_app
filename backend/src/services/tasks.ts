import type { Pool, QueryResult } from 'pg'
import type { Task, TaskCreateParams, TaskUpdateParams } from '@models/task'
import type { TaskFilter } from '@/types'

import { getPool } from './pg'

export class TaskService {
  private pool: Pool

  constructor() {
    this.pool = getPool()
  }

  public async getAll(params?: TaskFilter): Promise<Task[] | null> {
    try {
      const paramsQuery: string[] = []
      const paramsValues: any[] = []

      if (params && Object.values(params).filter((val) => !!val).length > 0) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            paramsQuery.push(
              `t.${key} = ANY($${paramsQuery.length + 1}::int[])`,
            )
            paramsValues.push(value)
          }
        })
      }

      console.debug(paramsQuery)

      const { rows }: QueryResult<Task> = await this.pool.query(
        `select
          t.*
        from
          tasks as t
        ${
          paramsQuery.length > 0
            ? `where ${paramsQuery.join(' and ').trim()}`
            : ''
        }
        order by id desc`,
        paramsValues,
      )

      return rows
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async getById(id: number): Promise<Task | false | null> {
    try {
      const { rows }: QueryResult<Task> = await this.pool.query(
        `select
          t.*
        from
          tasks as t
        where
          t.id = $1`,
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

  public async create(task: TaskCreateParams): Promise<Task | null> {
    try {
      const { rows }: QueryResult<Task> = await this.pool.query(
        `insert into
          tasks (title, description, status_id, author_id)
        values
          ($1, $2, $3, $4)
        returning *`,
        [task.title, task.description, task.status_id, task.author_id],
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

  public async update(
    task: TaskUpdateParams,
    author_id: number,
  ): Promise<Task | null | false> {
    try {
      if (task && Object.values(task).filter((val) => !!val).length > 0) {
        const {
          rows: [taskInDB],
        }: QueryResult<Task> = await this.pool.query(
          `select
            t.author_id
          from
            tasks as t
          where
            t.id = $1`,
          [task.id],
        )

        if (!taskInDB || taskInDB.author_id !== author_id) {
          return false
        }

        const paramsQuery: string[] = []
        const paramsValues: any[] = []

        const tmp = { ...task, id: undefined }

        Object.entries(tmp).forEach(([key, value]) => {
          if (value !== undefined) {
            paramsQuery.push(`${key} = $${paramsQuery.length + 2}`)
            paramsValues.push(value)
          }
        })

        const { rows }: QueryResult<Task> = await this.pool.query(
          `update
            tasks
          set
            update_date = now()${paramsQuery.length > 0 ? ',' : ''}
            ${paramsQuery.join(', ')}
          where
            id = $1
          returning *`,
          [task.id, ...paramsValues],
        )

        if (!rows[0]) {
          return null
        }

        return rows[0]
      } else {
        return null
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async delete(id: number, author_id: number): Promise<boolean> {
    try {
      const {
        rows: [taskInDB],
      }: QueryResult<Task> = await this.pool.query(
        `select
            t.author_id
          from
            tasks as t
          where
            t.id = $1`,
        [id],
      )

      if (!taskInDB || taskInDB.author_id !== author_id) {
        return false
      }

      await this.pool.query(
        `delete from
          tasks
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
