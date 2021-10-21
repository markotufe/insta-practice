import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";
import { setUserFollowers } from "../redux/slices/usersSlice";
import { useDispatch } from "react-redux";

export default function useGetMyFollowers(userDocumentId) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userDocumentId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", userDocumentId, "followers"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          const listOfFollowers = snapshot.docs.map((doc) => ({
            ...doc.data(),
            followerDocumentId: doc.id,
          }));

          const listOfFollowersIds = listOfFollowers.map(
            (user) => user?.userId
          );

          dispatch(
            setUserFollowers({
              listOfFollowers: listOfFollowers,
              listOfFollowersIds: listOfFollowersIds,
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
