import { useChatContext } from '../../../../store/chatContext';
import classes from './MessagesWrapper.module.css';
import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import Loading from '../../../UI/Loading/Loading';
import { useChatMessages } from '../../../../hooks/useChatMessages';
import { useInView } from 'react-intersection-observer';
import { useUser } from '../../../../store/userContext';

const MessagesWrapper = () => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { currentChatId } = useChatContext();
  const { user } = useUser();
  const { data, error, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages(currentChatId!);
  const { ref, inView } = useInView();
  const [blockScrollingDown, setBlockScrollingDown] = useState(false);

  useEffect(() => {
    if (inView) {
      const container = messagesContainerRef.current;
      if (container) {
        const previousScrollHeight = container.scrollHeight;
        fetchNextPage().then(() => {
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop += newScrollHeight - previousScrollHeight;
          });
        });
      }
      setBlockScrollingDown(true);
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    setBlockScrollingDown(false);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [currentChatId]);

  useEffect(() => {
    if (blockScrollingDown) return;
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [data]);

  const renderMessages = () => {
    let lastDate: string | null = null;
    let prevSender: string | null = null;
    const messages = data!.pages.flatMap((page) => page.messages).reverse();
    return messages.map((msg) => {
      const formattedDate = new Date(msg.createdAt).toLocaleDateString('en-GB');
      const formattedTime = new Date(msg.createdAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const showSender = prevSender != msg.sender._id && msg.sender._id != user!.id;
      const showDate = formattedDate != lastDate;
      const addMargin = prevSender != msg.sender._id;
      lastDate = formattedDate;
      prevSender = msg.sender._id;
      const senderName = `${msg.sender.firstName} ${msg.sender.lastName}`;

      return (
        <Message
          addMargin={addMargin}
          time={formattedTime}
          key={msg._id}
          isFirstMessageOfDay={showDate}
          formattedDate={formattedDate}
          showSender={showSender}
          senderId={msg.sender._id}
          senderName={senderName}>
          {msg.content}
        </Message>
      );
    });
  };

  return status === 'pending' ? (
    <Loading />
  ) : status === 'error' ? (
    <p>{error.message}</p>
  ) : (
    <div ref={messagesContainerRef} className={classes.all}>
      <div ref={ref} className={classes.ref}>
        {isFetchingNextPage && <p>Loading more messages...</p>}
        {!hasNextPage && !data && <p>Start converastion</p>}
        {!hasNextPage && data && <p>There is no more messages</p>}
      </div>
      {renderMessages()}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessagesWrapper;
