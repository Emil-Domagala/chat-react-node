import { useChatContext } from '../../../../store/chatContext';
import { useUser } from '../../../../store/userContext';
import { fetchMessagestHTTP } from '../../../../utils/httpMessages';
import classes from './MessagesWindow.module.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import Message from './Message';

const MessagesWindow = (props) => {
  const { currentChatId } = useChatContext();
  const [messages, setMessages] = useState(() => {
    const storedMessages = sessionStorage.getItem(`messages_${currentChatId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const [page, setPage] = useState(1);
  const { user } = useUser();

  const topRef = useRef(null);
  const chatBoxRef = useRef(null);


  const fetchMessages = async () => {
    try {
      const messages = await fetchMessagestHTTP(currentChatId!, page);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  useEffect(() => {
    fetchMessages();
  }, [page]);

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
