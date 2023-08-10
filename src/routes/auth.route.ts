import { Router } from 'express'
import { login, logout, register, verifyToken } from '../controllers/auth.controller'
import { checkUserOrigin } from '../../__core/middlewares/origin.middleware'
const router = Router()

router.post('/auth/v1/login', checkUserOrigin, login)
router.post('/auth/v1/register', checkUserOrigin, register)
router.post('/auth/v1/logout', logout)
router.post('/auth/v1/token/verify', checkUserOrigin, verifyToken)

export default router
