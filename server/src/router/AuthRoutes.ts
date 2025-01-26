import { Router } from 'express';
import * as AuthController from '../controllers/AuthController.ts';

const authRoutes = Router();

authRoutes.post('/signup', AuthController.signup);
authRoutes.post('/login', AuthController.login);

export default authRoutes;
