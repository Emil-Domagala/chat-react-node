import { useState } from 'react';
import classes from './Input.module.css';
import OpenEyeSVG from '../../Icons/OpenEyeSVG';
import CloseEyeSVG from '../../Icons/CloseEyeSVG';

function Input({ isPassword, isTextarea, className, type, ...props }) {
  const [isTypePassword, setIsTypePassword] = useState('password');

  const handleType = () => {
    setIsTypePassword((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <>
      {isTextarea && <textarea className={classes.main} {...props}></textarea>}
      {isPassword && (
        <div className={classes.input__wrapper}>
          <input type={isTypePassword} className={classes.main} {...props} />
          {
            <div className={classes.svg} onClick={handleType}>
              {isTypePassword === 'password' && <OpenEyeSVG />}
            </div>
          }
          {
            <div className={classes.svg} onClick={handleType}>
              {isTypePassword === 'text' && <CloseEyeSVG />}
            </div>
          }
        </div>
      )}
      {!isTextarea && !isPassword && <input className={classes.main} {...props} />}
    </>
  );
}

export default Input;
