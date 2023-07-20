import { Router } from 'express';
import { create } from '../controllers/profile.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';

const router = Router();

router.post('/clients/v1/profile', isAuthenticated, create);

export default router;
