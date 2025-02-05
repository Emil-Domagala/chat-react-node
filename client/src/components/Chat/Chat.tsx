import ChatComp from './ChatComp/ChatComp';
import EmptyChat from './EmptyChat/EmptyChat';
import SideBar from './SideBar/SideBar';
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
      {windowWidth < 992 && (currentChatId ? <ChatComp /> : <SideBar />)}
      {windowWidth >= 992 && (
        <>
          <SideBar /> {currentChatId ? <ChatComp /> : <EmptyChat />}
        </>
      )}
    </div>
  );
};

export default Chat;
