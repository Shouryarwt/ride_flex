import { Router } from 'express';
import { register, login, getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/auth.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.delete('/account', authenticate, deleteAccount);

export default router;

