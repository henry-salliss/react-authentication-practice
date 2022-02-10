// react imports
import { useContext, useEffect, useState } from "react";
import { Fragment } from "react";
import { createPortal } from "react-dom";
import { useHistory } from "react-router-dom";

// style import
import classes from "./AuthForm.module.css";

// component imports
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorModal from "../UI/ErrorModal";
import Backdrop from "../UI/Backdrop";

// hook and helper imports
import useHttp from "../../hooks/useHttp";
import useInput from "../../hooks/useInput";
import { FIREBASE_KEY, SIGN_IN_URL, SIGN_UP_URL } from "../../helpers/helpers";
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
  const history = useHistory();
  const context = useContext(AuthContext);
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

  // usehttp hook to make requests
  const { isLoading, sendRequest } = useHttp();

  // handling user login or sign up
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    // handling the user attempting to login
    if (isLogin) {
      const response = await sendRequest({
        url: `${SIGN_IN_URL}${FIREBASE_KEY}`,
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

      if (response.error) {
        setError(true);
        setErrorMessage(response.error.message);
      }
      const expirationTime = new Date(
        new Date().getTime() + +(response.expiresIn * 1000)
      );
      console.log(response);
      context.login(response.idToken, expirationTime.toString());
    } else {
      // create profile (sign up)
      const response = await sendRequest({
        url: `${SIGN_UP_URL}${FIREBASE_KEY}`,
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
      console.log(response);
      if (response.error) {
        setError(true);
        setErrorMessage(response.error.message);
      }

      // redirect user
      history.replace("/");
    }
  };

  const errorHandler = () => {
    setError(false);
  };

  return (
    <Fragment>
      {error &&
        createPortal(
          <Backdrop onRemoveError={errorHandler}>
            <ErrorModal
              message={errorMessage}
              title="An error has occured"
              onRemoveError={errorHandler}
            />
          </Backdrop>,
          document.querySelector(".backdrop-root")
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
