import XIconSVG from '../../../assets/Icons/XIconSVG';
import Avatar from '../../UI/Avatar/Avatar';
import NameField from '../../UI/Chat/NameField';
import classes from './RecipientInfo.module.css';

const RecipientInfo = ({ onClick }: { onClick: () => void }) => {
  const serverURL = import.meta.env.VITE_SERVER_URL;
  const userColor = 0;
  const firstName = 'Kamil';
  const lastName = 'Nowak';
  const imageUrl = '/uploads/profiles/679948dc8cb24747c3c04333-2025-01-28T22:11:42.346Z.jpg';

  return (
    <div className={classes['recipient-info-wrapper']}>
      <div className={classes['info-wrapper']}>
        <div className={classes['avatar-wrapper']}>
          <Avatar userColor={userColor} imageUrl={serverURL + imageUrl} firstName={firstName} />
        </div>
        <NameField firstName={firstName} lastName={lastName} />
      </div>
      <button onClick={onClick} className={classes['svg']}>
        <XIconSVG />
      </button>
    </div>
  );
};

export default RecipientInfo;
