/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { onSnapshot, collection, query, where } from "@firebase/firestore";
import Post from "./Post";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import NoPostsMessage from "./NoPostsMessage";
import getMyFollowing from "../helpers/getMyFollowing";
import LoaderComponent from "./Loader";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const { myFollowingIds } = getMyFollowing(userData?.documentId);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        where("creatorId", "!=", userData?.userId)
      ),
      (snapshot) => {
        let results = snapshot.docs.map((doc) => ({ ...doc.data() }));

        results = results.filter(
          (user) => myFollowingIds.indexOf(user.creatorId) > -1
        );

        results.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        setPosts(results);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [myFollowingIds?.length]);

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
        <NoPostsMessage
          message="Follow friends to get posts"
          btnText="Explore"
        />
      ) : (
        posts.map((post) => <Post key={post?.postId} post={post} />)
      )}
    </div>
  );
};

export default Posts;
