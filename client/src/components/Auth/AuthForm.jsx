import Form from '../UI/Form/Form';
import Label from '../UI/Form/Label';
import Input from '../UI/Form/Input';
import classes from './AuthForm.module.css';
import { useState } from 'react';
import { useActionState } from 'react';

const AuthForm = () => {
  const [mode, setMode] = useState('login');

  const submitAction = async (_, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      if (isLogin === 'signup') {
        const confirmPassword = formData.get('confirmPassword');
        // await authCtx.signup(email,confirmPassword, password);
      } else {
        // await authCtx.login(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const [, action, isPending] = useActionState(submitAction);
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
        <Input type="email" id="email" name="email" />
      </div>
      <div className={classes['input-wrapper']}>
        <Label htmlFor="password">Password</Label>
        <Input isPassword type="password" id="password" name="password" />
      </div>
      {mode === 'signup' && (
        <div className={classes['input-wrapper']}>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input isPassword type="password" id="confirmPassword" name="confirmPassword" />
        </div>
      )}
      <button type="button" className={classes['auth-button']} disabled={isPending}>
        {mode === 'login' ? 'Login' : 'Signup'}
      </button>
    </Form>
  );
};
export default AuthForm;
