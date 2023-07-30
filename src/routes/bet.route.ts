import { Router } from 'express';
import { placeBet, getAll } from '../controllers/bet.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';
const router = Router();

router.post('/bet/v1/place', isAuthenticated, placeBet);
router.get('/bet/v1/bets', isAuthenticated, getAll);

export default router;