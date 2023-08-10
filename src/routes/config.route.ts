import { Router } from 'express'
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware'
import { isUserProfileCreated } from '../../__core/middlewares/is-user-profile-created.middleware'
import { getBetConfigs } from '../controllers/config.controller'
const router = Router()

router.get('/config/v1/bet',
  isAuthenticated,
  isUserProfileCreated,
  getBetConfigs
)

export default router
