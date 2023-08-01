import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { checkUserOrigin } from '../../__core/middlewares/origin.middleware';
import { isAdmin } from '../../__core/middlewares/role.middleware';
const router = Router();

router.post('/auth/v1/login', checkUserOrigin, login);
router.post('/auth/v1/register', checkUserOrigin, register);
router.post('/auth/v1/logout', logout);

export default router;
