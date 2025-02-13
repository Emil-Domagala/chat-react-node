import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './store/userContext';
import { ColorModeProvider } from './store/colorModeContext';
import './index.css';
import App from './App';
import { SocketProvider } from './store/socketContext';
import { ChatContextProvider } from './store/chatContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ColorModeProvider>
          <ChatContextProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </ChatContextProvider>
        </ColorModeProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
