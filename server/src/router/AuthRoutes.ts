import { Router } from 'express';
import * as AuthController from '../controllers/AuthController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';
import  upload  from '../middlewares/multer.ts';

const authRoutes = Router();

authRoutes.post('/signup', AuthController.signup);
authRoutes.post('/login', AuthController.login);
authRoutes.get('/user-info', verifyWebToken, AuthController.getUserInfo);
authRoutes.put('/update-profile', verifyWebToken, upload, AuthController.updateUserProfil);

export default authRoutes;
