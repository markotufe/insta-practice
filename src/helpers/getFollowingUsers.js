import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../firebase";

export async function getFollowingUsers(userId) {
  try {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("userId", "==", userId));

    const snapshot = await getDocs(q);

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      documentId: doc.id,
    }));

    const userFollowingArray = results[0]?.following;

    const following = await Promise.all(
      userFollowingArray.map(async (result) => {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("userId", "==", result));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
        }));

        return data[0];
      })
    );

    return following;
  } catch (error) {
    console.log(error);
  }
}
