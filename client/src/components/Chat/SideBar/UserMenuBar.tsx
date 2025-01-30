import { useUser } from '../../../store/userContext';
import MoonSVG from '../../../assets/Icons/MoonSVG';
import SunSVG from '../../../assets/Icons/SunSVG';
import TurnOffSVG from '../../../assets/Icons/TurnOffSVG';
import Avatar from '../../UI/Avatar/Avatar';
import classes from './UserMenuBar.module.css';
import { Link, useNavigate } from 'react-router';
import NameField from '../../UI/Chat/NameField';
import { logoutHandler } from '../../../utils/httpAuth';

const UserMenuBar = () => {
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_SERVER_URL;

  const { user, setUser, mode, setLightColorMode, setDarkColorMode } = useUser();
  const userColor = user?.color || 0;

  const toggleChangeColorMode = () => {
    if (mode === 'light') return setDarkColorMode();
    else return setLightColorMode();
  };

  let imagePath;
  if (user?.image) imagePath = `${serverURL}${user?.image}`;
  console.log(imagePath);

  const handleLogout = async () => {
    try {
      const resData = await logoutHandler();
      if (resData) return navigate('/'), setUser(undefined);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes['profile-bar--container']}>
      <Link to="/profile" className={classes['profile-link']}>
        <div className={classes['avatar-wrapper']}>
          <Avatar
            userColor={userColor}
            imageUrl={serverURL + user?.image}
            email={user?.email}
            firstName={user?.firstName}
          />
        </div>
        <NameField firstName={user?.firstName} lastName={user?.lastName} />
      </Link>
      <div className={classes['buttons']}>
        <button className={`${classes['svg']} ${classes[mode || 'light']}`} onClick={toggleChangeColorMode}>
          {mode === 'dark' ? <MoonSVG /> : <SunSVG />}
        </button>
        <button className={`${classes['svg']} ${classes.turnOff}`} onClick={handleLogout}>
          <TurnOffSVG />
        </button>
      </div>
    </div>
  );
};

export default UserMenuBar;
