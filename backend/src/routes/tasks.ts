import type { Response } from 'express'
import type {
  InternalServerErrorResponse,
  UserValidateError,
  UserNotAuthorized,
  UserAuthorizationFailed,
  QueryParamsValidateError,
  TaskFilter,
  TaskValidateError,
} from '@/types'
import type { Task } from '@models/task'
import { Router } from 'express'

import {
  RESPONSE_DEFAULT_401,
  RESPONSE_DEFAULT_403,
  RESPONSE_DEFAULT_422,
  RESPONSE_DEFAULT_500,
} from '@/constants'
import { TasksController } from '@/controllers'

const tasksRouter = Router()
const tasksController = new TasksController()

tasksRouter.get(
  '/',
  (
    { query, session },
    res: Response<
      | null
      | Task[]
      | TaskValidateError
      | UserNotAuthorized
      | InternalServerErrorResponse
    >,
  ) => {
    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
    } else {
      const filters: TaskFilter = {}
      const filterValidationErrors: TaskValidateError['details'] = {}

      if (query.author_id) {
        let tmp: number[] = []

        if (!Array.isArray(query.author_id)) {
          try {
            const str = query.author_id as string

            str
              .split(',')
              .forEach((el) => !isNaN(parseInt(el)) && tmp.push(parseInt(el)))
          } catch (e) {
            filterValidationErrors['author_id'] = true
            console.error(e)
          }
        } else {
          try {
            query.author_id.forEach(
              (el) =>
                !isNaN(parseInt(el as string)) &&
                tmp.push(parseInt(el as string)),
            )
          } catch (e) {
            filterValidationErrors['author_id'] = true
            console.error(e)
          }
        }
        filters.author_id = tmp
      }
      if (query.status_id) {
        let tmp: number[] = []

        if (!Array.isArray(query.status_id)) {
          try {
            const str = query.status_id as string

            str
              .split(',')
              .forEach((el) => !isNaN(parseInt(el)) && tmp.push(parseInt(el)))
          } catch (e) {
            filterValidationErrors['status_id'] = true
            console.error(e)
          }
        } else {
          try {
            query.status_id.forEach(
              (el) =>
                !isNaN(parseInt(el as string)) &&
                tmp.push(parseInt(el as string)),
            )
          } catch (e) {
            filterValidationErrors['author_id'] = true
            console.error(e)
          }
        }
        filters.status_id = tmp
      }

      if (Object.values(filterValidationErrors).length > 0) {
        res.status(RESPONSE_DEFAULT_422.status).json({
          message: 'Validation failed',
          details: filterValidationErrors,
        })
        return
      }

      tasksController
        .getAll(filters.author_id, filters.status_id)
        .then((task) => res.status(200).json(task))
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

tasksRouter.get(
  '/:id',
  (
    { params: { id }, session },
    res: Response<
      | Task
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

    tasksController
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

tasksRouter.post(
  '/',
  (
    { body, session },
    res: Response<
      Task | TaskValidateError | UserNotAuthorized | InternalServerErrorResponse
    >,
  ) => {
    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
      return
    }

    if (isNaN(parseInt(body.status_id))) {
      res
        .status(RESPONSE_DEFAULT_422.status)
        .json({ message: 'Validation failed', details: { status_id: false } })
      return
    }

    tasksController
      .create(body, session.user.id)
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

tasksRouter.put(
  '/:id',
  (
    { params, body, session },
    res: Response<
      Task | TaskValidateError | UserNotAuthorized | InternalServerErrorResponse
    >,
  ) => {
    if (!session.user) {
      res.status(RESPONSE_DEFAULT_401.status).json(RESPONSE_DEFAULT_401.error)
      return
    }

    if (isNaN(parseInt(params.id))) {
      res
        .status(RESPONSE_DEFAULT_422.status)
        .json({ message: 'Validation failed', details: { id: false } })
      return
    }

    tasksController
      .update(parseInt(params.id), body, session.user.id)
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

tasksRouter.delete(
  '/:id',
  (
    { params: { id }, session },
    res: Response<
      | InternalServerErrorResponse
      | UserNotAuthorized
      | UserAuthorizationFailed
      | QueryParamsValidateError
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

    tasksController
      .delete(id, session.user.id)
      .then(() => res.sendStatus(204))
      .catch((err) => {
        err.status
          ? res.status(err.status).json(err.error)
          : res
              .status(RESPONSE_DEFAULT_500.status)
              .json(RESPONSE_DEFAULT_500.error)
      })
  },
)

export { tasksRouter }
