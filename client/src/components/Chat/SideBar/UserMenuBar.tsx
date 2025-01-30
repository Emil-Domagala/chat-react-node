import { useEffect, useState } from 'react';
import { useUser } from '../../../store/userContext';
import MoonSVG from '../../../assets/Icons/MoonSVG';
import SunSVG from '../../../assets/Icons/SunSVG';
import TurnOffSVG from '../../../assets/Icons/TurnOffSVG';
import Avatar from '../../UI/Avatar/Avatar';
import classes from './UserMenuBar.module.css';
import { Link } from 'react-router';
import NameField from '../../UI/Chat/NameField';

const UserMenuBar = () => {
  const serverURL = import.meta.env.VITE_SERVER_URL;

  const { user } = useUser();
  const [mode, setMode] = useState<'light' | 'dark'>();
  const userColor = user?.color || 0;

  useEffect(() => {
    const initialMode: 'light' | 'dark' = (localStorage.getItem('color-mode') as 'light' | 'dark') || 'light';
    setMode(initialMode);
  }, []);

  let imagePath;
  if (user?.image) imagePath = `${serverURL}${user?.image}`;
  console.log(imagePath);

  const handleLogout = () => {};

  const handleChangeMode = () => {
    const setModeCol = mode === 'light' ? 'dark' : 'light';

    const body = document.querySelector('body');
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    body!.setAttribute('color-mode', setModeCol!);
    localStorage.setItem('color-mode', setModeCol!);
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
        {/* <p className={classes.nameField}>
          {user?.firstName} {user?.lastName}
        </p> */}
      </Link>
      <div className={classes['buttons']}>
        <button className={`${classes['svg']} ${classes[mode || 'light']}`} onClick={handleChangeMode}>
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
