import XIconSVG from '../../../assets/Icons/XIconSVG';
import UserItem from '../../UI/Chat/UserItem';
import classes from './RecipientInfo.module.css';

const RecipientInfo = () => {

  

  const userColor = 0;
  const firstName = 'Kamil';
  const lastName = 'Nowak';
  const imageUrl = '/uploads/profiles/679948dc8cb24747c3c04333-2025-01-28T22:11:42.346Z.jpg';

  return (
    <div className={classes['recipient-info-wrapper']}>
      <UserItem imageURL={imageUrl} lastName={lastName} firstName={firstName} userColor={userColor} />
      <button  className={classes['svg']}>
        <XIconSVG />
      </button>
    </div>
  );
};

export default RecipientInfo;
