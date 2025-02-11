import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './userContext';
import type { ContactDetailWithChatId, GroupDetailWithChatId } from './userContext';
import { useChatContext } from './chatContext';
import { useQueryClient } from '@tanstack/react-query';

export type IMessage = {
  _id?: string;
  sender: string;
  chatId: string;
  messageType: 'text' | 'file';
  content?: string;
  fileUrl?: string;
};

type SocketContextType = {
  socket: Socket | null;
  sendMessage: (message: IMessage) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const {
    user,
    saveUserOnContactDeletion,
    saveUserOnContactAdd,
    saveUserOnNewMessage,
    saveUserOnGroupDeletion,
    saveUserOnGroupAdd,
  } = useUser();
  const { setContact, setGroup } = useChatContext();
  const queryClient = useQueryClient();

  const deleteContact = ({ deletedUserId, chatId }: { deletedUserId: string; chatId: string }) => {
    const currentChatId = sessionStorage.getItem('currentChatId');
    saveUserOnContactDeletion(deletedUserId);
    queryClient.removeQueries({ queryKey: ['messages', chatId] });

    if (currentChatId === chatId) {
      setContact(undefined, undefined);
    }
  };

  const addContact = ({ newContact }: { newContact: ContactDetailWithChatId }) => {
    saveUserOnContactAdd(newContact);
  };

  const sendMessage = (message: IMessage) => {
    if (socket.current) {
      socket.current.emit('sendMessage', message);
    }
  };

  const createGroup = ({ createdGroup }: { createdGroup: GroupDetailWithChatId }) => {
    saveUserOnGroupAdd(createdGroup);
  };

  const deleteGroup = ({ deletedGroup }: { deletedGroup: { chatId: string; groupId: string } }) => {
    const currentChatId = sessionStorage.getItem('currentChatId');
    saveUserOnGroupDeletion(deletedGroup.groupId);
    queryClient.removeQueries({ queryKey: ['messages', deletedGroup.chatId] });

    if (currentChatId === deletedGroup.chatId) {
      setGroup(undefined, undefined);
    }
  };

  useEffect(() => {
    if (user && !socket.current) {
      socket.current = io(import.meta.env.VITE_SERVER_URL, {
        withCredentials: true,
        query: { userId: user.id },
      });

      socket.current.on('connect', () => {
        // console.log('Connected to socket server from socketContext');
      });

      socket.current.on('disconnect', () => {
        // console.log('Disconnected from socket server');
      });

      socket.current.on('contactDeleted', deleteContact);
      socket.current.on('contactAdded', addContact);
      socket.current.on('groupCreated', createGroup);
      socket.current.on('groupDeleted', deleteGroup);

      socket.current.on('receivedMessage', (message) => {
        saveUserOnNewMessage(message.messageData.chatId, message.messageData.sender._id);

        queryClient.setQueryData(['messages', message.messageData.chatId], (oldData: any) => {
          if (!oldData) {
            return { pages: [{ messages: [message.messageData] }], pageParams: [] };
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page, index: number) =>
              index === 0 ? { ...page, messages: [message.messageData, ...page.messages] } : page,
            ),
          };
        });
      });
    }
    return () => {
      socket.current?.off('receivedMessage');
      socket.current?.off('contactDeleted');
      socket.current?.off('contactAdded');
      socket.current?.off('groupCreated');
      socket.current?.off('groupDeleted');
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [user, queryClient]);

  return (
    <SocketContext.Provider
      value={{
        socket: socket.current,
        sendMessage,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
