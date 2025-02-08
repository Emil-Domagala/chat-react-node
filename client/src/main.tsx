import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './store/userContext.tsx';
import { ColorModeProvider } from './store/colorModeContext.tsx';
import './index.css';
import App from './App.tsx';
import { SocketProvider } from './store/socketContext.tsx';
import { ChatContextProvider } from './store/chatContext.tsx';
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
