import Chat from '../components/Chat/Chat';
import { ChatContextProvider } from '../store/chatContext';

const ChatPage = () => {
  return (
    <ChatContextProvider>
      <Chat />
    </ChatContextProvider>
  );
};
export default ChatPage;
