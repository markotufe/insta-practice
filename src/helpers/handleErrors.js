export const handleErrors = (error) => {
  let msg;
  let firebaseError = "Firebase: Error";

  switch (error) {
    case `${firebaseError} (auth/user-not-found).`:
      msg = "Can't find user. Please try again";
      break;

    case `${firebaseError} (auth/wrong-password).`:
      msg = "Please enter valid credentials";
      break;

    default:
      msg = "";
      break;
  }

  return msg;
};
