import MessaggeBar from './MessageBar';
import RecipientInfo from './RecipientInfo';
import classes from './ChatComp.module.css';
import MessagesWindow from './Messages/MessagesWindow';

const ChatComp = () => {

  return (
    <div className={classes['whole-chat']}>
      <RecipientInfo />
      <MessagesWindow/>
      <MessaggeBar />
    </div>
  );
};

export default ChatComp;
