import { useUser } from '../../../store/userContext';
import MoonSVG from '../../../assets/Icons/MoonSVG';
import SunSVG from '../../../assets/Icons/SunSVG';
import TurnOffSVG from '../../../assets/Icons/TurnOffSVG';
import classes from './UserMenuBar.module.css';
import { Link, useNavigate } from 'react-router';
import { logoutHTTP } from '../../../utils/httpAuth';
import UserItem from '../../UI/Chat/UserItem';
import { useColorMode } from '../../../store/colorModeContext';
import { useChatContext } from '../../../store/chatContext';

const UserMenuBar = () => {
  const navigate = useNavigate();
  const { mode, setLightColorMode, setDarkColorMode } = useColorMode();
  const { user, setUser } = useUser();
  const { setContact, setGroup } = useChatContext();
  const userColor = user?.color || 0;

  const toggleChangeColorMode = () => {
    if (mode === 'light') return setDarkColorMode();
    else return setLightColorMode();
  };

  const handleLogout = async () => {
    try {
      const resData = await logoutHTTP();
      if (resData)
        return navigate('/'), setUser(undefined), setContact(undefined, undefined), setGroup(undefined, undefined);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes['profile-bar--container']}>
      <Link to="/profile" className={classes['profile-link']}>
        <UserItem imageURL={user?.image} lastName={user?.lastName} firstName={user?.firstName} userColor={userColor} />
      </Link>
      <div className={classes['buttons']}>
        <button className={`${classes['svg']} ${classes[mode ?? 'light']}`} onClick={toggleChangeColorMode}>
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
