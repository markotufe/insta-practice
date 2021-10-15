import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserError } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import { handleErrors } from "../../helpers/handleErrors";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const LoginScreen = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const history = useHistory();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userError } = useSelector((state) => state.user);
  const isButtonDisabled = !emailAddress || password.length < 6 || !isLoading;

  const errorMessage = handleErrors(userError);

  //registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, emailAddress, password);
      history.push("/");
    } catch (error) {
      setIsLoading(false);
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
            htmlFor="email"
          >
            Email address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="email"
            type="email"
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
        <Link className="text-blue-400 text-sm text-right" to="/register">
          <span className="text-gray-800">Don't have an account?</span> Sign up
        </Link>

        <ErrorMessage error={errorMessage} />

        <button
          disabled={isButtonDisabled}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:opacity-50 mt-4"
        >
          {isLoading ? "Signing in" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
