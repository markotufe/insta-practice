import {
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";

//follow user
export async function followUser(activeUser, userToFollow) {
  await addDoc(collection(db, "users", activeUser?.documentId, "following"), {
    ...userToFollow,
    timestamp: serverTimestamp(),
  });

  await addDoc(collection(db, "users", userToFollow?.documentId, "followers"), {
    ...activeUser,
    timestamp: serverTimestamp(),
  });
}

//unfollow user
export async function unfollowUser(activeUser, userToFollow) {
  await deleteDoc(
    collection(
      db,
      "users",
      activeUser?.documentId,
      "following",
      userToFollow?.documentId
    )
  );

  await deleteDoc(
    collection(
      db,
      "users",
      userToFollow?.documentId,
      "followers",
      activeUser?.documentId
    )
  );
}
