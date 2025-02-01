import { colors } from '../../../utils/getColors';
import classes from './Avatar.module.css';

type AvatarType = {
  userColor?: number;
  imageUrl?: string;
  email?: string;
  firstName?: string;
  fontSize: number;
};

const Avatar = ({ email, firstName, imageUrl, userColor, fontSize }: AvatarType) => {
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
        <p style={{ fontSize: fontSize + 'rem' }}>{firstName?.charAt(0)}</p>
      ) : (
        <p style={{ fontSize: fontSize + 'rem' }}>{email?.charAt(0)}</p>
      )}
    </div>
  );
};

export default Avatar;
