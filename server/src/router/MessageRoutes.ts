import { Router } from 'express';
import * as MessageController from '../controllers/MessageController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';


const messageRoutes = Router();


// messageRoutes.post('/upload-file', verifyWebToken, uploadMiddleware('files'), MessageController.uploadFile);
messageRoutes.get('/fetch-messages', verifyWebToken, MessageController.getMessages);

export default messageRoutes;
