import XIconSVG from '../../../../../assets/Icons/XIconSVG';
import type { ContactDetail } from '../../../../../store/userContext';
import classes from './AddedUser.module.css';
const AddedUser = ({ contact, onClick }: { contact: ContactDetail; onClick: (contact: ContactDetail) => void }) => {
  return (
    <li className={classes['added-user']}>
      <p>{contact.firstName + ' ' + contact.lastName}</p>
      <button onClick={() => onClick(contact)} className={classes['delete']}>
        <XIconSVG />
      </button>
    </li>
  );
};

export default AddedUser;
