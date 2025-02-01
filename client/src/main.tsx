import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './store/userContext.tsx';
import { ColorModeProvider } from './store/colorModeContext.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </UserProvider>
  </StrictMode>,
);
