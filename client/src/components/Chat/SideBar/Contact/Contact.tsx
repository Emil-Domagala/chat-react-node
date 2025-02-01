import XIconSVG from '../../../../assets/Icons/XIconSVG';
import { useUser } from '../../../../store/userContext';
import { deleteContactHandler } from '../../../../utils/httpContact';
import UserItem from '../../../UI/Chat/UserItem';
import classes from './Contact.module.css';

const Contact = ({
  imageUrl,
  lastName,
  firstName,
  userColor,
  _id,
}: {
  imageUrl: string;
  lastName: string;
  firstName: string;
  userColor: number;
  _id: string;
}) => {
  const { user, setUser } = useUser();

  const handleDeleteContact = async () => {
    try {
      const resData = await deleteContactHandler(_id);
      console.log(resData);
      if (resData.deletedUserId) {
        console.log('object');
        const updatedContacts = user!.contacts!.filter((contact) => contact._id !== resData.deletedUserId);
        const updatedUser = { ...user, contacts: updatedContacts };
        setUser(updatedUser);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`${classes['contact']}`}>
      <UserItem imageURL={imageUrl} lastName={lastName} firstName={firstName} userColor={userColor} />
      <div className={`${classes['svg']}`} onClick={handleDeleteContact}>
        <XIconSVG />
      </div>
    </div>
  );
};

export default Contact;
