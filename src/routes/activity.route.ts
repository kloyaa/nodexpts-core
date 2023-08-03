import { Router } from 'express';
import { getAllActivityLogs,} from '../controllers/activity.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';
import { isAdmin } from '../../__core/middlewares/role.middleware';
const router = Router();

router.get('/activity/v1/activities', 
    isAuthenticated, 
    isAdmin,
    getAllActivityLogs
);

export default router;