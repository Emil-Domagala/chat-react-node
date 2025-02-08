import { useChatContext } from '../../../../store/chatContext';
import classes from './MessagesWindow.module.css';
import { useEffect } from 'react';
import Message from './Message';
import Loading from '../../../UI/Loading/Loading';
import { useChatMessages } from '../../../../hooks/useChatMessages';
import { useInView } from 'react-intersection-observer';

const MessagesWindow = (props) => {
  const { currentChatId } = useChatContext();
  const { data, error, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages(currentChatId!);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const renderMessages = () => {
    const messages = data!.pages.flatMap((page) => page.messages); 
    return messages.map((msg, index) => {
      const formattedDate = new Date(msg.createdAt).toLocaleDateString('en-GB'); 
      const nextMsgDate = messages[index + 1]?.createdAt
        ? new Date(messages[index + 1].createdAt).toLocaleDateString('en-GB')
        : null;

      const isLastMessageOfDay = formattedDate !== nextMsgDate;

      return (
        <Message
          key={msg._id}
          isFirstMessageOfDay={isLastMessageOfDay}
          formattedDate={formattedDate}
          sender={msg.sender._id}>
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
    <div className={classes.all}>
      {renderMessages()}
      <div ref={ref} className={classes.ref}>
        {isFetchingNextPage && <p>Loading more messages...</p>}
        {!hasNextPage && !data && <p>Start converastion</p>}
        {!hasNextPage && data && <p>There is no more messages</p>}
      </div>
    </div>
  );
};

export default MessagesWindow;
