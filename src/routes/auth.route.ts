import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';

const router = Router();

router.post('/auth/v1/login', login);
router.post('/auth/v1/register', register);
router.post('/auth/v1/logout', logout);

export default router;
