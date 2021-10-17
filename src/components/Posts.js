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
import LoaderComponent from "./Loader";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [followingUsersArrayOfIds.length]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <LoaderComponent />
          <p className="mt-5 text-xl font-bold text-gray-900">
            Fetching posts...
          </p>
        </div>
      ) : !posts.length ? (
        <NoPostsMessage />
      ) : (
        posts.map((post) => <Post key={post?.postId} post={post} />)
      )}
    </div>
  );
};

export default Posts;
