import { Router } from 'express';
import { create, getProfileByLoginId, getAllProfiles, me } from '../controllers/profile.controller';
import { isAuthenticated } from '../../__core/middlewares/jwt.middleware';

const router = Router();

router.post('/clients/v1/profile', isAuthenticated, create);
router.get('/clients/v1/profile', isAuthenticated, getProfileByLoginId);
router.get('/clients/v1/profiles', isAuthenticated, getAllProfiles);
router.get('/clients/v1/me', isAuthenticated, me);

export default router;
