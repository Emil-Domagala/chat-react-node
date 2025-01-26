import { useState } from 'react';
import classes from './Input.module.css';
import OpenEyeSVG from '../../Icons/OpenEyeSVG';
import CloseEyeSVG from '../../Icons/CloseEyeSVG';

type InputType = {
  id?: string;
  name?: string;
  isPassword?: boolean;
  isTextarea?: boolean;
  className?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | readonly string[] | undefined;
};

function Input({ value, id, name, isPassword, isTextarea, type, ...props }: InputType) {
  const [isTypePassword, setIsTypePassword] = useState('password');

  const handleType = () => {
    setIsTypePassword((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <>
      {isTextarea && <textarea className={classes.main} {...props}></textarea>}
      {isPassword && (
        <div className={classes.input__wrapper}>
          <input value={value} id={id} name={name} type={isTypePassword} className={classes.main} {...props} />
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
      {!isTextarea && !isPassword && (
        <input value={value} id={id} name={name} type={type} className={classes.main} {...props} />
      )}
    </>
  );
}

export default Input;
