import { useChatContext } from '../../../../store/chatContext';
import classes from './MessagesWindow.module.css';
import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import Loading from '../../../UI/Loading/Loading';
import { useChatMessages } from '../../../../hooks/useChatMessages';
import { useInView } from 'react-intersection-observer';
import ArrowBackSVG from '../../../../assets/Icons/ArrowBackSVG';

const MessagesWindow = () => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { currentChatId } = useChatContext();
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
    const messages = data!.pages.flatMap((page) => page.messages).reverse();
    return messages.map((msg, index) => {
      const formattedDate = new Date(msg.createdAt).toLocaleDateString('en-GB');
      const showDate = formattedDate != lastDate;
      lastDate = formattedDate;

      return (
        <Message key={msg._id} isFirstMessageOfDay={showDate} formattedDate={formattedDate} sender={msg.sender._id}>
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

export default MessagesWindow;
