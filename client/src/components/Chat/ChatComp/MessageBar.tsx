import ReactTextareaAutosize from 'react-textarea-autosize';
import SendIconSVG from '../../../assets/Icons/SendIconSVG';

import classes from './MessageBar.module.css';

const MessaggeBar = () => {
  return (
    <div className={classes['message-bar--wrapper']}>
      <ReactTextareaAutosize placeholder="Enter your message" minRows={1} maxRows={4} />
      <button className={classes['send-button']}>
        <div className={classes['svg']}>
          <SendIconSVG />
        </div>
      </button>
    </div>
  );
};

export default MessaggeBar;
