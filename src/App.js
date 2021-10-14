import { useEffect } from "react";
import RoutesContainer from "./routes/";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { setUser } from "./redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { db } from "./firebase";

function App() {
  const auth = getAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("userId", "==", user?.uid));
        const snapshot = await getDocs(q);

        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch(setUser(results[0]));
      } else {
        dispatch(setUser({}));
      }
    });
  }, [auth, dispatch]);

  return <RoutesContainer />;
}

export default App;
