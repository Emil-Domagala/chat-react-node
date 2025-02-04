import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './userContext';

export type IMessage = {
  _id: string;
  sender: string
  chatId: string;
  messageType: 'text' | 'file';
  content?: string;
  fileUrl?: string;
};

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user && !socket.current) {
      socket.current = io(import.meta.env.VITE_SERVER_URL, {
        withCredentials: true,
        query: { userId: user.id },
      });

      socket.current.on('connect', () => {
        console.log('Connected to socket server from socketContext');
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      socket.current.on('reciveMessage', (message: IMessage) => {
        console.log(`Recived new message: ${message}`);

        const chatId = message.chatId;
        const storedMessages = JSON.parse(sessionStorage.getItem(`messages_${chatId}`) || '[]');

        storedMessages.push(message);
        sessionStorage.setItem(`messages_${chatId}`, JSON.stringify(storedMessages));
      });
    }
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [user]);

  const sendMessage = (message: IMessage) => {
    if (socket.current) {
      socket.current.emit('sendMessage', message);
    }
  };

  return <SocketContext.Provider value={{ socket: socket.current }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
