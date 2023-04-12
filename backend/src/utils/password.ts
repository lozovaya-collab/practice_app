import { pbkdf2Sync } from 'node:crypto'

export const hashPassword = (password: string) => {
  return pbkdf2Sync(
    password,
    process.env.PASSWORD_SALT,
    1000,
    64,
    'sha512',
  ).toString('hex')
}

export const validatePassword = (password: string, hash: string) => {
  return (
    hash ===
    pbkdf2Sync(
      password,
      process.env.PASSWORD_SALT,
      1000,
      64,
      'sha512',
    ).toString('hex')
  )
}
