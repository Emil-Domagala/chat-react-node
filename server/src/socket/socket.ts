import { Server as SocketIOServer } from 'socket.io';
import type { Socket } from 'socket.io';
import { Server } from 'http';
import Chat from '../models/ChatModel.ts';
import Message from '../models/MessageModel.ts';
import type { IMessage } from '../models/MessageModel.ts';

const setupSocket = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

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
      const senderSocketId = userSocketMap.get(message.sender);

      const chat = await Chat.findById(message.chatId).populate('participants');

      if (!chat) {
        console.log('Chat not found');
        return;
      }

      const createMessage = await Message.create(message);

      const messageData = await Message.findById(createMessage._id).populate(
        'sender',
        'id firstName lastName color image',
      );

      chat.participants.forEach((participant) => {
        const recipientSocketId = userSocketMap.get(participant._id.toString());

        if (recipientSocketId) {
          io.to(recipientSocketId).emit('receiveMessage', messageData);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit('recivedMessage', messageData);
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
      console.log(`User connected:${userId} with ${socket.id}`);
    } else {
      console.log('User id not provided during connection');
    }

    socket.on('sendMessage', sendMessage);

    socket.on('disconnect', () => {
      disconnect(socket);
    });
  });

  return io;
};

export default setupSocket;
