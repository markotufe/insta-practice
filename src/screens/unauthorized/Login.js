import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserError } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";

const LoginScreen = () => {
  const auth = getAuth();
  const dispatch = useDispatch();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const isButtonDisabled = !emailAddress || !password.length > 6;

  //registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, emailAddress, password);
    } catch (error) {
      dispatch(setUserError(error?.message));
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 mt-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="username"
            type="text"
            placeholder="Enter username"
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
        <Link className="text-blue-400 text-sm text-right" to="/register">
          <span className="text-gray-800">Don't have an account?</span> Sign up
        </Link>

        <ErrorMessage error="Please try again" />

        <button
          disabled={isButtonDisabled}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:opacity-50 mt-4"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
