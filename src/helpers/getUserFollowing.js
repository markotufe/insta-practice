import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { setUserFollowing } from "../redux/slices/usersSlice";

export default function useGetUserFollowing(userDocumentId) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userDocumentId) {
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

          const listOfFollowingIds = listOfFollowing.map(
            (user) => user?.userId
          );

          dispatch(
            setUserFollowing({
              listOfFollowing: listOfFollowing,
              listOfFollowingIds: listOfFollowingIds,
            })
          );

          setLoading(false);
        }
      );
      return unsubscribe;
    }
  }, [userDocumentId, dispatch]);

  return { loading };
}
