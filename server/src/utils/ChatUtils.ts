// import User from '../models/UserModel.ts';
import Group from '../models/GroupModel.ts';
import Chat from '../models/ChatModel.ts';
// import Message from '../models/MessageModel.ts';

export const createPrivateChat = async (userId1: string, userId2: string) => {
  try {
    const existingChat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    });

    if (existingChat) {
      console.log('Chat already exists');
      return existingChat;
    }

    const chat = await Chat.create({
      participants: [userId1, userId2],
      lastMessage: null,
    });

    return chat;
  } catch (error) {
    console.error('Error creating private chat:', error);
    throw error;
  }
};

export const createGroupChat = async (selectedMembersIds: string[], adminId: string, groupName: string) => {
  try {
    const chat = await Chat.create({
      participants: [...selectedMembersIds, adminId],
      lastMessage: null,
    });

    const group = await Group.create({
      name: groupName,
      members: [...selectedMembersIds, adminId],
      admin: adminId,
    });
    return { chat, group };
  } catch (error) {
    console.error('Error creating private chat:', error);
    throw error;
  }
};
