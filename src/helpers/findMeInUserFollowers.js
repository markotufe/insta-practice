import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";

export default function useFindMeInUserFollowers(userDocumentId) {
  const [loading, setLoading] = useState(true);
  const [myDocumentInUserFollowers, setMyDocumentInUserFollowers] =
    useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (userDocumentId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", userDocumentId, "followers"),
          where("userId", "==", "uDlMPck5wAbPeqDkJnUkVt0XDLI3")
        ),
        (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            ...doc.data(),
            myDocumentInUserFollowers: doc.id,
          }));

          setMyDocumentInUserFollowers(results[0]?.myDocumentInUserFollowers);
          setLoading(false);
        }
      );
      return unsubscribe;
    }
  }, [userDocumentId, dispatch]);

  return { loading, myDocumentInUserFollowers };
}
