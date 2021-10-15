import { collection, getDocs, where, query, limit } from "firebase/firestore";
import { db } from "../firebase";

export async function getUsersToFollow(userId, following) {
  try {
    let collectionRef = collection(db, "users");

    let q = query(
      collectionRef,
      where("userId", "not-in", [following, ...userId]),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      documentId: doc.id,
    }));
    return results;
  } catch (error) {
    console.log(error);
  }
}
