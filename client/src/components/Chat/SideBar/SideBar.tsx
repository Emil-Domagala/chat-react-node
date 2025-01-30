import Logo from './Logo';
import OptionHeader from './OptionHeader';
import ProfileBar from './UserMenuBar';
import classes from './SideBar.module.css';

const SideBar = () => {
  const handleOpenGroups = () => {};

  return (
    <div className={classes['side-bar']}>
      <div className={classes['top']}>
        <Logo />
        <OptionHeader onClick={handleOpenGroups}>Direct Messages</OptionHeader>
        <OptionHeader onClick={handleOpenGroups}>Group Chats</OptionHeader>
      </div>

      <ProfileBar />
    </div>
  );
};

export default SideBar;
