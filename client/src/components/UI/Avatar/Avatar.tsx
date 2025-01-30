import { colors } from '../../../utils/getColors';
import classes from './Avatar.module.css';

type AvatarType = {
  userColor?: number;
  imageUrl?: string;
  email?: string;
  firstName?: string;
};

const Avatar = ({ email, firstName, imageUrl, userColor }: AvatarType) => {
  return (
    <div className={classes['avatar']} style={{ ...colors[userColor || 0] }}>
      {imageUrl ? (
        <div
          className={classes['image']}
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
      ) : firstName !== '' ? (
        <p>{firstName?.charAt(0)}</p>
      ) : (
        <p>{email?.charAt(0)}</p>
      )}
    </div>
  );
};

export default Avatar;
