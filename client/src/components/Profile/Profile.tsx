import { useUser } from '../../store/userContext';
import ArrowBackSVG from '../Icons/ArrowBackSVG';
import ProfileForm from './ProfileForm';
import classes from './Profile.module.css';

const Profile = () => {
  const { user } = useUser();
  // console.log(user);
  return (
    <div className={`${classes['card']}`}>
      <div className={classes['svg']}>
        <ArrowBackSVG />
      </div>
      <ProfileForm />
    </div>
  );
};
export default Profile;
