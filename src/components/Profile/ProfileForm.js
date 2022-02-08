import { Fragment, useContext, useEffect, useState } from "react";
import classes from "./ProfileForm.module.css";
import useInput from "../../hooks/useInput";
import { CHANGE_PASSWORD_URL, FIREBASE_KEY } from "../../helpers/helpers";
import useHttp from "../../hooks/useHttp";
import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../UI/LoadingSpinner";
import { createPortal } from "react-dom";
import Backdrop from "../UI/Backdrop";
import ErrorModal from "../UI/ErrorModal";

const ProfileForm = () => {
  const context = useContext(AuthContext);

  const {
    value: newPasswordValue,
    inputIsValid: newPasswordIsValid,
    inputHasError: newPasswordHasError,
    inputChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
  } = useInput((value) => value.length > 6);

  const [formIsValid, setFormIsValid] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (newPasswordIsValid) setFormIsValid(true);
  }, [newPasswordIsValid]);

  const passwordChangeSubmissionHandler = async (e) => {
    e.preventDefault();

    const response = await sendRequest({
      url: CHANGE_PASSWORD_URL + FIREBASE_KEY,
      method: "POST",
      body: {
        idToken: context.token,
        password: newPasswordValue,
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
    console.log(response);
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
      <form className={classes.form} onSubmit={passwordChangeSubmissionHandler}>
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input
            value={newPasswordValue}
            onChange={newPasswordChangeHandler}
            onBlur={newPasswordBlurHandler}
            type="password"
            id="new-password"
          />
          {newPasswordHasError ? (
            <p className={classes["error-text"]}>
              New password must have at least 6 characters
            </p>
          ) : (
            ""
          )}
        </div>
        {isLoading ? <LoadingSpinner /> : ""}
        <div className={classes.action}>
          <button disabled={!formIsValid}>Change Password</button>
        </div>
      </form>
    </Fragment>
  );
};

export default ProfileForm;
