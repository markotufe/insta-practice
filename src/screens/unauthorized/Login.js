import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserError } from "../../redux/slices/userSlice";

const LoginScreen = () => {
  const auth = getAuth();
  const dispatch = useDispatch();

  //registration
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, "marko001@live.com", "12345678");
    } catch (error) {
      dispatch(setUserError(error?.message));
    }
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default LoginScreen;
