import type {
  UserValidateError,
  UserNotAuthorized,
  UserAuthorizationFailed,
  InternalServerErrorResponse,
} from '@/types'
import type { User, UserCreateParams } from '@models/users'

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
import { UsersService } from '@/services'
import { password } from '@/utils'

@Route('users')
@Tags('User')
export class UsersController extends Controller {
  private service: UsersService

  constructor() {
    super()
    this.service = new UsersService()
  }

  /**
   * Получение всех пользователей
   * @summary get
   */
  @Get()
  @Security('session')
  @Response<User[]>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public async getAll(): Promise<User[]> {
    return new Promise((res, rej) => {
      this.service
        .getAllUsers()
        .then((result) => (result ? res(result) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Получение пользователей по id
   * @summary get By Id
   */
  @Get('/{id}')
  @Security('session')
  @Response<User>(200)
  @Response<UserNotAuthorized>(
    RESPONSE_DEFAULT_401_STATUS,
    RESPONSE_DEFAULT_401.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public async getById(@Path() id: string): Promise<User | null> {
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
   * Создание пользователя
   * @summary create
   */
  @Post()
  @Tags('Auth')
  @Response<User>(200)
  @Response<UserValidateError>(
    RESPONSE_DEFAULT_422_STATUS,
    RESPONSE_DEFAULT_422.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public create(@Body() body: UserCreateParams): Promise<User> {
    return new Promise((res, rej) => {
      if (!body.password || !body.login) {
        rej({
          status: 422,
          error: {
            message: 'Validation failed',
            details: {
              login: !!body.login,
              password: !!body.password,
            },
          },
        })
        return
      }

      this.service
        .create({
          login: body.login,
          password: password.hashPassword(body.password),
        })
        .then((result) => (result ? res(result) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Удаление пользователя. Удалить пользователя может только он сам
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
  public delete(@Path() id: string): Promise<boolean> {
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
