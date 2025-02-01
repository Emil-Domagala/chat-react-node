import Avatar from '../Avatar/Avatar';
import NameField from './NameField';
import classes from './UserItem.module.css';

const UserItem = ({
  imageURL,
  lastName,
  firstName,
  userColor,
}: {
  imageURL?: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  userColor: number;
}) => {
  const serverURL = import.meta.env.VITE_SERVER_URL;

  let pathUrl;
  if (typeof imageURL === 'string') pathUrl = serverURL + imageURL;

  return (
    <div className={classes['info-wrapper']}>
      <div className={classes['avatar-wrapper']}>
        <Avatar fontSize={2.25} userColor={userColor} imageUrl={pathUrl} firstName={firstName} />
      </div>
      <NameField firstName={firstName} lastName={lastName} />
    </div>
  );
};

export default UserItem;
