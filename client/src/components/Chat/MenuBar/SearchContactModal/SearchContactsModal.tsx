import classes from './SearchContactsModal.module.css';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Form/Input';
import { addContactHTTP, searchContactHTTP } from '../../../../utils/httpContact';
import { useState } from 'react';
import UserItem from '../../../UI/Chat/UserItem';
import Lottie from '../../../UI/Lottie/Lottie';
import { useUser } from '../../../../store/userContext';
import type { ContactDetail } from '../../../../store/userContext';

const SearchContactsModal = ({ turnOff }: { turnOff: React.MouseEventHandler<HTMLElement> }) => {
  const { saveUserOnContactAdd } = useUser();
  const [foundContact, setFoundContact] = useState([]);

  const searchContact = async (searchTerm: string) => {
    if (searchTerm.length <= 0) return setFoundContact([]);
    try {
      const resData = await searchContactHTTP(searchTerm);
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
    try {
      const addedContact = await addContactHTTP(item._id);
      saveUserOnContactAdd(addedContact.newContact);
    } catch (err) {
      console.log(err);
    }
    // @ts-expect-error it just works
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
              <Lottie size={100} />
            </div>
          )}
        </div>
      </>
    </Modal>
  );
};

export default SearchContactsModal;
