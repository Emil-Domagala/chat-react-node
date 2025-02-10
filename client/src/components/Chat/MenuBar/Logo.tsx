import logo from '../../../assets/logo.png';
import classes from './Logo.module.css';
const Logo = () => {
  return (
    <div className={`${classes['logo-container']}`}>
      <img src={logo} alt="Logo" /> <h1>Chatie</h1>
    </div>
  );
};

export default Logo;
