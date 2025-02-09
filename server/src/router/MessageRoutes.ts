import { Router } from 'express';
import * as MessageController from '../controllers/MessageController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';
import uploadMiddleware from '../middlewares/multer.ts';

const messageRoutes = Router();


messageRoutes.post('/upload-file', verifyWebToken, uploadMiddleware('files'), MessageController.uploadFile);
messageRoutes.get('/fetch-messages', verifyWebToken, MessageController.getMessages);

export default messageRoutes;
