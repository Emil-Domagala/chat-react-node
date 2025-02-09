import { useUser } from '../../../../store/userContext';
import { colors } from '../../../../utils/getColors';
import classes from './Message.module.css';

const Message = ({ time, children, senderId, showSender, senderName, isFirstMessageOfDay, formattedDate }) => {
  const { user } = useUser();
  const userColor = user?.color;

  const messageSide = user?.id === senderId ? 'flex-end' : 'flex-start';
  const messageColor = user?.id === senderId ? null : colors[userColor || 0];

  return (
    <>
      {isFirstMessageOfDay && <p className={classes.date}>{formattedDate}</p>}
      <div style={{ ...messageColor, alignSelf: messageSide }} className={classes.message}>
        {showSender && <p className={classes.name}>{senderName}</p>}
        <p className={classes.content}>{children}</p>
        <p className={classes.time}>{time}</p>
      </div>
    </>
  );
};

export default Message;
