import type {
  UserValidateError,
  UserNotAuthorized,
  InternalServerErrorResponse,
  UserAuthorizationFailed,
  TaskValidateError,
} from '@/types'
import type { Task, TaskCreateParams, TaskUpdateParams } from '@models/task'
import type { TaskFilter } from '@/types'

import {
  Query,
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  Security,
  Response,
  Tags,
  Header,
  Delete,
  SuccessResponse,
  Put,
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
import { TaskService } from '@/services'

@Route('tasks')
@Tags('Tasks')
export class TasksController extends Controller {
  private service: TaskService

  constructor() {
    super()
    this.service = new TaskService()
  }

  /**
   * Получение всех задач с фильтрами
   * @summary get
   */
  @Get()
  @Security('session')
  @Response<Task[]>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<UserValidateError>(
    RESPONSE_DEFAULT_422_STATUS,
    RESPONSE_DEFAULT_422.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public async getAll(
    @Query() author_id?: TaskFilter['author_id'],
    @Query() status_id?: TaskFilter['status_id'],
  ): Promise<Task[]> {
    return new Promise((res, rej) => {
      this.service
        .getAll({
          author_id,
          status_id,
        })
        .then((result) => (result ? res(result) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Получение задачи по id
   * @summary get By Id
   */
  @Get('/{id}')
  @Security('session')
  @Response<Task>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public async getById(@Path() id: string): Promise<Task | null> {
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
   * Создание задачу
   * @summary create
   */
  @Post()
  @Response<Task>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<TaskValidateError>(
    RESPONSE_DEFAULT_422_STATUS,
    RESPONSE_DEFAULT_422.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public create(
    @Body() body: Omit<TaskCreateParams, 'author_id'>,
    @Header('cookie') author_id: number,
  ): Promise<Task> {
    return new Promise((res, rej) => {
      if (!body.title || body.title.length === 0 || !body.status_id) {
        rej({
          status: 422,
          error: {
            message: 'Validation failed',
            details: {
              title: true,
              status_id: !body.status_id ? true : undefined,
            },
          },
        })
        return
      }

      this.service
        .create({
          ...body,
          description:
            !!body.description && typeof body.description === 'string'
              ? body.description
              : null,
          author_id,
        })
        .then((result) => (result ? res(result) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Редактирование задачи
   * @summary update
   */
  @Put('/:id')
  @Response<Task>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<UserAuthorizationFailed>(
    RESPONSE_DEFAULT_403_STATUS,
    RESPONSE_DEFAULT_403.error.message,
  )
  @Response<TaskValidateError>(
    RESPONSE_DEFAULT_422_STATUS,
    RESPONSE_DEFAULT_422.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public update(
    @Path() id: number,
    @Body() body: Omit<TaskUpdateParams, 'id'>,
    @Header('cookie') author_id: number,
  ): Promise<Task> {
    return new Promise((res, rej) => {
      if (
        (body.title !== undefined && body.title.length === 0) ||
        !body.status_id
      ) {
        console.debug(body.title && body.title.length === 0)
        rej({
          status: 422,
          error: {
            message: 'Validation failed',
            details: {
              title:
                body.title !== undefined && body.title.length === 0
                  ? true
                  : undefined,
              status_id: !body.status_id ? true : undefined,
            },
          },
        })
        return
      }

      this.service
        .update({ id, ...body }, author_id)
        .then((result) =>
          result
            ? res(result)
            : result === false
            ? rej(RESPONSE_DEFAULT_403)
            : rej(RESPONSE_DEFAULT_500),
        )
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Удаление задачи. Удалить задачу может только он автор
   * @summary delete
   */
  @Delete('/{id}')
  @SuccessResponse(RESPONSE_DEFAULT_204_STATUS, RESPONSE_DEFAULT_204.message)
  @Response<UserAuthorizationFailed>(
    RESPONSE_DEFAULT_403_STATUS,
    RESPONSE_DEFAULT_403.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public delete(
    @Path() id: string,
    @Header('cookie') author_id: number,
  ): Promise<boolean> {
    return new Promise((res, rej) => {
      this.service
        .delete(parseInt(id), author_id)
        .then((result) =>
          result
            ? res(true)
            : result === false
            ? rej(RESPONSE_DEFAULT_403)
            : rej(RESPONSE_DEFAULT_500),
        )
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }
}
