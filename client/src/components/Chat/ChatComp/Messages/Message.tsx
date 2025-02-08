import { useUser } from '../../../../store/userContext';
import { colors } from '../../../../utils/getColors';
import classes from './Message.module.css';

const Message = ({ children, sender, isFirstMessageOfDay, formattedDate }) => {
  const { user } = useUser();
  const userColor = user?.color;

  const messageSide = user?.id === sender ? 'flex-end' : 'flex-start';
  const messageColor = user?.id === sender ? null : colors[userColor || 0];

  return (
    <>
      {isFirstMessageOfDay && <p className={classes.date}>{formattedDate}</p>}
      <div style={{ ...messageColor, alignSelf: messageSide }} className={classes.message}>
        {children}
      </div>
    </>
  );
};

export default Message;
