import Avatar from '../Avatar/Avatar';
import NameField from './NameField';
import classes from './UserItem.module.css';

const UserItem = ({
  imageURL,
  lastName,
  firstName,
  userColor,
  email,
}: {
  imageURL?: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  userColor: number;
}) => {
  return (
    <div className={classes['info-wrapper']}>
      <div className={classes['avatar-wrapper']}>
        <Avatar fontSize={2.25} userColor={userColor} imageUrl={imageURL} firstName={firstName} email={email} />
      </div>
      <NameField firstName={firstName} lastName={lastName} email={email} />
    </div>
  );
};

export default UserItem;
