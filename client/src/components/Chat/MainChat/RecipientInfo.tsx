import XIconSVG from '../../../assets/Icons/XIconSVG';
import UserItem from '../../UI/Chat/UserItem';
import classes from './RecipientInfo.module.css';

import { useChatContext } from '../../../store/chatContext';

const RecipientInfo = () => {
  const { setContact, currentContact } = useChatContext();

  const handleEndConv = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setContact(undefined, undefined);
  };

  return (
    <div className={classes['recipient-info-wrapper']}>
      <UserItem
        imageURL={currentContact?.image}
        lastName={currentContact!.lastName}
        firstName={currentContact!.firstName}
        userColor={+currentContact!.color!}
      />
      <button className={classes['svg']} onClick={handleEndConv}>
        <XIconSVG />
      </button>
    </div>
  );
};

export default RecipientInfo;
