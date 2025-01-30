import { Router } from 'express';
import * as AuthController from '../controllers/AuthController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';
import uploadMiddleware from '../middlewares/multer.ts';

const authRoutes = Router();

authRoutes.post('/signup', AuthController.signup);
authRoutes.post('/login', AuthController.login);
authRoutes.post('/logout', AuthController.logout);
authRoutes.get('/user-info', verifyWebToken, AuthController.getUserInfo);
authRoutes.put('/update-profile', verifyWebToken, uploadMiddleware('profiles'), AuthController.updateUserProfil);

export default authRoutes;
