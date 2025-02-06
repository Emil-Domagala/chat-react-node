import { Router } from 'express';
import * as MessageController from '../controllers/MessageController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';
// import uploadMiddleware from '../middlewares/multer.ts';

const messageRoutes = Router();

// contactRoutes.post('/search-contacts', verifyWebToken, ContactController.searchContacts);
// authRoutes.put('/update-profile', verifyWebToken, uploadMiddleware('profiles'), AuthController.updateUserProfil);
messageRoutes.get('/fetch-messages', verifyWebToken, MessageController.getMessages);

export default messageRoutes;
