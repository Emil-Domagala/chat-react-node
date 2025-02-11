import XIconSVG from '../../../assets/Icons/XIconSVG';
import UserItem from '../../UI/Chat/UserItem';
import classes from './RecipientInfo.module.css';

import { useChatContext } from '../../../store/chatContext';
import NameField from '../../UI/Chat/NameField';

const RecipientInfo = () => {
  const { setContact, currentContact, currentGroup, setGroup } = useChatContext();

  const handleEndConv = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setContact(undefined, undefined);
    setGroup(undefined, undefined);
  };

  return (
    <div className={classes['recipient-info-wrapper']}>
      {currentContact ? (
        <UserItem
          imageURL={currentContact?.image}
          lastName={currentContact!.lastName}
          firstName={currentContact!.firstName}
          userColor={+currentContact!.color!}
        />
      ) : (
        <NameField groupName={currentGroup!.name} />
      )}
      <button className={classes['svg']} onClick={handleEndConv}>
        <XIconSVG />
      </button>
    </div>
  );
};

export default RecipientInfo;
