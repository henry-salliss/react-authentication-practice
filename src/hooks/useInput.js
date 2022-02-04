import { useState } from "react";

const useInput = (validate) => {
  // value and touch state
  const [value, setValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  // conditional checks
  const inputIsValid = validate(value);
  const inputHasError = !inputIsValid && isTouched;

  // input handlers

  const inputChangeHandler = (e) => {
    setValue(e.target.value);
  };

  const inputBlurHandler = (e) => {
    setIsTouched(true);
  };

  const reset = () => {
    setValue("");
    setIsTouched(false);
  };

  return {
    value,
    isTouched,
    inputIsValid,
    inputHasError,
    inputChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
