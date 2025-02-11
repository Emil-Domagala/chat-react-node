import EditSVG from '../../../../../assets/Icons/EditSVG';
import XIconSVG from '../../../../../assets/Icons/XIconSVG';
import { useChatContext } from '../../../../../store/chatContext';
import { useUser } from '../../../../../store/userContext';
import { deleteGroupHTTP } from '../../../../../utils/httpGroup';
import NameField from '../../../../UI/Chat/NameField';
import classes from './GroupItem.module.css';

type GroupItemProps = {
  groupId: string;
  groupName: string;
  lastMessage: string | null;
  groupAdminId: string;
  chatId: string;
};

const GroupItem = ({ groupId, groupName, lastMessage, groupAdminId, chatId }: GroupItemProps) => {
  const { user } = useUser();
  const { currentChatId, setGroup } = useChatContext();
  const isAdmin = groupAdminId === user!.id;
  const group = { _id: groupId, admin: groupAdminId, name: groupName };

  const handleChoseCurrentGroup = () => {
    setGroup(group, chatId);
  };
  const handleDeleteGroup = async () => {
    try {
      if (isAdmin) {
        const resData = await deleteGroupHTTP(groupId, chatId);
        console.log(resData);
        return;
      }
      if (!isAdmin) return;
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditModal = (groupId) => {};
  return (
    <li onClick={handleChoseCurrentGroup} className={`${classes['group']}`}>
      {lastMessage !== user!.id && lastMessage !== null && <div className={classes['new-message']} />}
      <NameField groupName={groupName} />
      <span className={classes['buttons']}>
        {isAdmin && (
          <button className={`${classes['edit']}`} onClick={handleDeleteGroup}>
            <EditSVG onClick={() => handleEditModal(groupId)} />
          </button>
        )}
        <button className={`${classes['delete']}`} onClick={handleDeleteGroup}>
          <XIconSVG />
        </button>
      </span>
    </li>
  );
};

export default GroupItem;
