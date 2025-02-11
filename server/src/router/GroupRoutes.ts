import { Router } from 'express';
import * as GroupController from '../controllers/GroupController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';

const groupRoutes = Router();

groupRoutes.post('/search-contacts', verifyWebToken, GroupController.searchContacts);
groupRoutes.post('/create-group', verifyWebToken, GroupController.createGroup);
groupRoutes.post('/edit-group', verifyWebToken, GroupController.editGroup);
groupRoutes.delete('/delete-group', verifyWebToken, GroupController.deleteGroup);

export default groupRoutes;
