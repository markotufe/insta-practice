import { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
} from "@firebase/firestore";
import Post from "./Post";
import { db } from "../firebase";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );
    return unsubscribe;
  }, [db]);

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.profileImg}
          img={post.image}
          caption={post.caption}
        />
      ))}
    </div>
  );
};

export default Posts;
