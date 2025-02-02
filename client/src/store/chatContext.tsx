//i need to have states: isMessage

import { createContext, useContext, useState, ReactNode } from 'react';

type ChatContextType = {
  currentContactId: string | undefined;
  setContactId: (contactId: string | undefined) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentContactId, setCurrentContactId] = useState(() => {
    return (localStorage.getItem('currentContactId') as string) || undefined;
  });

  const setContactId = (contactId: string | undefined) => {
    if (contactId) {
      setCurrentContactId(contactId);
      localStorage.setItem('currentContactId', contactId);
    } else {
      setCurrentContactId(undefined);
      localStorage.removeItem('currentContactId');
    }
  };

  return <ChatContext.Provider value={{ currentContactId, setContactId }}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('ChatContext must be used within Provider');
  return context;
};
