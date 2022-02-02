import { useState } from "react";

import classes from "./AuthForm.module.css";
import useHttp from "../../hooks/useHttp";
import { FIREBASE_URL } from "../../helpers/helpers";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  // input values
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const emailChangeHandler = (e) => {
    setEmailValue(e.target.value);
  };

  const passwordChangeHandler = (e) => {
    setPasswordValue(e.target.value);
  };

  const { isLoading, error, sendRequest } = useHttp();
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    // add validation

    if (isLogin) {
    } else {
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
            type="email"
            id="email"
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            onChange={passwordChangeHandler}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
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
