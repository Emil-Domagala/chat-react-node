import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './userContext';

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  //   const [socket, setSocket] = useState<Socket | null>(null);
  //   const [isConnected, setIsConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user && !socket.current) {
      socket.current = io(import.meta.env.VITE_SERVER_URL, {
        withCredentials: true,
        query: { userId: user.id },
      });

      socket.current.on('connect', () => {
        console.log('Connected to socket server from socketContext');
      });

      const handleReciveMessage = () => {};

      socket.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    }
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket: socket.current }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
