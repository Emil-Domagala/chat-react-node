import XIconSVG from '../../../../assets/Icons/XIconSVG';
import { useUser } from '../../../../store/userContext';
import { deleteContactHandler } from '../../../../utils/httpContact';
import UserItem from '../../../UI/Chat/UserItem';
import classes from './Contact.module.css';
import type { ContactDetail, User } from '../../../../store/userContext';
import { useChatContext } from '../../../../store/chatContext';

type handleContactInfo = {
  chatId: string;
  image: string;
  lastName: string;
  firstName: string;
  color: number;
  _id: string;
};

const Contact = ({ chatId, image, lastName, firstName, color, _id }: handleContactInfo) => {
  const { user, setUser } = useUser();
  const { currentChatId, setContact } = useChatContext();

  const contact = { image, lastName, firstName, color, _id };

  const handleDeleteContact = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const resData = await deleteContactHandler(_id, chatId);
      if (resData.deletedUserId) {
        const isContactDetail = (contactId: string | ContactDetail): contactId is ContactDetail =>
          typeof contactId !== 'string';
        const updatedContacts = user!.contacts!.filter(
          (contact) => isContactDetail(contact.contactId) && contact.contactId._id !== resData.deletedUserId,
        );
        const updatedUser = { ...user, contacts: updatedContacts };
        setUser(updatedUser as User);
        sessionStorage.removeItem(`messages_${chatId}`);
        if (currentChatId === chatId) {
          setContact(undefined, undefined);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChoseCurrentContact = () => {
    setContact(contact, chatId);
  };

  return (
    <li onClick={handleChoseCurrentContact} className={`${classes['contact']}`}>
      <UserItem imageURL={image} lastName={lastName} firstName={firstName} userColor={+color!} />
      <button className={`${classes['svg']}`} onClick={handleDeleteContact}>
        <XIconSVG />
      </button>
    </li>
  );
};

export default Contact;
