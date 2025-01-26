export const validateEmailPassword = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (
    !String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
  ) {
    errors.email = 'Check if email is correct';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.trim().length < 5 || password.trim().length > 20) {
    errors.password = 'Password must be between 6 and 20 characters long';
  }

  return errors;
};
