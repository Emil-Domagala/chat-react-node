import classes from './SearchContactsModal.module.css';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Form/Input';
import { addContactHandler, searchContactHandler } from '../../../../utils/httpContact';
import { useState } from 'react';
import type { User } from '../../../../store/userContext';
import UserItem from '../../../UI/Chat/UserItem';
import LottieComp from '../../../UI/Lottie/Lottie';
import { useUser } from '../../../../store/userContext';
import type { ContactDetail } from '../../../../store/userContext';

const SearchContactsModal = ({ turnOff }: { turnOff: React.MouseEventHandler<HTMLElement> }) => {
  const { user, setUser } = useUser();
  const [foundContact, setFoundContact] = useState([]);

  const searchContact = async (searchTerm: string) => {
    if (searchTerm.length <= 0) return;
    try {
      const resData = await searchContactHandler(searchTerm);
      if (resData.contacts.length < 1) {
        setFoundContact([]);
        return;
      }

      setFoundContact(resData.contacts);
    } catch (err) {
      console.log(err);
    }
  };

  const addNewContact = async (item: ContactDetail) => {
    console.log(item);
    try {
      const addedContact = await addContactHandler(item._id);
      if (!addedContact || !addedContact.newContact) {
        console.log('Failed to add contact');
        return;
      }
      const existingContacts = Array.isArray(user?.contacts) ? user.contacts : [];

      const contactId = {
        _id: addedContact.newContact._id,
        color: addedContact.newContact.color,
        firstName: addedContact.newContact.firstName,
        lastName: addedContact.newContact.lastName,
        image: addedContact.newContact.image,
      };

      const updatedUser = {
        ...user,
        contacts: [
          ...existingContacts,
          {
            contactId,
            chatId: addedContact.newContact.chatId,
          },
        ],
      };

      setUser(updatedUser as User);
    } catch (err) {
      console.log(err);
    }

    turnOff();
    setFoundContact([]);
  };

  return (
    <Modal onClick={turnOff}>
      <>
        <h2 className={classes.header}>Find contacts</h2>
        <Input placeholder="Search contacts" square onChange={(e) => searchContact(e.target.value.trim())} />
        <div className={classes['founded-contact--wrapper']}>
          {foundContact.length > 0 ? (
            foundContact.map((item: ContactDetail) => (
              <div onClick={() => addNewContact(item)} key={item._id} className={classes['chat-link']}>
                <UserItem
                  userColor={item.color}
                  imageURL={item.image}
                  firstName={item.firstName}
                  lastName={item.lastName}
                />
              </div>
            ))
          ) : (
            <div className={classes['empty']}>
              <LottieComp size={100} />
            </div>
          )}
        </div>
      </>
    </Modal>
  );
};

export default SearchContactsModal;
