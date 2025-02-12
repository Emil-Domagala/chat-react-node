import { internalError } from '../utils/InternalError.ts';
import User from '../models/UserModel.ts';
import Group from '../models/GroupModel.ts';
import Chat from '../models/ChatModel.ts';
import Message from '../models/MessageModel.ts';
import { createGroupChat } from '../utils/ChatUtils.ts';
import { notifyGroupCreation, notifyGroupDeletion, notifyGroupChangedName } from '../socket/socket.ts';
import { validateGroupCreation } from '../utils/GroupUtils.ts';

export const searchContacts: ControllerFunctionType = async (req, res, next) => {
  try {
    const { searchTerm, alredySelectedIds } = req.body;

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

    const { error, existingUsers, currentUser } = await validateGroupCreation(req.userId, selectedMembersIds, name);
    if (error !== null) return res.status(400).send({ message: error });

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
      lastMessage: null as null,
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
    const { selectedMembersIds, name, groupId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).send({ message: 'Group not found' });

    if (group.admin.toString() !== req.userId.toString()) {
      return res.status(401).send({ message: 'Group can be edited only by Admin' });
    }

    const { error, existingUsers, currentUser } = await validateGroupCreation(req.userId, selectedMembersIds, name);
    if (error !== null) return res.status(400).send({ message: error });

    const chatId = currentUser.groups.find((g) => g.groupId.toString() === groupId)?.chatId || null;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ message: 'Couldn’t find chat' });

    const currentMembers = group.members.map((member) => member.toString()).filter((id) => id !== req.userId);
    const deletedUsers = currentMembers.filter((id) => !selectedMembersIds.includes(id));
    const addedUsers = selectedMembersIds.filter((id: string) => !currentMembers.includes(id));

    await Promise.all([
      ...deletedUsers.map((userId) => User.updateOne({ _id: userId }, { $pull: { groups: { groupId: group._id } } })),
      group.updateOne({ $pull: { members: { $in: deletedUsers } } }),
      chat.updateOne({ $pull: { participants: { $in: deletedUsers } } }),

      ...addedUsers.map((userId: string) =>
        User.updateOne({ _id: userId }, { $push: { groups: { groupId: group._id, chatId: chat._id } } }),
      ),
      group.updateOne({ $push: { members: { $each: addedUsers } } }),
      chat.updateOne({ $push: { participants: { $each: addedUsers } } }),
    ]);

    let newName = group.name;

    const updatedGroupMembers = await Group.findById(groupId).select('members');

    if (name && name !== group.name) {
      newName = name;
      await group.updateOne({ name });
      notifyGroupChangedName(updatedGroupMembers.members, newName, groupId);
    }

    const newGroup = {
      _id: group._id,
      name: newName,
      admin: group.admin,
      chatId: chat._id,
      lastMessage: chat.lastMessage,
    };
    const deletedGroup = {
      groupId: group._id,
      chatId: chat._id,
    };

    notifyGroupCreation(newGroup, addedUsers);
    notifyGroupDeletion(deletedGroup, deletedUsers);
    return res.status(200).send({ success: true, name: newName, _id: group._id });
  } catch (err) {
    internalError(err, res);
  }
};

export const fetchGroupData: ControllerFunctionType = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('members', '_id firstName lastName image color');
    if (!group) return res.status(404).send({ message: 'Group not found' });

    const filtredMembers = group.members.filter((member) => member._id.toString() !== req.userId.toString());

    return res.status(200).json({ ...group._doc, members: filtredMembers });
  } catch (err) {
    internalError(err, res);
  }
};

export const deleteGroup: ControllerFunctionType = async (req, res, next) => {
  try {
    const { groupId, chatId } = req.body;

    if (!groupId) return res.status(400).send({ message: 'GroupId and chatId is required' });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).send({ message: 'Couldnt find group' });
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ message: 'Couldnt find chat' });

    if (group.admin.toString() !== req.userId.toString())
      return res.status(401).send({ message: 'Group can be deleted only by Admin' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(400).send({ message: 'GroupId and chatId is required' });

    const foundChatId = user.groups.find((group) => group.groupId.toString() === groupId)?.chatId || null;

    if (chatId.toString() !== foundChatId.toString()) return res.status(400).send({ message: 'Wrong chat Id' });
    await group.deleteOne();
    await chat.deleteOne();

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

export const leaveGroup: ControllerFunctionType = async (req, res, next) => {
  try {
    const { groupId } = req.body;

    const currentUser = await User.findById(req.userId).select('groups');
    if (!currentUser) return res.status(404).send({ message: 'User not found' });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).send({ message: 'Group not found' });

    const chatId = currentUser.groups.find((g) => g.groupId.toString() === groupId)?.chatId || null;
    if (!chatId) return res.status(404).send({ message: 'Chat not found' });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ message: 'Couldn’t find chat' });

    const isUserInGroup = group.members.some((memberId) => memberId.toString() === req.userId.toString());

    if (!isUserInGroup) return res.status(400).send({ message: 'User is not in the group already' });

    const isGroupStillExisting = group.members.length > 3;

    if (!isGroupStillExisting) {
      await group.deleteOne();
      await chat.deleteOne();
      await Message.deleteMany({ chatId });
      await User.updateMany({ _id: { $in: group.members } }, { $pull: { groups: { groupId: group._id, chatId } } });
      const groupMembersIDs = group.members.map((memberId) => memberId.toString());
      const deletedGroup = {
        groupId: group._id,
        chatId,
      };
      notifyGroupDeletion(deletedGroup, groupMembersIDs);
    }
    if (isGroupStillExisting) {
      await Promise.all([
        User.updateOne({ _id: req.userId }, { $pull: { groups: { groupId: group._id } } }),
        Group.updateOne({ _id: group._id }, { $pull: { members: req.userId } }),
        Chat.updateOne({ _id: chat._id }, { $pull: { participants: req.userId } }),
      ]);
    }

    return res.status(200).send({ success: true, groupId: groupId });
  } catch (err) {
    internalError(err, res);
  }
};
