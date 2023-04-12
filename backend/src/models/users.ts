export interface User {
  id: number
  login: string
}

export interface UserWithPassword extends User {
  password: string
}

export type UserCreateParams = Omit<UserWithPassword, 'id'>
