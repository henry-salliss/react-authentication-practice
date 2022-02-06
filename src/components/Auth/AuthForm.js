import { useEffect, useState } from "react";

import classes from "./AuthForm.module.css";
import useHttp from "../../hooks/useHttp";
import useInput from "../../hooks/useInput";
import { FIREBASE_URL } from "../../helpers/helpers";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorModal from "../UI/ErrorModal";
import { Fragment } from "react/cjs/react.production.min";
import Backdrop from "../UI/Backdrop";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  // input values

  // email input values
  const {
    value: emailValue,
    inputIsValid: emailIsValid,
    inputHasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => value.includes("@") && value.length > 6);

  // password input values
  const {
    value: passwordValue,
    inputIsValid: passwordIsValid,
    inputHasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput((value) => value.length > 6);

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (emailIsValid && passwordIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [emailIsValid, passwordIsValid]);

  const { isLoading, sendRequest } = useHttp();
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLogin) {
    } else {
      // create profile (sign up)
      const data = await sendRequest({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_URL}`,
        method: "POST",
        body: {
          email: emailValue,
          password: passwordValue,
          returnSecureToken: true,
        },
        headers: {
          "Content-Type": "application-json",
        },
      });
      // let errorMessage;
      if (data.error) {
        setError(true);
        setErrorMessage(data.error.message);
      }
    }
  };

  const errorHandler = () => {
    setError(false);
  };

  return (
    <Fragment>
      {error && (
        <Backdrop onRemoveError={errorHandler}>
          <ErrorModal
            message={errorMessage}
            title="An error has occured"
            onRemoveError={errorHandler}
          />
        </Backdrop>
      )}
      <section className={classes.auth}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={formSubmitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              type="email"
              id="email"
              required
            />
            {emailHasError ? (
              <p className={classes["error-text"]}>
                Please enter a valid email
              </p>
            ) : (
              ""
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Your Password</label>
            <input
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              type="password"
              id="password"
              required
            />
            {passwordHasError ? (
              <p className={classes["error-text"]}>
                Password must be at least 6 characters
              </p>
            ) : (
              ""
            )}
          </div>
          <div className={classes.actions}>
            {isLoading ? <LoadingSpinner /> : ""}
            <button disabled={!formIsValid}>
              {isLogin ? "Login" : "Create Account"}
            </button>
            <button
              type="button"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          </div>
        </form>
      </section>
    </Fragment>
  );
};

export default AuthForm;
