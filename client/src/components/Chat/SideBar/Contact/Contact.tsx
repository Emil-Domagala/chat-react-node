import XIconSVG from '../../../../assets/Icons/XIconSVG';
import { useUser } from '../../../../store/userContext';
import { deleteContactHandler } from '../../../../utils/httpContact';
import UserItem from '../../../UI/Chat/UserItem';
import classes from './Contact.module.css';
import type { Contact, User } from '../../../../store/userContext';

const Contact = ({
  image,
  lastName,
  firstName,
  color,
  _id,
}: Contact) => {
  const { user, setUser } = useUser();

  const handleDeleteContact = async () => {
    try {
      const resData = await deleteContactHandler(_id);
      console.log(resData);
      if (resData.deletedUserId) {
        console.log('object');
        const updatedContacts = user!.contacts!.filter((contact) => (contact as Contact)._id !== resData.deletedUserId);
        const updatedUser = { ...user, contacts: updatedContacts };
        setUser(updatedUser as User);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li className={`${classes['contact']}`}>
      <UserItem imageURL={image} lastName={lastName} firstName={firstName} userColor={+color!} />
      <div className={`${classes['svg']}`} onClick={handleDeleteContact}>
        <XIconSVG />
      </div>
    </li>
  );
};

export default Contact;
