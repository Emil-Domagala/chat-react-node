import { useUser } from '../../../../store/userContext';
import { colors } from '../../../../utils/getColors';
import classes from './Message.module.css';

const Message = ({ children, sender }) => {
  const { user } = useUser();
  const userColor = user?.color;

  const messageSide = user?.id === sender ? 'flex-end' : 'flex-start';
  const messageColor = user?.id === sender ? null : colors[userColor || 0];

  return (
    <div style={{ ...messageColor, alignSelf: messageSide }} className={classes.message}>
      {children}
    </div>
  );
};

export default Message;
