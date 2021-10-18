import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../firebase";

export async function getUserByUsername(username) {
  try {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("displayName", "==", username));

    const snapshot = await getDocs(q);

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      documentId: doc.id,
    }));

    return results[0];
  } catch (error) {
    console.log(error);
  }
}
