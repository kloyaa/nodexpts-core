import { Router } from 'express';
import { updateProfileVerifiedStatus } from '../controllers/employee.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';
const router = Router();

router.post('/employee/v1/profile-verification', isAuthenticated, updateProfileVerifiedStatus);

export default router;