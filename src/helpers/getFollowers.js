import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";

export default function useGetFollowers(userDocumentId) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const followersArrayOfIds = followers.map((user) => user?.userId);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userDocumentId, "followers"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setFollowers(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            followerDocumentId: doc.id,
          }))
        );
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [userDocumentId, followersArrayOfIds.length]);

  return { followers, followersArrayOfIds, loading };
}
