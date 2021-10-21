/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import getMyFollowing from "../helpers/getMyFollowing";

export default function useGetUsersToFollow() {
  const [usersToFollow, setUsersToFollow] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);

  const { myFollowingIds } = getMyFollowing(userData?.documentId);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users"),
        where("userId", "not-in", [...myFollowingIds, userData?.userId])
      ),
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
        }));
        setUsersToFollow(results);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [myFollowingIds?.length]);

  return { usersToFollow, loading };
}
