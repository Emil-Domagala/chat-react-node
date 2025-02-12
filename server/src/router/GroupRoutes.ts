import { Router } from 'express';
import * as GroupController from '../controllers/GroupController.ts';
import { verifyWebToken } from '../middlewares/AuthMiddleware.ts';

const groupRoutes = Router();

groupRoutes.post('/search-contacts', verifyWebToken, GroupController.searchContacts);
groupRoutes.post('/create-group', verifyWebToken, GroupController.createGroup);
groupRoutes.put('/edit-group', verifyWebToken, GroupController.editGroup);
groupRoutes.delete('/delete-group', verifyWebToken, GroupController.deleteGroup);
groupRoutes.get('/:groupId', verifyWebToken, GroupController.fetchGroupData);
groupRoutes.post('/leave-group', verifyWebToken, GroupController.leaveGroup);

export default groupRoutes;
