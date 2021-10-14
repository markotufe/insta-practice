import { useState, useEffect } from "react";
import { onSnapshot, collection, query, where } from "@firebase/firestore";
// import Post from "./Post";
import { db } from "../firebase";
import { useSelector } from "react-redux";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { following } = useSelector((state) => state.user.userData);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        where("creatorId", "in", !following.length ? ["-"] : following)
      ),
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }
    );
    return unsubscribe;
  }, [following]);

  console.log(posts);

  return (
    <div>
      {/* {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.profileImg}
          img={post.image}
          caption={post.caption}
        />
      ))} */}
    </div>
  );
};

export default Posts;
