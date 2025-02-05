import { useUser } from '../../store/userContext';
import ArrowBackSVG from '../../assets/Icons/ArrowBackSVG';
import ProfileForm from './ProfileForm';
import classes from './Profile.module.css';
import { Link } from 'react-router';

const Profile = () => {
  const { user } = useUser();
  return (
    <div className={`${classes['card']}`}>
      {user?.profileSetup === true ? (
        <Link to={'/chat'}>
          <div className={classes['svg']}>
            <ArrowBackSVG />
          </div>
        </Link>
      ) : (
        <h1 className={classes.header}>Set up your account to continue</h1>
      )}
      <ProfileForm />
    </div>
  );
};
export default Profile;
