import classes from './SearchContactsModal.module.css';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Form/Input';
import { addContactHandler, searchContactHandler } from '../../../../utils/httpContact';
import { useState } from 'react';

import UserItem from '../../../UI/Chat/UserItem';
import LottieComp from '../../../UI/Lottie/Lottie';
import { useUser } from '../../../../store/userContext';

type User = {
  _id: string;
  userColor: number;
  image?: string;
  firstName: string;
  lastName: string;
};

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

  const addNewContact = async (item) => {
    try {
      const addedContact = await addContactHandler(item._id);
      console.log(addedContact);
      if (!addedContact || !addedContact.newContact) {
        console.log('Failed to add contact');
        return;
      }
      const existingContacts = Array.isArray(user?.contacts) ? user.contacts : [];

      const updatedUser = {
        ...user,
        contacts: [...existingContacts, item],
      };

      setUser(updatedUser);
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
            foundContact.map((item: User) => (
              <div onClick={() => addNewContact(item)} key={item._id} className={classes['chat-link']}>
                <UserItem
                  userColor={item.userColor}
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
