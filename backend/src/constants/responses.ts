import type {
  InternalServerErrorResponse,
  UserNotAuthorized,
  UserValidateError,
  UserAuthorizationFailed,
  NoContent,
} from '@/types'

export const RESPONSE_DEFAULT_204_STATUS = 204
export const RESPONSE_DEFAULT_204: {
  status: 204
  message: NoContent
} = {
  status: RESPONSE_DEFAULT_204_STATUS,
  message: 'No Content',
}

export const RESPONSE_DEFAULT_401_STATUS = 401
export const RESPONSE_DEFAULT_401: {
  status: 401
  error: UserNotAuthorized
} = {
  status: RESPONSE_DEFAULT_401_STATUS,
  error: { message: 'User not authorized' },
}

export const RESPONSE_DEFAULT_403_STATUS = 403
export const RESPONSE_DEFAULT_403: {
  status: 403
  error: UserAuthorizationFailed
} = {
  status: RESPONSE_DEFAULT_403_STATUS,
  error: { message: 'Authorization failed' },
}

export const RESPONSE_DEFAULT_422_STATUS = 422
export const RESPONSE_DEFAULT_422: {
  status: 422
  error: UserValidateError
} = {
  status: RESPONSE_DEFAULT_422_STATUS,
  error: {
    message: 'Validation failed',
    details: {
      login: false,
      password: false,
    },
  },
}

export const RESPONSE_DEFAULT_500_STATUS = 500
export const RESPONSE_DEFAULT_500: {
  status: 500
  error: InternalServerErrorResponse
} = {
  status: RESPONSE_DEFAULT_500_STATUS,
  error: { message: 'Internal Server Error' },
}
