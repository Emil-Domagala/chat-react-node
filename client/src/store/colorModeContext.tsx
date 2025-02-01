import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ColorModeContextType = {
  mode: 'light' | 'dark';
  setDarkColorMode: () => void;
  setLightColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('color-mode') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.setAttribute('color-mode', mode);
    }
    localStorage.setItem('color-mode', mode);
  }, [mode]);

  const setLightColorMode = () => setMode('light');
  const setDarkColorMode = () => setMode('dark');

  return (
    <ColorModeContext.Provider value={{ mode, setLightColorMode, setDarkColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

// Custom hook for using the context
export const useColorMode = () => {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};
