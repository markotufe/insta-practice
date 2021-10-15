import { arrayUnion, arrayRemove, doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";

//follow user
export async function followUser(
  activeUserDocumentId,
  activeUserId,
  userToFollowDocumentId,
  userToFollowId
) {
  await updateDoc(doc(db, "users", activeUserDocumentId), {
    following: arrayUnion(userToFollowId),
  });

  await updateDoc(doc(db, "users", userToFollowDocumentId), {
    followers: arrayUnion(activeUserId),
  });
}

//unfollow user
export async function unfollowUser(
  activeUserDocumentId,
  activeUserId,
  userToFollowDocumentId,
  userToFollowId
) {
  await updateDoc(doc(db, "users", activeUserDocumentId), {
    following: arrayRemove(userToFollowId),
  });

  await updateDoc(doc(db, "users", userToFollowDocumentId), {
    followers: arrayRemove(activeUserId),
  });
}
