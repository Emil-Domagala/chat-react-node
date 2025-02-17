import { useUser } from '../../../../store/userContext';
import { colors } from '../../../../utils/getColors';
import classes from './Message.module.css';

type MessageCompType = {
  addMargin: boolean;
  time: string;
  children: string;
  senderId: string;
  showSender: boolean;
  senderName: string;
  isFirstMessageOfDay: boolean;
  formattedDate: string;
  messageType: string;
  imageUrl?: string;
};

const Message = ({
  addMargin,
  time,
  children,
  senderId,
  showSender,
  senderName,
  isFirstMessageOfDay,
  formattedDate,
  messageType,
  imageUrl,
}: MessageCompType) => {
  const { user } = useUser();
  const userColor = user?.color;

  const messageSide = user?.id === senderId ? 'flex-end' : 'flex-start';
  const messageColor = user?.id === senderId ? null : colors[userColor || 0];

  return (
    <>
      {isFirstMessageOfDay && <p className={classes.date}>{formattedDate}</p>}
      <div
        style={{ ...messageColor, alignSelf: messageSide }}
        className={`${classes.message} ${addMargin ? classes.margin : ''}`}>

        {showSender && <p className={classes.name}>{senderName}</p>}

        {children && (
          <p className={`${classes.content} ${messageType === 'image' ? classes['add-padding'] : ''}`}>{children}</p>
        )}

        {messageType === 'image' && <img loading="lazy" className={classes['img']} src={imageUrl} />}
        
        <p className={classes.time}>{time}</p>
      </div>
    </>
  );
};

export default Message;
