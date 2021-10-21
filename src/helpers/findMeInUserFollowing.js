import { useEffect, useState } from "react";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";

export default function useFindMeInUserFollowing(userDocumentId, activeUserId) {
  const [loading, setLoading] = useState(true);
  const [myDocumentInUserFollowing, setMyDocumentInUserFollowing] =
    useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (documentId && activeUserId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", userDocumentId, "following"),
          where("userId", "==", activeUserId)
        ),
        (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            ...doc.data(),
            myDocumentInUserFollowing: doc.id,
          }));
          setMyDocumentInUserFollowing(results[0]?.myDocumentInUserFollowing);
          setLoading(false);
        }
      );
      return unsubscribe;
    }
  }, [userDocumentId, dispatch, activeUserId]);

  return { loading, myDocumentInUserFollowing };
}
