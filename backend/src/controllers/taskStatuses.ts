import type {
  TaskStatusesValidateError,
  UserNotAuthorized,
  InternalServerErrorResponse,
  QueryParamsValidateError,
} from '@/types'
import { TaskStatuses, TaskStatusesCreateParams } from '@/models/task'

import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  Security,
  Response,
  Tags,
  Delete,
  SuccessResponse,
} from 'tsoa'

import {
  RESPONSE_DEFAULT_204_STATUS,
  RESPONSE_DEFAULT_204,
  RESPONSE_DEFAULT_401_STATUS,
  RESPONSE_DEFAULT_401,
  RESPONSE_DEFAULT_403_STATUS,
  RESPONSE_DEFAULT_403,
  RESPONSE_DEFAULT_422_STATUS,
  RESPONSE_DEFAULT_422,
  RESPONSE_DEFAULT_500_STATUS,
  RESPONSE_DEFAULT_500,
} from '@/constants'
import { TaskStatusesService } from '@/services'

@Route('task-statuses')
@Tags('TaskSatuses')
export class TaskStatuesController extends Controller {
  private service: TaskStatusesService

  constructor() {
    super()
    this.service = new TaskStatusesService()
  }

  /**
   * Получение всех статусов
   * @summary get
   */
  @Get()
  @Security('session')
  @Response<TaskStatuses[]>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public async getAll(): Promise<TaskStatuses[]> {
    return new Promise((res, rej) => {
      this.service
        .getAll()
        .then((result) => (result ? res(result) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Получение статуса по id
   * @summary get By Id
   */
  @Get('/{id}')
  @Security('session')
  @Response<TaskStatuses>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<QueryParamsValidateError>(
    RESPONSE_DEFAULT_422_STATUS,
    RESPONSE_DEFAULT_422.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public async getById(@Path() id: string): Promise<TaskStatuses | null> {
    return new Promise((res, rej) => {
      this.service
        .getById(parseInt(id))
        .then((result) =>
          result === false
            ? res(null)
            : result
            ? res(result)
            : rej(RESPONSE_DEFAULT_500),
        )
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Создание статуса
   * @summary create
   */
  @Post()
  @Tags('Auth')
  @Response<TaskStatuses>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<TaskStatusesValidateError>(
    RESPONSE_DEFAULT_422_STATUS,
    RESPONSE_DEFAULT_422.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public create(@Body() body: TaskStatusesCreateParams): Promise<TaskStatuses> {
    return new Promise((res, rej) => {
      if (!body.name) {
        rej({
          status: 422,
          error: {
            message: 'Validation failed',
            details: {
              name: !!body.name,
            },
          },
        })
        return
      }

      this.service
        .create(body)
        .then((result) => (result ? res(result) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Удаление статуса
   * @summary delete
   */
  @Delete('/{id}')
  @SuccessResponse(RESPONSE_DEFAULT_204_STATUS, RESPONSE_DEFAULT_204.message)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public delete(@Body() id: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.service
        .delete(parseInt(id))
        .then((result) => (result ? res(true) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }
}
