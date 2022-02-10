export const FIREBASE_KEY = "AIzaSyBMYOSw7dRQLBEVob8fqzfbXvP-OJg6tTk";

export const SIGN_UP_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

export const SIGN_IN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

export const CHANGE_PASSWORD_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:update?key=";

export const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const existingTime = new Date(expirationTime).getTime();
  const remainingTime = existingTime - currentTime;

  return remainingTime;
};

export const getTokenData = () => {
  const storedToken = localStorage.getItem("token");
  const expirationTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(expirationTime);

  // if timer already going return null to start again
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};
