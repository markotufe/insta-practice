import { useEffect, useState } from "react";
import RoutesContainer from "./routes/";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { setUser, setIsRegistered } from "./redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { db } from "./firebase";
import Loader from "./components/Loader";
import moment from "moment";
import { createUsers } from "./dummyUsers";

function App() {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   async function handleDummyUsers() {
  //     await createUsers();
  //   }
  //   handleDummyUsers()
  // }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("userId", "==", user?.uid));
        const snapshot = await getDocs(q);

        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
          lastLogin: moment().fromNow(),
        }));

        dispatch(setUser(results[0]));
        dispatch(setIsRegistered(true));
        setLoading(false);
      } else {
        dispatch(setUser({}));
        setLoading(false);
      }
    });
    return () => unsub();
  }, [auth, dispatch]);

  return loading ? (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Loader />
      <p className="mt-5 text-xl font-bold text-gray-900">Preparing data...</p>
    </div>
  ) : (
    <RoutesContainer />
  );
}

export default App;
