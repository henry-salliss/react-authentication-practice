import { useEffect, useState } from "react";

import classes from "./AuthForm.module.css";
import useHttp from "../../hooks/useHttp";
import useInput from "../../hooks/useInput";
import { FIREBASE_URL } from "../../helpers/helpers";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

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
    reset: emailReset,
  } = useInput((value) => value.includes("@") && value.length > 6);

  // password input values
  const {
    value: passwordValue,
    inputIsValid: passwordIsValid,
    inputHasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput((value) => value.length > 6);

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (emailIsValid && passwordIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [emailIsValid, passwordIsValid]);

  const { isLoading, error, sendRequest } = useHttp();
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    // add validation

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
      console.log(data);
    }
  };

  return (
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
            <p className={classes["error-text"]}>Please enter a valid email</p>
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
  );
};

export default AuthForm;
