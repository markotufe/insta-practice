import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDispatch } from "react-redux";
import { setUserError } from "../../redux/slices/userSlice";

const Registration = () => {
  const auth = getAuth();
  const dispatch = useDispatch();

  //registration
  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        "marko001@live.com",
        "12345678"
      );

      const collectionRef = collection(db, "users");
      const payload = {
        displayName: "markonato",
        email: createdUser?.user?.email,
        following: [],
        followers: [],
        lastLogin: createdUser?.user.metadata?.lastSignInTime,
        registeredAt: createdUser?.user.metadata?.creationTime,
        userId: createdUser?.user?.uid,
      };

      dispatch(setUserError(""));

      await addDoc(collectionRef, payload);
    } catch (error) {
      dispatch(setUserError(error?.message));
    }
  };

  return <button onClick={handleRegistration}>Registration</button>;
};

export default Registration;
