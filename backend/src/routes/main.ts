import type { Response } from 'express'
import type {
  UserNotAuthorized,
  InternalServerErrorResponse,
  UserValidateError,
  UserAuthorizationFailed,
} from '@/types'
import type { User } from '@models/users'

import { Router } from 'express'

import { RESPONSE_DEFAULT_500, RESPONSE_DEFAULT_401 } from '@/constants'
import { MainController } from '@/controllers'

const mainRouter = Router()
const mainController = new MainController()

mainRouter.get(
  '/me',
  (
    { session },
    res: Response<User | InternalServerErrorResponse | UserNotAuthorized>,
  ) => {
    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
    } else {
      mainController
        .getById(session.user.id)
        .then((user) => {
          session.user = user
          res.status(200).json(user)
        })
        .catch((err) => {
          err.status
            ? res.status(err.status).json(err.error)
            : res
                .status(RESPONSE_DEFAULT_500.status)
                .json(RESPONSE_DEFAULT_500.error)
        })
    }
  },
)

mainRouter.post(
  '/login',
  (
    { body, session },
    res: Response<
      | User
      | InternalServerErrorResponse
      | UserAuthorizationFailed
      | UserValidateError
    >,
  ) => {
    if (session.user) {
      res.status(200).json(session.user)
    } else {
      mainController
        .login(body)
        .then((user) => {
          session.user = user
          res.status(200).json(user)
        })
        .catch((err) => {
          err.status
            ? res.status(err.status).json(err.error)
            : res
                .status(RESPONSE_DEFAULT_500.status)
                .json(RESPONSE_DEFAULT_500.error)
        })
    }
  },
)

mainRouter.post('/logout', ({ session }, res) => {
  res.sendStatus(204)
  session.destroy(() => {})
})

export { mainRouter }
