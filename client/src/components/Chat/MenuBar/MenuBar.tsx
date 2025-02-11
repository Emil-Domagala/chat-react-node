import Logo from './Logo';
import OptionHeader from './OptionHeader';
import ProfileBar from './UserMenuBar';
import classes from './MenuBar.module.css';
import SearchContactsModal from './SearchContactModal/SearchContactsModal';
import { useState } from 'react';
import { useUser } from '../../../store/userContext';
import Contact from './ContactItem/Contact';
import GroupItem from './Group/GroupItem/GroupItem';
import EditGroupModal from './Group/EditChanelModal/EditGroupModal';

const MenuBar = () => {
  const { user } = useUser();
  const [showSearchContactsModal, setShowSearchContactsModal] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);

  const turnOnEditGroup = () => setShowEditGroup(true);
  const turnOffEditGroup = () => setShowEditGroup(false);
  const turnOnSearchModal = () => setShowSearchContactsModal(true);
  const turnOffSearchModal = () => setShowSearchContactsModal(false);

  return (
    <div className={classes['side-bar']}>
      <div className={classes['top']}>
        <Logo />
        <OptionHeader turnOn={turnOnSearchModal}>Direct Messages</OptionHeader>
        {showSearchContactsModal && <SearchContactsModal turnOff={turnOffSearchModal} />}

        <ul className={classes['contacts-list']}>
          {user?.contacts!.map((contact) => {
            return (
              <Contact
                lastMessage={contact.chatId.lastMessage}
                chatId={contact.chatId._id}
                key={contact.contactId._id}
                _id={contact.contactId._id}
                image={contact.contactId.image}
                firstName={contact.contactId.firstName}
                lastName={contact.contactId.lastName}
                color={+contact.contactId.color!}
              />
            );
          })}
        </ul>

        <OptionHeader turnOn={turnOnEditGroup}>Group Chats</OptionHeader>
        {showEditGroup && <EditGroupModal turnOff={turnOffEditGroup} />}

        <ul className={classes['contacts-list']}>
          {user?.groups!.map((group) => {
            return (
              <GroupItem
                key={group.groupId._id}
                groupId={group.groupId._id}
                groupName={group.groupId.name}
                groupAdminId={group.groupId.admin}
                lastMessage={group.chatId.lastMessage}
                chatId={group.chatId._id}
              />
            );
          })}
        </ul>
      </div>
      <ProfileBar />
    </div>
  );
};

export default MenuBar;
