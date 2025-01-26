import classes from './ErrorText.module.css';

type ErrorTextType = {
  hasErrors?: boolean;
  errorMessage: string;
};

function ErrorText({ hasErrors, errorMessage }: ErrorTextType) {
  return <p className={`${classes['input-error-text']} ${hasErrors ? classes['error-active'] : ''}`}>{errorMessage}</p>;
}

export default ErrorText;
