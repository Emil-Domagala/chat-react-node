import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './store/userContext.tsx';
import { ColorModeProvider } from './store/colorModeContext.tsx';
import './index.css';
import App from './App.tsx';
import { SocketProvider } from './store/socketContext.tsx';
import { ChatContextProvider } from './store/chatContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <ColorModeProvider>
        <ChatContextProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ChatContextProvider>
      </ColorModeProvider>
    </UserProvider>
  </StrictMode>,
);
