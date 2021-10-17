import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";

export default function useGetFollowingUsers(userDocumentId) {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const followingUsersArrayOfIds = followingUsers.map((user) => user?.userId);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userDocumentId, "following"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setFollowingUsers(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [userDocumentId, followingUsersArrayOfIds.length]);

  return { followingUsers, followingUsersArrayOfIds, loading };
}
