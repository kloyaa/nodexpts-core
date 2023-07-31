import { Router } from 'express';
import { placeBet, getAll, numberStats, getDailyTotal, getAllBetResults, getBetResult, createBetResult } from '../controllers/bet.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';
import { isUserProfileCreated } from '../../__core/middlewares/is-user-profile-created.middleware';
const router = Router();

router.post('/bet/v1/place', 
    isAuthenticated, 
    isUserProfileCreated, 
    placeBet
);

router.get('/bet/v1/bets', 
    isAuthenticated, 
    isUserProfileCreated, 
    getAll
);

router.post('/bet/v1/result', 
    isAuthenticated, 
    isUserProfileCreated, 
    createBetResult
);

router.get('/bet/v1/daily-result', 
    isAuthenticated, 
    isUserProfileCreated, 
    getBetResult
);

router.get('/bet/v1/results', 
    isAuthenticated, 
    isUserProfileCreated, 
    getAllBetResults
);

router.get('/bet/v1/numberstats', 
    isAuthenticated, 
    isUserProfileCreated, 
    numberStats
);
router.get('/bet/v1/daily-total', 
    isAuthenticated, 
    isUserProfileCreated, 
    getDailyTotal
);

export default router;