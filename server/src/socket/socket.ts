import { Server as SocketIOServer } from 'socket.io';
import type { Socket } from 'socket.io';
import { Server } from 'http';
import Chat from '../models/ChatModel.ts';
import Message from '../models/MessageModel.ts';
import type { IMessage } from '../models/MessageModel.ts';
import type { Types } from 'mongoose';

let io: SocketIOServer | null = null;
const userSocketMap = new Map();

export const setupSocket = (server: Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const disconnect = (socket: Socket) => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message: IMessage) => {
    try {
      const chat = await Chat.findById(message.chatId).populate('participants');
      if (!chat) return console.log('Chat not found');

      if (message.content.trim().length > 600 || message.content.trim() == '') return;

      const createMessage = await Message.create(message);

      const messageData = await Message.findById(createMessage._id).populate(
        'sender',
        'id firstName lastName color image',
      );

      await chat.updateOne({ lastMessage: messageData.sender._id });

      chat.participants.forEach((participant) => {
        const recipientSocketId = userSocketMap.get(participant._id.toString());
        if (recipientSocketId) {
          console.log(`Sending message to ${recipientSocketId}`);
          io?.to(recipientSocketId).emit('receivedMessage', { messageData });
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with ${socket.id}`);
    } else {
      console.log('User id not provided during connection');
    }

    socket.on('sendMessage', sendMessage);
    socket.on('disconnect', () => disconnect(socket));
  });

  return io;
};

export const notifyContactDeletion = (deletedUserId: string, recipientId: string, chatId: string) => {
  const recipientSocketId = userSocketMap.get(recipientId);
  if (recipientSocketId && io) {
    console.log(`Notifying ${recipientId} about contact deletion`);
    io.to(recipientSocketId).emit('contactDeleted', { deletedUserId, chatId });
  }
};

export const notifyContactAdded = (newContact: {}, recipientId: string) => {
  const recipientSocketId = userSocketMap.get(recipientId);

  if (recipientSocketId && io) {
    console.log(`Notifying ${recipientId} about contact add`);
    io.to(recipientSocketId).emit('contactAdded', { newContact });
  }
};

export const notifyGroupCreation = (createdGroup: {}, membersIDs: string[]) => {
  membersIDs.forEach((member) => {
    const memberSocketId = userSocketMap.get(member.toString());
    if (memberSocketId) {
      console.log(`Sending group creation to ${memberSocketId}`);
      io?.to(memberSocketId).emit('groupCreated', { createdGroup });
    }
  });
};
export const notifyGroupDeletion = (deletedGroup: {}, membersIDs: string[]) => {
  membersIDs.forEach((member) => {
    const memberSocketId = userSocketMap.get(member.toString());
    if (memberSocketId) {
      console.log(`Sending message to ${memberSocketId}`);
      io?.to(memberSocketId).emit('groupDeleted', { deletedGroup });
    }
  });
};
export const notifyGroupChangedName = (membersIDs: Types.ObjectId[], newName: string, groupId: string) => {
  membersIDs.forEach((member) => {
    const memberSocketId = userSocketMap.get(member.toString());
    if (memberSocketId) {
      console.log(`Sending group name change to ${memberSocketId}`);
      io?.to(memberSocketId).emit('groupChangedName', { newName, groupId });
    }
  });
};
