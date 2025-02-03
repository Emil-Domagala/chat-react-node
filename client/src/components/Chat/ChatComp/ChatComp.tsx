import MessaggeBar from './MessageBar';
import RecipientInfo from './RecipientInfo';
import classes from './ChatComp.module.css';
import { useChatContext } from '../../../store/chatContext';

const ChatComp = () => {
  const { currentContact } = useChatContext();

  return (
    <div className={classes['whole-chat']}>
      <RecipientInfo currentContact={currentContact!} />
      <MessaggeBar />
    </div>
  );
};

export default ChatComp;
