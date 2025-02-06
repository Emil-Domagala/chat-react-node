import { Router } from 'express';
import * as ContactController from '../controllers/ContactController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';

const contactRoutes = Router();

contactRoutes.post('/search-contacts', verifyWebToken, ContactController.searchContacts);
contactRoutes.post('/add-contact', verifyWebToken, ContactController.addContact);
contactRoutes.delete('/delete-contact', verifyWebToken, ContactController.deleteContact);

export default contactRoutes;
