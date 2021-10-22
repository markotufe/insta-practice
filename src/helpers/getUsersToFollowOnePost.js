import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export async function getUsersToFollowOnePost(userId) {
  try {
    const collectionRef = collection(db, "posts");
    const q = query(
      collectionRef,
      where("creatorId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      followerDocumentId: doc.id,
    }));

    return results[0];
  } catch (error) {
    console.log(error);
  }
}
