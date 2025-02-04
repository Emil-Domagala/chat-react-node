// import User from '../models/UserModel.ts';
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

