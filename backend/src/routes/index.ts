import { Router } from 'express'

import { pingRouter } from './ping'
import { mainRouter } from './main'
import { userRouter } from './users'
import { taskStatuesRouter } from './taskStatues'
import { tasksRouter } from './tasks'

const router = Router()

router.use('/', mainRouter)
router.use('/ping', pingRouter)
router.use('/users', userRouter)
router.use('/tasks', tasksRouter)
router.use('/task-statues', taskStatuesRouter)

export { router }
