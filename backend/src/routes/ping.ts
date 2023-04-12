import { Router } from 'express'

import { PingController } from '@/controllers'

const pingRouter = Router()
const controller = new PingController()

pingRouter.get('/', async (_, res) => {
  controller
    .getMessage()
    .then((response) => res.json(response))
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
})

export { pingRouter }
