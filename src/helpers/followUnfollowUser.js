import { collection, addDoc, deleteDoc, doc } from "@firebase/firestore";
import { db } from "../firebase";

//follow user
export async function followUser(activeUser, userToFollow) {
  try {
    await addDoc(collection(db, "users", activeUser?.documentId, "following"), {
      ...userToFollow,
      timestamp: Date.now(),
    });

    await addDoc(
      collection(db, "users", userToFollow?.documentId, "followers"),
      {
        ...activeUser,
        timestamp: Date.now(),
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//unfollow user
//ako ga ja obrisem iz followersa
//meni followers -1
//njemu following -1

//ako ga ja obirsem iz following
//meni following -1
//njemu followers -1
export async function unfollowUser(
  activeUser,
  userToUnfollow,
  activeUserDocumentIdInFollowers,
  unfollowFromFollowers
) {
  if (unfollowFromFollowers) {
    try {
      await deleteDoc(
        doc(
          db,
          "users",
          activeUser?.documentId,
          "followers",
          userToUnfollow?.followerDocumentId
        )
      );

      await deleteDoc(
        doc(
          db,
          "users",
          userToUnfollow?.documentId,
          "following",
          activeUserDocumentIdInFollowers
        )
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      await deleteDoc(
        doc(
          db,
          "users",
          activeUser?.documentId,
          "following",
          userToUnfollow?.followerDocumentId
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
}
