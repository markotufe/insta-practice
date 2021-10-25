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

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ErrorMessage from "../../components/ErrorMessage";
import { setErrorMessage } from "../../redux/slices/errorsSlice";
import { useDispatch } from "react-redux";

const Settings = () => {
  //firebase
  const auth = getAuth();
  const user = auth.currentUser;

  //userPassword
  const [userPassword, setUserPassword] = useState("");
  const [isReauth, setIsReauth] = useState(false);
  const [isReauthModalOpen, setIsReauthModalOpen] = useState(false);

  //redux
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const followers = useSelector((state) => state.user.followers);
  const { errorMessage } = useSelector((state) => state.errors);

  getMyFollowers(userData?.documentId);

  const reauthModal = () => {
    return (
      <Modal
        open={isReauthModalOpen}
        onClose={() => {
          setIsReauthModalOpen(false);
          setUserPassword("");
          dispatch(setErrorMessage(""));
        }}
        center
      >
        <div
          style={{
            minWidth: "350px",
            minHeight: "250px",
            paddingTop: "65px",
            paddingLeft: "23px",
            paddingRight: "23px",
            paddingBottom: "45px",
          }}
        >
          <div className="mb-5">
            <h1 className="text-2xl font-semibold">
              Hello, {userData?.displayName}
            </h1>
            <h3 className="text-gray-500">
              Please enter your password to confirm your account
            </h3>
          </div>

          <div className="mb-2 mt-2">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
              id="password"
              type="password"
              placeholder="Enter password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>

          <ErrorMessage error={errorMessage} />

          <button
            className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded w-full mt-5 disabled:cursor-not-allowed"
            onClick={() => reauthUser()}
            disabled={userPassword.length < 6}
          >
            Confirm my account
          </button>
        </div>
      </Modal>
    );
  };

  const reauthUser = async () => {
    try {
      const credential = EmailAuthProvider.credential(user.email, userPassword);
      await reauthenticateWithCredential(user, credential);
      setIsReauth(true);
      setIsReauthModalOpen(false);
      dispatch(setErrorMessage(""));
      setUserPassword("");
    } catch (error) {
      console.log(error);
      dispatch(setErrorMessage(error?.message));
    }
  };

  const handleDelete = async () => {
    const postsQuery = query(
      collection(db, "posts"),
      where("creatorDisplayName", "==", userData?.displayName)
    );

    const postsResult = await getDocs(postsQuery);

    const posts = postsResult.docs.map((doc) => ({
      ...doc.data(),
      myDocumentInUserFollowing: doc.id,
    }));

    posts?.forEach(async (post) => {
      await deleteDoc(doc(db, "posts", post?.postId));
    });

    followers?.listOfFollowers?.forEach(async (follower) => {
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
    <>
      {reauthModal()}
      <div className="container max-w-3xl mx-auto text-center mt-10">
        <h1 className="text-2xl">
          {isReauth
            ? "Thanks for confirmig your credentials"
            : "Delete account"}
        </h1>
        <p className="mt-3">
          If you delete account, all data including photos, <br /> followers
          will be removed
        </p>
        <button
          className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={() =>
            isReauth ? handleDelete() : setIsReauthModalOpen(true)
          }
        >
          {isReauth ? "Confirm deletion" : "Delete my account"}
        </button>
      </div>
    </>
  );
};

export default Settings;
