import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import expressSession from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import cors from 'cors'

import { router } from '@/routes'
import { getPool } from '@services/pg'

const app = express()
const pgSession = connectPgSimple(expressSession)
const pool = getPool()

app.use(express.json())
app.use(morgan('tiny'))
app.use('/static', express.static('public'))
app.use(bodyParser.json())
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(
  expressSession({
    store: new pgSession({
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
    saveUninitialized: false,
  }),
)

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: process.env.SPACE_ROUTE + '/static/swagger.json',
    },
  }),
)

app.use(router)

app.listen(process.env.PORT, () => {
  console.log('🤯 Server is running on port', process.env.PORT)
})
