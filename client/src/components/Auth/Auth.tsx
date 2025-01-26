import AuthForm from './AuthForm';
import VictorySVG from '../Icons/VictorySVG';
import classes from './Auth.module.css';
import LottieComp from '../UI/Lottie/Lottie';
import loginImage from '../../assets/login2.png';

const Auth = () => {
  return (
    <div className={`fl-col ${classes['auth-wrapper']}`}>
      <div className={classes['form-wrapper']}>
        <div className={classes['lottie-wrapper']}>
          <LottieComp />
        </div>
        <div className={classes['text-container']}>
          <div className={`${classes['header-text']}`}>
            <h1>Welcome </h1>
            <div className={`${classes['svg-wrapper']}`}>
              <VictorySVG />
            </div>
          </div>
          <p>Fill in the details to get started with the best chat app!</p>
        </div>
        <AuthForm />
      </div>

      <div className={classes['image-wrapper']}>
        <img className={classes['login__image']} src={loginImage} alt="Login image" />
      </div>
    </div>
  );
};
export default Auth;
