export interface ErrorResponse {
  message: string
}

export type NoContent = 'No Content'

export interface InternalServerErrorResponse extends ErrorResponse {
  message: 'Internal Server Error'
}

export interface UserValidateError extends ErrorResponse {
  message: 'Validation failed'
  details: {
    login: boolean
    password: boolean
  }
}

export interface TaskStatusesValidateError extends ErrorResponse {
  message: 'Validation failed'
  details: {
    name: boolean
  }
}

export interface TaskValidateError extends ErrorResponse {
  message: 'Validation failed'
  details: {
    id?: boolean
    title?: boolean
    description?: boolean
    author_id?: boolean
    status_id?: boolean
  }
}

export interface QueryParamsValidateError extends ErrorResponse {
  message: 'Validation failed'
  details: {
    [param: string]: boolean
  }
}

export interface UserAuthorizationFailed extends ErrorResponse {
  message: 'Authorization failed'
}

export interface UserNotAuthorized extends ErrorResponse {
  message: 'User not authorized'
}
