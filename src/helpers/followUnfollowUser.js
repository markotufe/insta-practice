import {
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
  doc,
} from "@firebase/firestore";
import { db } from "../firebase";

//follow user
export async function followUser(activeUser, userToFollow) {
  try {
    await addDoc(collection(db, "users", activeUser?.documentId, "following"), {
      ...userToFollow,
      timestamp: serverTimestamp(),
    });

    await addDoc(
      collection(db, "users", userToFollow?.documentId, "followers"),
      {
        ...activeUser,
        timestamp: serverTimestamp(),
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//unfollow user
export async function unfollowUser(
  activeUser,
  userToUnfollow,
  activeUserDocumentIdInFollowers
) {
  try {
    await deleteDoc(
      doc(
        db,
        "users",
        activeUser?.documentId,
        "following",
        userToUnfollow?.followingDocumentId
      )
    );

    await deleteDoc(
      doc(
        db,
        "users",
        userToUnfollow?.documentId,
        "followers",
        activeUserDocumentIdInFollowers
      )
    );
  } catch (error) {
    console.log(error);
  }
}
