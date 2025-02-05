import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ContactDetail = {
  _id: string;
  email?: string | undefined;
  firstName: string;
  lastName: string;
  image: string;
  color: number;
};

export type Contact = {
  contactId: string | ContactDetail;
  chatId: string;
};

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
  profileSetup?: boolean;
  groups?: string[];
  contacts?: Contact[];
  chats?: string[];
};

type UserContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  fetchUser: () => Promise<void>;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUserState] = useState<User | undefined>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : undefined;
  });

  const setUser = (newUser: User | undefined) => {
    setUserState(newUser);
    if (newUser) {
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('user');
    }
  };

  // const deleteContactCash =()=>{

  // }

  useEffect(() => {
    fetchUser();
  }, []);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/user-info';

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(FETCH_USER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        setUser(undefined);
        return;
      }

      const resData = await response.json();
      setUser(resData.user);
    } catch (error) {
      console.log(error);
      setUser(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return <UserContext.Provider value={{ user, setUser, fetchUser, isLoading }}>{children}</UserContext.Provider>;
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
