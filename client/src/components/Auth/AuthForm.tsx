import React, { useState } from 'react';
import Form from '../UI/Form/Form';
import Label from '../UI/Form/Label';
import Input from '../UI/Form/Input';
import classes from './AuthForm.module.css';
import { useActionState } from 'react';
import useInputValidation from '../../hooks/UseInputValidation';
import ErrorText from '../UI/Form/ErrorText';
import { useNavigate } from 'react-router';
import { loginHandler, signupHandler } from '../../utils/httpAuth';
import { useUser } from '../../store/userContext';

interface CustomError extends Error {
  errorData?: {
    error: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    };
  };
}

const AuthForm: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [emailErrMsg, setEmailErrMsg] = useState('Check if email is valid');
  const [pwErrMsg, setPwErrMsg] = useState('Check if password is valid');
  const [cpwErrMsg, setCpwErrMsg] = useState('Password and confirm password must be this same');

  const [emailHasErr, setEmailHasErr] = useState(false);
  const [pwHasErr, setPwHasErr] = useState(false);
  const [cpwHasErr, setCpwHasErr] = useState(false);

  //validate inputs

  const {
    value: entredEmail,
    isValid: entredEmailIsValid,
    hasError: emailImputHasError,
    inputBlurHandler: emailBlurHandler,
    valueChangeHandler: emailChangeHandler,
    clearInputHandler: clearEmailHandler,
  } = useInputValidation(
    (value: string) =>
      value.trim() !== '' &&
      !!value
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
  );
  const {
    value: entredPassword,
    isValid: entredPasswordIsValid,
    hasError: passwordImputHasError,
    inputBlurHandler: passwordBlurHandler,
    valueChangeHandler: passwordChangeHandler,
    clearInputHandler: clearPasswordHandler,
  } = useInputValidation((value: string) => value.trim() !== '' && value.length > 5);
  const {
    value: entredConfirmPassword,
    isValid: entredConfirmPasswordIsValid,
    hasError: confirmPasswordImputHasError,
    inputBlurHandler: confirmPasswordBlurHandler,
    valueChangeHandler: confirmPasswordChangeHandler,
    clearInputHandler: clearConfirmPasswordHandler,
  } = useInputValidation((value: string) => value === entredPassword);

  let formIsValid = false;
  if (
    (mode === 'login' && entredEmailIsValid && entredPasswordIsValid) ||
    (mode === 'signup' && entredEmailIsValid && entredPasswordIsValid && entredConfirmPasswordIsValid)
  ) {
    formIsValid = true;
  }

  //action on submitting form

  const submitAction = async () => {
    //check if form is valid

    const form = document.querySelector('form');
    console.log(formIsValid);
    if (!formIsValid || !form) return;

    const formData = new FormData(form);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    let confirmPassword = '';

    if (mode === 'signup') confirmPassword = formData.get('confirmPassword') as string;

    //reset error after submitting
    setEmailHasErr(false);
    setPwHasErr(false);
    setCpwHasErr(false);

    try {
      if (mode === 'signup') {
        const resData = await signupHandler(email, password, confirmPassword);
        setUser(resData.user);
        navigate('/profile');
      } else {
        const resData = await loginHandler(email, password);
        setUser(resData.user);
        if (resData.user.profileSetup) navigate('/chat');
        else navigate('/profile');
      }
      clearEmailHandler();
      clearConfirmPasswordHandler();
      clearPasswordHandler();
    } catch (error) {
      if ((error as CustomError).errorData) {
        const resData = (error as CustomError).errorData;
        if (!resData) return;
        if (resData.error.email) {
          setEmailErrMsg(resData.error.email);
          setEmailHasErr(true);
        }
        if (resData.error.password) {
          setPwErrMsg(resData.error.password);
          setPwHasErr(true);
        }
        if (resData.error.confirmPassword) {
          setCpwErrMsg(resData.error.confirmPassword);
          setCpwHasErr(true);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const [, action, isPending] = useActionState<void>(submitAction, undefined);

  return (
    <Form action={action}>
      <div className={classes['buttons__wrapper']}>
        <button
          onClick={() => setMode('login')}
          type="button"
          className={`${classes.button} ${classes.login} ${mode === 'login' && classes.active}`}>
          Login
        </button>
        <button
          onClick={() => setMode('signup')}
          type="button"
          className={`${classes.button} ${classes.signup} ${mode === 'signup' && classes.active}`}>
          Signup
        </button>
      </div>
      <div className={classes['input-wrapper']}>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          placeholder="mail@example.com"
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          value={entredEmail}
        />
        <ErrorText hasErrors={emailImputHasError || emailHasErr} errorMessage={emailErrMsg} />
      </div>
      <div className={classes['input-wrapper']}>
        <Label htmlFor="password" moreInfo="Password must be at least 6 character long">
          Password
        </Label>
        <Input
          isPassword
          type="password"
          id="password"
          name="password"
          required
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          value={entredPassword}
        />
        <ErrorText hasErrors={passwordImputHasError || pwHasErr} errorMessage={pwErrMsg} />
      </div>
      {mode === 'signup' && (
        <div className={classes['input-wrapper']}>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            isPassword
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            onChange={confirmPasswordChangeHandler}
            onBlur={confirmPasswordBlurHandler}
            value={entredConfirmPassword}
          />
          <ErrorText hasErrors={confirmPasswordImputHasError || cpwHasErr} errorMessage={cpwErrMsg} />
        </div>
      )}
      <button type="submit" className={classes['auth-button']} disabled={isPending || !formIsValid}>
        {mode === 'login' ? 'Login' : 'Signup'}
      </button>
    </Form>
  );
};

export default AuthForm;
