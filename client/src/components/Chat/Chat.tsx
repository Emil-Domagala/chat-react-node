import ChatComp from './ChatComp/ChatComp';
import EmptyChat from './EmptyChat/EmptyChat';
import SideBar from './SideBar/SideBar';
import classes from './Chat.module.css';
import { useState } from 'react';

const Chat = () => {
  const [showEmpty, setShowEmpty] = useState<boolean>(false);

  const handleShowEmpty = () => {
    setShowEmpty((prev): boolean => !prev);
  };

  return (
    <div className={classes['chat-page']}>
      <SideBar />
      {showEmpty ? <EmptyChat /> : <ChatComp onClick={handleShowEmpty} />}
    </div>
  );
};

export default Chat;
