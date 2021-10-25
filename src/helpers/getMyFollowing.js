import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { setMyFollowing } from "../redux/slices/userSlice";

export default function useGetMyFollowing(userDocumentId) {
  const [loading, setLoading] = useState(true);
  const [myFollowingIds, setMyFollowingIds] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userDocumentId, "following"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        const listOfFollowing = snapshot.docs.map((doc) => ({
          ...doc.data(),
          followerDocumentId: doc.id,
        }));

        setMyFollowingIds(listOfFollowing.map((item) => item?.userId));

        dispatch(
          setMyFollowing({
            listOfFollowing: listOfFollowing,
            listOfFollowingUsername: listOfFollowing.map(
              (item) => item?.displayName
            ),
          })
        );

        setLoading(false);
      }
    );
    return unsubscribe;
  }, [userDocumentId, dispatch]);

  return { loading, myFollowingIds };
}
