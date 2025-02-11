import { internalError } from '../utils/InternalError.ts';
import User from '../models/UserModel.ts';
import Group from '../models/GroupModel.ts';
import Chat from '../models/ChatModel.ts';
import Message from '../models/MessageModel.ts';
import { createGroupChat } from '../utils/ChatUtils.ts';
import { notifyGroupCreation, notifyGroupDeletion } from '../socket/socket.ts';

export const searchContacts: ControllerFunctionType = async (req, res, next) => {
  try {
    const { searchTerm, alredySelectedIds } = req.body;

    console.log(searchTerm);

    if (!searchTerm) return res.status(400).send({ message: 'Serch Trem is required' });
    const sanitizedSearchTerm = searchTerm.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
    const regex = new RegExp(sanitizedSearchTerm, 'i');

    const currentUser = await User.findById(req.userId).select('contacts');
    if (!currentUser) return res.status(404).send({ message: 'User not found' });

    const userContacts = currentUser.contacts?.map((contact) => contact.contactId.toString()) || [];

    const possibleContacts = await User.find({
      $and: [
        { _id: { $in: userContacts, $nin: alredySelectedIds } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    }).select('_id firstName lastName image color');

    return res.status(200).json({ possibleContacts });
  } catch (err) {
    err;
  }
};

export const createGroup: ControllerFunctionType = async (req, res, next) => {
  try {
    const { selectedMembersIds, name } = req.body;

    if (!Array.isArray(selectedMembersIds) || selectedMembersIds.length < 2) {
      return res.status(400).send({ message: 'Group has to be at least 2 members' });
    }
    if (name.trim() === '' || name.trim().length > 30)
      return res.status(400).send({ message: 'Group name is requied and cannot be longer than 30 characters' });

    const existingUsers = await User.find({ _id: { $in: selectedMembersIds } }).select('_id groups');
    if (existingUsers.length !== selectedMembersIds.length)
      return res.status(400).send({ message: 'Some users do not exist' });

    const currentUser = await User.findById(req.userId).select('contacts');
    if (!currentUser) return res.status(404).send({ message: 'User not found' });

    const userContactIds = currentUser.contacts.map((contact) =>
      typeof contact.contactId === 'string' ? contact.contactId : contact.contactId.toString(),
    );

    const allAreContacts = selectedMembersIds.every((id) => userContactIds.includes(id));
    if (!allAreContacts) {
      return res.status(400).send({ message: 'Some selected members are not in your contacts' });
    }

    const { chat, group } = await createGroupChat(selectedMembersIds, req!.userId, name);

    await Promise.all([
      ...existingUsers.map((user) => user.updateOne({ $push: { groups: { groupId: group._id, chatId: chat._id } } })),
      currentUser.updateOne({ $push: { groups: { groupId: group._id, chatId: chat._id } } }),
    ]);

    const newGroup = {
      _id: group._id,
      name: group.name,
      admin: group.admin,
      chatId: chat._id,
    };

    const groupMembersIDs = group.members.map((memberId) => memberId.toString());

    notifyGroupCreation(newGroup, groupMembersIDs);

    return res.status(200).json({
      newGroup,
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const editGroup: ControllerFunctionType = async (req, res, next) => {
  try {
  } catch (err) {
    internalError(err, res);
  }
};

export const deleteGroup: ControllerFunctionType = async (req, res, next) => {
  try {
    const { groupId, chatId } = req.body;
    if (!groupId) return res.status(400).send({ message: 'GroupId and chatId is required' });

    const group = await Group.findByIdAndDelete(groupId);
    if (!group) return res.status(400).send({ message: 'Couldnt find group' });
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) return res.status(400).send({ message: 'Couldnt find chat' });

    if (group.admin.toString() !== req.userId.toString())
      return res.status(401).send({ message: 'Group can be deleted only by Admin' });

    await Message.deleteMany({ chatId });

    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: { groupId: group._id, chatId: chat._id } } },
    );

    const groupMembersIDs = group.members.map((memberId) => memberId.toString());
    const deletedGroup = {
      groupId: group._id,
      chatId: chat._id,
    };

    notifyGroupDeletion(deletedGroup, groupMembersIDs);

    return res.status(200).json({ message: 'Success', deletedGroup: deletedGroup });
  } catch (err) {
    internalError(err, res);
  }
};
