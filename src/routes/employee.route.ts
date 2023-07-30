import { Router } from 'express';
import { updateProfileVerifiedStatus, getDailyTotal } from '../controllers/employee.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';
const router = Router();

router.post('/employee/v1/profile-verification', isAuthenticated, updateProfileVerifiedStatus);
router.get('/employee/v1/daily-total', isAuthenticated, getDailyTotal);

export default router;