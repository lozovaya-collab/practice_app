import type { User } from './models/users'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT: string
      PG_HOST: string
      PG_PORT: string
      PG_USER: string
      PG_PASSWORD: string
      PG_DB_NAME: string
      SESSION_SECRET: string
      SESSION_MAX_AGE: string
      PASSWORD_SALT: string
      SPACE_ROUTE: string
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: User
  }
}

// import { Api } from './swagger'
import { config } from 'dotenv'
config()

import('./server')
