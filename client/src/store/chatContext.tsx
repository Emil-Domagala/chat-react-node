import { createContext, useContext, useState, ReactNode } from 'react';
import type { ContactDetail, GroupDetail } from './userContext';

type ChatContextType = {
  currentContact: ContactDetail | undefined;
  currentGroup: GroupDetail | undefined;
  currentChatId: string | undefined;
  setContact: (contact: ContactDetail | undefined, currentChatId: string | undefined) => void;
  setGroup: (group: GroupDetail | undefined, currentChatId: string | undefined) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentContact, setCurrentContact] = useState(() => {
    const storedContact = sessionStorage.getItem('currentContact');
    return storedContact ? JSON.parse(storedContact) : undefined;
  });
  const [currentGroup, setCurrentGroup] = useState(() => {
    const storedGroup = sessionStorage.getItem('currentGroup');
    return storedGroup ? JSON.parse(storedGroup) : undefined;
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    const storedChatId = sessionStorage.getItem('currentChatId');
    return storedChatId ? storedChatId : undefined;
  });

  const setGroup = (group: GroupDetail | undefined, chatId: string | undefined) => {
    if (group && chatId) {
      setCurrentGroup(group);
      setCurrentContact(undefined);
      sessionStorage.setItem('currentGroup', JSON.stringify(group));
      sessionStorage.removeItem('currentContact');
      setCurrentChatId(chatId);
      sessionStorage.setItem('currentChatId', chatId);
    } else {
      setCurrentGroup(undefined);
      sessionStorage.removeItem('currentGroup');
      setCurrentChatId(undefined);
      sessionStorage.removeItem('currentChatId');
    }
  };

  const setContact = (contact: ContactDetail | undefined, chatId: string | undefined) => {
    if (contact && chatId) {
      setCurrentContact(contact);
      setCurrentGroup(undefined);
      sessionStorage.setItem('currentContact', JSON.stringify(contact));
      sessionStorage.removeItem('currentGroup');
      setCurrentChatId(chatId);
      sessionStorage.setItem('currentChatId', chatId);
    } else {
      setCurrentContact(undefined);
      sessionStorage.removeItem('currentContact');
      setCurrentChatId(undefined);
      sessionStorage.removeItem('currentChatId');
    }
  };

  return (
    <ChatContext.Provider value={{ currentContact, currentGroup, setContact, setGroup, currentChatId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('ChatContext must be used within Provider');
  return context;
};
