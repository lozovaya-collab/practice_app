import { Pool } from 'pg'

let pool: Pool | null = null

const getPool = (): Pool => {
  if (!pool)
    pool = new Pool({
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB_NAME,
      port: parseInt(process.env.PG_PORT),
    })
      .on('connect', (session) => {
        console.log('💅 connect to database')
        session.on('error', (error) => {
          console.error(error)
          pool = null
        })
      })
      .on('error', (error) => {
        console.error(error)
        pool = null
      })

  return pool
}

export { getPool }
