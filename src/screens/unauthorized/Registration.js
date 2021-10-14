import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserError, setIsRegistered } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import { handleErrors } from "../../helpers/handleErrors";
import { useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useHistory } from "react-router";

const LoginScreen = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const history = useHistory();

  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userError } = useSelector((state) => state.user);
  const isButtonDisabled = !emailAddress || password.length < 6 || !username;

  const errorMessage = handleErrors(userError);

  //registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        emailAddress,
        password
      );

      const collectionRef = collection(db, "users");
      const payload = {
        displayName: username,
        email: createdUser?.user?.email,
        following: [],
        followers: [],
        lastLogin: createdUser?.user.metadata?.lastSignInTime,
        registeredAt: createdUser?.user.metadata?.creationTime,
        userId: createdUser?.user?.uid,
      };
      await addDoc(collectionRef, payload);
      dispatch(setIsRegistered(true));
      dispatch(setUserError(""));
      history.push("/");
    } catch (error) {
      dispatch(setUserError(error?.message));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-96"
        onSubmit={handleSubmit}
      >
        <div className="mt-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="username"
            type="email"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4 mt-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="email"
            type="text"
            placeholder="Enter email address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link className="text-blue-400 text-sm text-right" to="/">
          <span className="text-gray-800">Have an account?</span> Sign in
        </Link>

        <ErrorMessage error={errorMessage} />

        <button
          disabled={isButtonDisabled}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:opacity-50 mt-4"
        >
          {isLoading ? "Creating account" : "Create an account"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
