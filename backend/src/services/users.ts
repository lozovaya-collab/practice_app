import type { Pool, QueryResult } from 'pg'
import type { User, UserCreateParams } from '@models/users'

import { getPool } from './pg'

export class UsersService {
  private pool: Pool

  constructor() {
    this.pool = getPool()
  }

  public async getAllUsers(): Promise<User[] | null> {
    try {
      const { rows }: QueryResult<User> = await this.pool.query(
        `select
          u.id,
          u.login
        from
          users as u
        order by id desc`,
      )

      return rows
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async getById(id: number): Promise<User | false | null> {
    try {
      const { rows }: QueryResult<User> = await this.pool.query(
        `select
          u.id,
          u.login
        from
          users as u
        where
          u.id = $1`,
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

  public async create(user: UserCreateParams): Promise<User | null> {
    try {
      const { rows }: QueryResult<User> = await this.pool.query(
        `insert into
          users (login, password)
        values
          ($1, $2)
        returning id, login`,
        [user.login, user.password],
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
      // Удаляем полтзователя
      const {
        rows: [userId],
      }: QueryResult<{ id: number }> = await this.pool.query(
        `delete from
          users
        where
          id = $1`,
        [id],
      )

      // Удаляем сессию
      await this.pool.query(
        `delete from
          session as s
        where
          cast(s.sess->'user'->>'id' as int) = $1`,
        [userId],
      )

      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  public async login(user: UserCreateParams): Promise<User | null> {
    try {
      const { rows }: QueryResult<User> = await this.pool.query(
        `select
          u.id,
          u.login
        from
          users as u
        where
          u.login = $1 and
          u.password = $2`,
        [user.login, user.password],
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
}
