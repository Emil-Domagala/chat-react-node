//i need to have states: isMessage

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ContactDetail } from './userContext';

type ChatContextType = {
  currentContact: ContactDetail | undefined;
  currentChatId: string | undefined;
  setContact: (contact: ContactDetail | undefined, currentChatId: string | undefined) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentContact, setCurrentContact] = useState(() => {
    const storedContact = sessionStorage.getItem('currentContact');
    return storedContact ? JSON.parse(storedContact) : undefined;
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    const storedChatId = sessionStorage.getItem('currentChatId');
    return storedChatId ? storedChatId : undefined;
  });

  const setContact = (contact: ContactDetail | undefined, chatId: string | undefined) => {
    if (contact && chatId) {
      setCurrentContact(contact);
      sessionStorage.setItem('currentContact', JSON.stringify(contact));
      setCurrentChatId(chatId);
      sessionStorage.setItem('currentChatId', chatId);
    } else {
      setCurrentContact(undefined);
      sessionStorage.removeItem('currentContact');
      setCurrentChatId(undefined);
      sessionStorage.removeItem('currentChatId');
    }
  };

  return <ChatContext.Provider value={{ currentContact, setContact, currentChatId }}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('ChatContext must be used within Provider');
  return context;
};
