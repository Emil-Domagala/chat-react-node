import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Contact = {
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
};

type User = {
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
  profileSetup?: boolean;
  groups?: string[];
  contacts?: string[] | Contact;
};

type UserContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  fetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
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

  useEffect(() => {
    fetchUser();
  }, []);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/user-info';

  const fetchUser = async () => {
    try {
      const response = await fetch(FETCH_USER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const resData = await response.json();
      setUser(resData.user);
    } catch (error) {
      console.log(error);
      setUser(undefined);
    }
  };

  return <UserContext.Provider value={{ user, setUser, fetchUser }}>{children}</UserContext.Provider>;
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
