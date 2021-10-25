import { useState } from "react";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import getMyFollowers from "../../helpers/getMyFollowers";
import { unfollowUser } from "../../helpers/followUnfollowUser";

const Settings = () => {
  //firebase
  const auth = getAuth();
  const user = auth.currentUser;

  //redux
  const userData = useSelector((state) => state.user.userData);
  const followers = useSelector((state) => state.user.followers);

  //component state
  getMyFollowers(userData?.documentId);

  const handleDelete = async () => {
    const credential = EmailAuthProvider.credential(user.email, "123456");
    await reauthenticateWithCredential(user, credential);

    followers?.listOfFollowers.forEach(async (follower) => {
      const collectionRef = collection(
        db,
        "users",
        follower?.documentId,
        "following"
      );
      const q = query(collectionRef, where("userId", "==", userData?.userId));

      const results = await getDocs(q);

      const users = results.docs.map((doc) => ({
        ...doc.data(),
        myDocumentInUserFollowing: doc.id,
      }));

      await unfollowUser(
        userData,
        follower,
        users[0]?.myDocumentInUserFollowing,
        true
      );
    });

    const docRef = doc(db, "users", userData?.documentId);
    await deleteDoc(docRef);
    await deleteUser(user);
  };

  return (
    <div>
      <h1>Delete account</h1>
      <button
        className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded w-full mt-5"
        onClick={handleDelete}
      >
        Delete my account
      </button>
    </div>
  );
};

export default Settings;
