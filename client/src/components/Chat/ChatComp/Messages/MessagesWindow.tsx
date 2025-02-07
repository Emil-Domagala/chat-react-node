import { useChatContext } from '../../../../store/chatContext';
import { useUser } from '../../../../store/userContext';
import classes from './MessagesWindow.module.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import Message from './Message';
import { useSocket } from '../../../../store/socketContext';

const MessagesWindow = (props) => {
  const { currentChatId } = useChatContext();

  const [page, setPage] = useState(1);
  const { user } = useUser();

  const topRef = useRef(null);
  const chatBoxRef = useRef(null);

  const { messages, fetchMessages } = useSocket();

  useEffect(() => {
    fetchMessages(currentChatId!, page);
  }, [currentChatId]);

  return (
    <div ref={chatBoxRef} className={classes.all}>
      {messages.map((msg) => {
        return (
          <Message key={msg._id} sender={msg.sender._id}>
            {msg.content}
          </Message>
        );
      })}
      <div id="topRefObserver" ref={topRef} style={{ height: '10px', width: '20px', background: 'red' }}>
        HERE
      </div>
    </div>
  );
};

export default MessagesWindow;
