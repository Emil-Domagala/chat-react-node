import XIconSVG from '../../../../assets/Icons/XIconSVG';
import { useUser } from '../../../../store/userContext';
import { deleteContactHTTP } from '../../../../utils/httpContact';
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
  const { saveUserOnContactDeletion } = useUser();
  const { currentChatId, setContact } = useChatContext();

  const contact = { image, lastName, firstName, color, _id };

  const handleDeleteContact = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const resData = await deleteContactHTTP(_id, chatId);
      if (resData.deletedUserId) {
        saveUserOnContactDeletion(resData.deletedUserId, chatId);
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
