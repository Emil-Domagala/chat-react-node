import SendMessaggeBar from './SendMessageBar';
import RecipientInfo from './RecipientInfo';
import classes from './MainChat.module.css';
import MessagesWrapper from './Messages/MessagesWrapper';

const MainChat = () => {
  return (
    <main className={classes['main-chat']}>
      <RecipientInfo />
      <MessagesWrapper />
      <SendMessaggeBar />
    </main>
  );
};

export default MainChat;
