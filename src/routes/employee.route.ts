import { Router } from 'express'
import { updateProfileVerifiedStatus, getDailyTotal, createRoleForUser } from '../controllers/employee.controller'
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware'
import { isAdmin } from '../../__core/middlewares/role.middleware'
const router = Router()

router.put('/employee/v1/profile-verification',
  isAuthenticated,
  isAdmin,
  updateProfileVerifiedStatus
)

router.get('/employee/v1/daily-total',
  isAuthenticated,
  isAdmin,
  getDailyTotal
)
router.post('/employee/v1/role',
  isAuthenticated,
  isAdmin,
  createRoleForUser
)

export default router
