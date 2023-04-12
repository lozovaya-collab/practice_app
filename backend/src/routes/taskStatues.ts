import type { Response } from 'express'
import type {
  InternalServerErrorResponse,
  UserValidateError,
  TaskStatusesValidateError,
  UserNotAuthorized,
  UserAuthorizationFailed,
  QueryParamsValidateError,
} from '@/types'
import type { User } from '@models/users'
import type { TaskStatuses } from '@/models/task'

import { Router } from 'express'

import {
  RESPONSE_DEFAULT_401,
  RESPONSE_DEFAULT_403,
  RESPONSE_DEFAULT_422,
  RESPONSE_DEFAULT_500,
} from '@/constants'
import { TaskStatuesController } from '@/controllers'

const taskStatuesRouter = Router()
const taskStatuesController = new TaskStatuesController()

taskStatuesRouter.get(
  '/',
  (
    { session },
    res: Response<
      TaskStatuses[] | UserNotAuthorized | InternalServerErrorResponse
    >,
  ) => {
    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
    } else {
      taskStatuesController
        .getAll()
        .then((taskStatues) => res.status(200).json(taskStatues))
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

taskStatuesRouter.get(
  '/:id',
  (
    { params: { id }, session },
    res: Response<
      | TaskStatuses
      | UserNotAuthorized
      | InternalServerErrorResponse
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

    taskStatuesController
      .getById(id)
      .then((task) => res.status(200).json(task))
      .catch((err) => {
        err.status
          ? res.status(err.status).json(err.error)
          : res
              .status(RESPONSE_DEFAULT_500.status)
              .json(RESPONSE_DEFAULT_500.error)
      })
  },
)

taskStatuesRouter.post(
  '/',
  (
    { body, session },
    res: Response<
      | TaskStatuses
      | TaskStatusesValidateError
      | UserNotAuthorized
      | InternalServerErrorResponse
      | User
    >,
  ) => {
    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
      return
    }

    taskStatuesController
      .create(body)
      .then((task) => {
        res.status(200).json(task)
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

taskStatuesRouter.delete(
  '/:id',
  (
    { params: { id }, session },
    res: Response<
      UserNotAuthorized | InternalServerErrorResponse | QueryParamsValidateError
    >,
  ) => {
    if (isNaN(parseInt(id))) {
      res
        .status(RESPONSE_DEFAULT_422.status)
        .json({ message: 'Validation failed', details: { id: false } })
      return
    }

    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
    } else {
      taskStatuesController
        .delete(id)
        .then(() => {
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

export { taskStatuesRouter }
