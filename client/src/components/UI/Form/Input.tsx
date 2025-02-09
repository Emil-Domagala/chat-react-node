import { useState } from 'react';
import classes from './Input.module.css';
import OpenEyeSVG from '../../../assets/Icons/OpenEyeSVG';
import CloseEyeSVG from '../../../assets/Icons/CloseEyeSVG';

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
  square?: boolean;
};

function Input({ square, value, id, name, isPassword, type, ...props }: InputType) {
  const [isTypePassword, setIsTypePassword] = useState('password');

  const handleType = () => {
    setIsTypePassword((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <>
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
      {!isPassword && (
        <input
          value={value}
          id={id}
          name={name}
          type={type}
          className={`${classes.main} ${square ? classes.sq : ''}`}
          {...props}
        />
      )}
    </>
  );
}

export default Input;
