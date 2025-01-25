import AuthForm from './AuthForm';
import VictorySVG from '../Icons/VictorySVG';
import classes from './Auth.module.css';

const Auth = () => {
  return (
    <div className="con">
      <div className={classes["text-container"]}>
        <div className={`${classes['header-text']}`}>
          <h1>Welcome </h1>
          <div className={`${classes['svg-wrapper']}`}>
            <VictorySVG />
          </div>
        </div>
        <p>Fill in the details to get started with the best chat app!</p>
      </div>
      <AuthForm />
      <img className="login__image" src="" alt="" />
    </div>
  );
};
export default Auth;
