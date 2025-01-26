import { Router } from 'express';
import * as AuthController from '../controllers/AuthController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';

const authRoutes = Router();

authRoutes.post('/signup', AuthController.signup);
authRoutes.post('/login', AuthController.login);
authRoutes.get('/user-info', verifyWebToken, AuthController.getUserInfo);

export default authRoutes;
