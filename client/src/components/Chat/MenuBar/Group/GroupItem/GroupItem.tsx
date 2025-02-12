import { useState } from 'react';
import EditSVG from '../../../../../assets/Icons/EditSVG';
import XIconSVG from '../../../../../assets/Icons/XIconSVG';
import { useChatContext } from '../../../../../store/chatContext';
import { useUser } from '../../../../../store/userContext';
import { deleteGroupHTTP, leaveGroupHTTP } from '../../../../../utils/httpGroup';
import NameField from '../../../../UI/Chat/NameField';
import classes from './GroupItem.module.css';
import EditGroupModal from '../EditChanelModal/EditGroupModal';

type GroupItemProps = {
  groupId: string;
  groupName: string;
  lastMessage: string | null;
  groupAdminId: string;
  chatId: string;
};

const GroupItem = ({ groupId, groupName, lastMessage, groupAdminId, chatId }: GroupItemProps) => {
  const { user, saveUserOnGroupDeletion } = useUser();
  const { setGroup } = useChatContext();
  const [editGroupIsOpen, setEditGroupIsOpen] = useState(false);
  const isAdmin = groupAdminId === user!.id;
  const group = { _id: groupId, admin: groupAdminId, name: groupName };

  const handleChoseCurrentGroup = () => {
    setGroup(group, chatId);
  };

  const handleDeleteGroup = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    try {
      if (isAdmin) {
        const resData = await deleteGroupHTTP(groupId, chatId);
        saveUserOnGroupDeletion(resData.deletedGroup.groupId);
        return;
      }
      if (!isAdmin) {
        const resData = await leaveGroupHTTP(groupId);
        console.log(resData);
        saveUserOnGroupDeletion(resData.groupId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {editGroupIsOpen && isAdmin && (
        <EditGroupModal
          groupId={groupId}
          turnOff={() => {
            setEditGroupIsOpen(false);
          }}
        />
      )}
      <li onClick={handleChoseCurrentGroup} className={`${classes['group']}`}>
        {lastMessage !== user!.id && lastMessage !== null && <div className={classes['new-message']} />}
        <NameField groupName={groupName} />
        <span className={classes['buttons']}>
          {isAdmin && (
            <button
              className={`${classes['edit']}`}
              onClick={(e) => {
                e.stopPropagation();
                setEditGroupIsOpen(true);
              }}>
              <EditSVG />
            </button>
          )}

          <button
            className={`${classes['delete']}`}
            onClick={(event) => {
              handleDeleteGroup(event);
            }}>
            <XIconSVG />
          </button>
        </span>
      </li>
    </>
  );
};

export default GroupItem;
