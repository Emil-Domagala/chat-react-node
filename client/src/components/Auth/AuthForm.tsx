import React, { useState } from 'react';
import Form from '../UI/Form/Form';
import Label from '../UI/Form/Label';
import Input from '../UI/Form/Input';
import classes from './AuthForm.module.css';
import { useActionState } from 'react';
import useInputValidation from '../../hooks/UseInputValidation';
import ErrorText from '../UI/Form/ErrorText';
// import { SIGNUP_ROUTE } from '../../utils/constants.js';

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
  const [emailErrMsg, setEmailErrMsg] = useState('Check if email is valid');
  const [pwErrMsg, setPwErrMsg] = useState('Check if password is valid');
  const [cpwErrMsg, setCpwErrMsg] = useState('Password and confirm password must be this same');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [emailHasErr, setEmailHasErr] = useState(false);
  const [pwHasErr, setPwHasErr] = useState(false);
  const [cpwHasErr, setCpwHasErr] = useState(false);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const SIGNUP_ROUTE = serverUrl + authPath + '/signup';
  const LOGIN_ROUTE = serverUrl + authPath + '/login';

  const signupHandler = async (email: string, password: string, confirmPassword: string) => {
    const response = await fetch(SIGNUP_ROUTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, confirmPassword }),
    });
    const resData = await response.json();

    if (!response.ok) {
      const error = new Error(resData.message || 'Signup failed') as Error & { errorData?: object };
      error.errorData = resData;
      throw error;
    }
    return resData;
  };

  const loginHandler = async (email: string, password: string) => {
    const response = await fetch(LOGIN_ROUTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const resData = await response.json();

    if (!response.ok) {
      const error = new Error(resData.message || 'Signup failed') as Error & { errorData?: object };
      error.errorData = resData;
      throw error;
    }
    return resData;
  };

  const {
    value: entredEmail,
    isValid: entredEmailIsValid,
    hasError: emailImputHasError,
    inputBlurHandler: emailBlurHandler,
    valueChangeHandler: emailChangeHandler,
    clearInputHandler: clearEmailHandler,
  } = useInputValidation((value: string) => value.trim() !== '' && value.includes('@'));
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

  const submitAction = async () => {
    if (entredEmailIsValid && entredPasswordIsValid) {
      formIsValid = true;
    }

    if (mode === 'signup' && !entredConfirmPasswordIsValid) {
      formIsValid = false;
    }

    const form = document.querySelector('form');
    if (!formIsValid || !form) return;

    const formData = new FormData(form);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    let confirmPassword = '';

    if (mode === 'signup') {
      confirmPassword = formData.get('confirmPassword') as string;
      console.log(confirmPassword);
    }

    setEmailHasErr(false);
    setPwHasErr(false);
    setCpwHasErr(false);

    try {
      if (mode === 'signup') {
        await signupHandler(email, password, confirmPassword);
      } else {
        await loginHandler(email, password);
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
      <button type="submit" className={classes['auth-button']} disabled={isPending}>
        {mode === 'login' ? 'Login' : 'Signup'}
      </button>
    </Form>
  );
};

export default AuthForm;
