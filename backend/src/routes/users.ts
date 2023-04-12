import type { Response } from 'express'
import type {
  InternalServerErrorResponse,
  UserValidateError,
  UserNotAuthorized,
  UserAuthorizationFailed,
  QueryParamsValidateError,
} from '@/types'
import type { User } from '@models/users'
import { Router } from 'express'

import {
  RESPONSE_DEFAULT_401,
  RESPONSE_DEFAULT_403,
  RESPONSE_DEFAULT_422,
  RESPONSE_DEFAULT_500,
} from '@/constants'
import { UsersController } from '@/controllers'

const userRouter = Router()
const userController = new UsersController()

userRouter.get(
  '/',
  (_, res: Response<User[] | InternalServerErrorResponse>) => {
    userController
      .getAll()
      .then((users) => res.status(200).json(users))
      .catch((err) => {
        err.status
          ? res.status(err.status).json(err.error)
          : res
              .status(RESPONSE_DEFAULT_500.status)
              .json(RESPONSE_DEFAULT_500.error)
      })
  },
)

userRouter.get(
  '/:id',
  (
    { params: { id }, session },
    res: Response<
      | User
      | InternalServerErrorResponse
      | UserNotAuthorized
      | QueryParamsValidateError
      | null
    >,
  ) => {
    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
      return
    }

    if (isNaN(parseInt(id))) {
      res
        .status(RESPONSE_DEFAULT_422.status)
        .json({ message: 'Validation failed', details: { id: false } })
      return
    }

    userController
      .getById(id)
      .then((user) => res.status(200).json(user))
      .catch((err) => {
        err.status
          ? res.status(err.status).json(err.error)
          : res
              .status(RESPONSE_DEFAULT_500.status)
              .json(RESPONSE_DEFAULT_500.error)
      })
  },
)

userRouter.post(
  '/',
  (
    { body, session },
    res: Response<UserValidateError | InternalServerErrorResponse | User>,
  ) => {
    userController
      .create(body)
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
  },
)

userRouter.delete(
  '/:id',
  (
    { params: { id }, session },
    res: Response<
      | InternalServerErrorResponse
      | UserAuthorizationFailed
      | QueryParamsValidateError
    >,
  ) => {
    if (isNaN(parseInt(id))) {
      res
        .status(RESPONSE_DEFAULT_422.status)
        .json({ message: 'Validation failed', details: { id: false } })
      return
    }

    if (!session.user || session.user.id !== parseInt(id)) {
      res.status(RESPONSE_DEFAULT_403.status).json(RESPONSE_DEFAULT_403.error)
    } else {
      userController
        .delete(id)
        .then(() => {
          session.destroy(() => {})
          res.sendStatus(204)
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

export { userRouter }
