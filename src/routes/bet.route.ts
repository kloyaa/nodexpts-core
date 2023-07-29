import { Router } from 'express';
import { placeBet } from '../controllers/bet.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';
const router = Router();

router.post('/bet/v1/place', isAuthenticated, placeBet);

export default router;