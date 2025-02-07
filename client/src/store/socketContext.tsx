import { createContext, useContext, useEffect, ReactNode, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './userContext';
import type { ContactDetailWithChatId } from './userContext';
import { useChatContext } from './chatContext';

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
  fetchMessages: (currentChatId: string, page: number) => Promise<void>;
  sendMessage: (message: IMessage) => void;
  messages: IMessage[];
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const messagePath = import.meta.env.VITE_MESSAGE_BASE_PATH;
  const FETCH_MESSAGE_ROUTE = serverUrl + messagePath + '/fetch-messages';

  const socket = useRef<Socket | null>(null);
  const { user, saveUserOnContactDeletion, saveUserOnContactAdd } = useUser();
  const { setContact } = useChatContext();

  //
  const [messagesAreLoading, setMessagesAreLoading] = useState(true);
  const [messages, setMessagesState] = useState<IMessage[]>(() => {
    const chatId = sessionStorage.getItem('currentChatId');
    const storedMessages = chatId ? sessionStorage.getItem(`messages_${chatId}`) : null;
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  //

  const fetchMessages = async (currentChatId: string, page: number) => {
    if (!currentChatId) return;
    if (!page) page = 1;
    setMessagesAreLoading(true);
    try {
      const response = await fetch(`${FETCH_MESSAGE_ROUTE}?chatId=${currentChatId}&page=${page}&limit=50`, {
        method: 'GET',
        credentials: 'include',
      });
      const resData = await response.json();

      if (!response.ok) {
        const error = new Error(resData.message || 'Getting messages failed') as Error & { errorData?: object };
        error.errorData = resData;
        throw error;
      }

      setMessages(resData.messages);
    } catch (err) {
      console.log(err);
    } finally {
      setMessagesAreLoading(false);
    }
  };

  const deleteContact = ({ deletedUserId, chatId }: { deletedUserId: string; chatId: string }) => {
    const currentChatId = sessionStorage.getItem('currentChatId');
    saveUserOnContactDeletion(deletedUserId, chatId);

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

  const setMessages = (newMessages: IMessage[]) => {
    setMessagesState(newMessages);
    const chatId = sessionStorage.getItem('currentChatId');
    if (chatId) sessionStorage.setItem(`messages_${chatId}`, JSON.stringify(newMessages));
  };

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

      socket.current.on('contactDeleted', deleteContact);
      socket.current.on('contactAdded', addContact);

      socket.current.on('receivedMessage', (message) => {
        setMessages((prev) => {
          const updatedMessages = [message.messageData, ...prev];
          sessionStorage.setItem(`messages_${message.messageData.chatId}`, JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      });
    }
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socket.current, sendMessage, fetchMessages, messages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
