import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export async function getMessages(chatRoomDocumentId) {
  try {
    const collectionRef = collection(
      db,
      "chatRooms",
      chatRoomDocumentId,
      "messages"
    );
    const q = query(collectionRef, orderBy("timestamp", "desc"));

    const snapshot = await getDocs(q);

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return results;
  } catch (error) {
    console.log(error);
  }
}
