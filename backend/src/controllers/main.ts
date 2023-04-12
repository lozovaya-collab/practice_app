import type {
  UserValidateError,
  UserAuthorizationFailed,
  UserNotAuthorized,
} from '@/types'
import type { User, UserCreateParams } from '@models/users'
import type { InternalServerErrorResponse } from '@/types'

import {
  Body,
  Controller,
  Post,
  Route,
  Response,
  Tags,
  SuccessResponse,
  Security,
  Get,
  Header,
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

@Route('')
@Tags('Auth')
export class MainController extends Controller {
  private userService: UsersService

  constructor() {
    super()
    this.userService = new UsersService()
  }

  /**
   * Авторизация
   * @summary login
   */
  @Post('/login')
  @Response<UserValidateError>(
    RESPONSE_DEFAULT_422_STATUS,
    RESPONSE_DEFAULT_422.error.message,
  )
  @Response<UserAuthorizationFailed>(
    RESPONSE_DEFAULT_403_STATUS,
    RESPONSE_DEFAULT_403.error.message,
  )
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  @Response<User>(200)
  public login(@Body() body: UserCreateParams): Promise<User> {
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

      this.userService
        .login({
          login: body.login,
          password: password.hashPassword(body.password),
        })
        .then((user) =>
          user === null
            ? rej({
                status: 403,
                error: {
                  message: 'Authorization failed',
                },
              })
            : res(user),
        )
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }

  /**
   * Выход
   * @summary logout
   */
  @Post('/logout')
  @SuccessResponse(RESPONSE_DEFAULT_204_STATUS, RESPONSE_DEFAULT_204.message)
  @Response<InternalServerErrorResponse>(
    RESPONSE_DEFAULT_500_STATUS,
    RESPONSE_DEFAULT_500.error.message,
  )
  public logout(): void {}

  /**
   * Профиль
   * @summary me
   */
  @Get('/me')
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
  public async getById(@Header('cookie') ssid: number): Promise<User> {
    return new Promise((res, rej) => {
      this.userService
        .getById(ssid)
        .then((result) => (result ? res(result) : rej(RESPONSE_DEFAULT_500)))
        .catch((err) => {
          console.error(err)
          rej(RESPONSE_DEFAULT_500)
        })
    })
  }
}
