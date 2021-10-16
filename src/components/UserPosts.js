import { useEffect, useState } from "react";

import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";

const UserPosts = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    if (post?.postId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "posts", post?.postId, "comments"),
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
  }, [post?.postId]);

  useEffect(() => {
    if (post?.postId) {
      const unsubscribe = onSnapshot(
        query(collection(db, "posts", post?.postId, "likes")),
        (snapshot) => {
          setLikes(
            snapshot.docs.map((doc) => ({ ...doc.data(), documentId: doc.id }))
          );
        }
      );
      return unsubscribe;
    }
  }, [post?.postId]);

  console.log(post);

  return (
    <div className="w-full h-70 mt-3 relative group">
      <img
        src={post?.image}
        alt="photourl"
        className="rounded-md object-cover md:h-[250px]"
      />

      <div className="cursor-pointer rounded-md absolute bottom-0 left-0 bg-gray-500 bg-opacity-50 z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden">
        <p className="flex items-center text-white font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-8 mr-4"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          {likes.length}
        </p>

        <p className="flex items-center text-white font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-8 mr-4"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          {comments.length}
        </p>
      </div>
    </div>
  );
};

export default UserPosts;
