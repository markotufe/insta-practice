/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "@firebase/firestore";
import Post from "./Post";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import NoPostsMessage from "./NoPostsMessage";
import useGetFollowingUsers from "../helpers/getFollowingUsers";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { userData } = useSelector((state) => state.user);

  const { followingUsersArrayOfIds } = useGetFollowingUsers(
    userData?.documentId
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        where(
          "creatorId",
          "in",
          !followingUsersArrayOfIds.length ? ["-"] : followingUsersArrayOfIds
        ),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }
    );
    return unsubscribe;
  }, [followingUsersArrayOfIds.length]);

  return (
    <div>
      {!posts.length ? (
        <NoPostsMessage />
      ) : (
        posts.map((post) => <Post key={post?.postId} post={post} />)
      )}
    </div>
  );
};

export default Posts;
