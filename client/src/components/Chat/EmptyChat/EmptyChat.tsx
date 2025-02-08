import Lottie from '../../UI/Lottie/Lottie';
import classes from './EmptyChat.module.css';

const EmptyChat = () => {
  return (
    <div className={classes['chat-container']}>
      <div className={classes['inside']}>
        <Lottie size={200} />
        <h2>
          Hi<span>!</span> Welcome to <span>Chatie</span> App
        </h2>
      </div>
    </div>
  );
};

export default EmptyChat;
