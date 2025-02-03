//i need to have states: isMessage

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Contact } from './userContext';

type ChatContextType = {
  currentContact: Contact | undefined;
  setContact: (contact: Contact | undefined) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentContact, setCurrentContact] = useState(() => {
    const storedContact = sessionStorage.getItem('currentContact');
    return storedContact ? JSON.parse(storedContact) : undefined;
  });

  const setContact = (contact: Contact | undefined) => {
    if (contact) {
      setCurrentContact(contact);
      sessionStorage.setItem('currentContact', JSON.stringify(contact));
    } else {
      setCurrentContact(undefined);
      sessionStorage.removeItem('currentContact');
    }
  };

  return <ChatContext.Provider value={{ currentContact, setContact }}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('ChatContext must be used within Provider');
  return context;
};
