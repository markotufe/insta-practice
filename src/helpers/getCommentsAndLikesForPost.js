import { useEffect, useState } from "react";

import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";

export default function usePhotos(postId) {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    if (postId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "posts", postId, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        }
      );
      return unsubscribe;
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      const unsubscribe = onSnapshot(
        query(collection(db, "posts", postId, "likes")),
        (snapshot) => {
          setLikes(
            snapshot.docs.map((doc) => ({ ...doc.data(), documentId: doc.id }))
          );
        }
      );
      return unsubscribe;
    }
  }, [postId]);

  return { comments, likes };
}
