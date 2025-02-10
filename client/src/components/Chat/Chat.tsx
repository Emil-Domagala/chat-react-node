import ChatComp from './MainChat/MainChat';
import EmptyChat from './EmptyChat/EmptyChat';
import MenuBar from './MenuBar/MenuBar';
import classes from './Chat.module.css';
import { useState, useEffect } from 'react';
import { useChatContext } from '../../store/chatContext';

const Chat = () => {
  const { currentChatId } = useChatContext();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function updateWindowWidth() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWindowWidth);
    updateWindowWidth();
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  return (
    <div className={classes['chat-page']}>
      {windowWidth < 992 && (currentChatId ? <ChatComp /> : <MenuBar />)}
      {windowWidth >= 992 && (
        <>
          <MenuBar /> {currentChatId ? <ChatComp /> : <EmptyChat />}
        </>
      )}
    </div>
  );
};

export default Chat;
