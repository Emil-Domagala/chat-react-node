import { useState } from 'react';

const useInputValidation = (validateValue: (value: string) => boolean) => {
  const [wasTouched, setWasTouched] = useState(false);
  const [entredValue, setEntredValue] = useState('');
  const valueisValid = validateValue(entredValue);
  const hasError = !valueisValid && wasTouched;

  const inputBlurHandler = () => {
    setWasTouched(true);
  };

  const clearInputHandler = () => {
    setWasTouched(false);
    setEntredValue('');
  };

  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntredValue(e.target.value);
  };

  return {
    value: entredValue,
    isValid: valueisValid,
    hasError: hasError,
    inputBlurHandler,
    valueChangeHandler,
    clearInputHandler,
  };
};

export default useInputValidation;
