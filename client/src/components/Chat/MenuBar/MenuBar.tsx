import Logo from './Logo';
import OptionHeader from './OptionHeader';
import ProfileBar from './UserMenuBar';
import classes from './MenuBar.module.css';
import SearchContactsModal from './SearchContactModal/SearchContactsModal';
import { useState } from 'react';
import { useUser } from '../../../store/userContext';
import Contact from './ContactItem/Contact';

const MenuBar = () => {
  const { user } = useUser();
  const [showSearchContactsModal, setShowSearchContactsModal] = useState(false);

  const handleOpenGroups = () => {};
  const turnOnSearchModal = () => {
    setShowSearchContactsModal(true);
  };
  const turnOffSearchModal = () => {
    setShowSearchContactsModal((prev) => !prev);
  };

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

        <OptionHeader turnOn={handleOpenGroups}>Group Chats</OptionHeader>
      </div>
      <ProfileBar />
    </div>
  );
};

export default MenuBar;
