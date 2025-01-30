import MessaggeBar from './MessageBar';
import RecipientInfo from './RecipientInfo';
import classes from './ChatComp.module.css';

const ChatComp = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={classes['whole-chat']}>
      <RecipientInfo onClick={onClick} />
      <MessaggeBar />
    </div>
  );
};

export default ChatComp;
