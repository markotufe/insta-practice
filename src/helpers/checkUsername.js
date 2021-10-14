import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../firebase";

export async function checkIfUsernameExist(username) {
  const collectionRef = collection(db, "users");
  const q = query(
    collectionRef,
    where("displayName", "==", username.toLowerCase())
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.length > 0;
}
