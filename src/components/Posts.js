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
import { useSession } from "next-auth/react";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const { data: session } = useSession();

  useEffect(() => {
    //snapshot je real-time lisener na nasu bazu, prati promene
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
