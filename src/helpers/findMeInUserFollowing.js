import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";

export default function useFindMeInUserFollowing(userDocumentId) {
  const [loading, setLoading] = useState(true);
  const [myDocumentInUserFollowing, setMyDocumentInUserFollowing] =
    useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userDocumentId, "following"),
        where("userId", "==", "uDlMPck5wAbPeqDkJnUkVt0XDLI3")
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
  }, [userDocumentId, dispatch]);

  return { loading, myDocumentInUserFollowing };
}
