import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
  profileSetup?: boolean;
};

type UserContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  loading: boolean;
  fetchUser: () => Promise<void>;
  mode: 'light' | 'dark' | undefined;
  setDarkColorMode: () => void;
  setLightColorMode: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'light' | 'dark'>();

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/user-info';

  const body = document.querySelector('body');

  const setLightColorMode = () => {
    setMode('light');
    body!.setAttribute('color-mode', 'light');
    localStorage.setItem('color-mode', 'light');
  };

  const setDarkColorMode = () => {
    setMode('dark');
    body!.setAttribute('color-mode', 'dark');
    localStorage.setItem('color-mode', 'dark');
  };

  useEffect(() => {
    const colorMode = localStorage.getItem('color-mode');
    if (colorMode === 'light') return setLightColorMode();
    if (colorMode === 'dark') return setDarkColorMode();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, mode, setLightColorMode, setDarkColorMode }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
