import classes from './ErrorText.module.css';

type ErrorTextType = {
  hasErrors?: boolean;
  position?: boolean;
  errorMessage: string;
};

function ErrorText({ hasErrors, errorMessage, position }: ErrorTextType) {
  return (
    <p
      className={`${classes['input-error-text']} ${hasErrors ? classes['error-active'] : ''} ${
        position ? classes['position-static'] : ''
      }`}>
      {errorMessage}
    </p>
  );
}

export default ErrorText;
