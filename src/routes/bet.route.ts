import { Router } from 'express';
import { placeBet, getAll, numberStats } from '../controllers/bet.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';
const router = Router();

router.post('/bet/v1/place', isAuthenticated, placeBet);
router.get('/bet/v1/bets', isAuthenticated, getAll);
router.get('/bet/v1/numberstats', isAuthenticated, numberStats);

export default router;