import MessaggeBar from './MessageBar';
import RecipientInfo from './RecipientInfo';
import classes from './ChatComp.module.css';

const ChatComp = () => {
  return (
    <div className={classes['whole-chat']}>
      <RecipientInfo />
      <MessaggeBar />
    </div>
  );
};

export default ChatComp;
