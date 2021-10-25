import { useState, useEffect, useRef } from "react";
import {
  BookmarkIcon,
  ChatIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  setDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import Moment from "react-moment";
import {
  HeartIcon as HeartIconFilled,
  BookmarkIcon as BookmarkIconFilled,
} from "@heroicons/react/solid";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useSelector, useDispatch } from "react-redux";

import useGetCommentsAndLikesForPost from "../helpers/getCommentsAndLikesForPost";
import { Link } from "react-router-dom";

import { setIsTagModalOpen } from "../redux/slices/modalSlice";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const commentInputRef = useRef(null);
  const { displayName, photoURL, userId } = useSelector(
    (state) => state.user.userData
  );

  const { comments, likes } = useGetCommentsAndLikesForPost(post?.postId);

  //proveravamo da li je ulogovan korisnik lajkovao post
  useEffect(() => {
    // -1 ako nista ne nadje
    setHasLiked(likes.findIndex((like) => like?.creatorId === userId) !== -1);
  }, [likes, userId]);

  //uzimamo sve postove koji imaju bookmark
  useEffect(() => {
    if (post?.postId) {
      const unsubscribe = onSnapshot(
        query(collection(db, "posts", post?.postId, "bookmarks")),
        (snapshot) => {
          setBookmarks(
            snapshot.docs.map((doc) => ({ ...doc.data(), documentId: doc?.id }))
          );
        }
      );
      return unsubscribe;
    }
  }, [post?.postId]);

  useEffect(() => {
    // -1 ako nista ne nadje
    setHasBookmarked(
      bookmarks.findIndex((bookmark) => bookmark?.creatorId === userId) !== -1
    );
  }, [bookmarks, userId]);

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    //id posta koji zelimo da komentarisemo
    //comments je kolekcija koja se nalazi unutar posta
    await addDoc(collection(db, "posts", post?.postId, "comments"), {
      comment: commentToSend,
      creatorDisplayName: displayName,
      creatorId: userId,
      creatorPhotoUrl: photoURL,
      timestamp: Date.now(),
    });
  };

  const likeUnlikePost = async () => {
    //koristi se korisnikov ID kao ID dokumenta za lajk, zato nam je to peti argument. Zasto? Pa zato da bismo bili sigurni da ne mogu biti dva lajka istog korisnika na isti post.
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", post?.postId, "likes", userId));
    } else {
      await setDoc(doc(db, "posts", post?.postId, "likes", userId), {
        creatorDisplayName: displayName,
        creatorId: userId,
        creatorPhotoUrl: photoURL,
      });
    }
  };

  const deletePost = async () => {
    await deleteDoc(doc(db, "posts", post?.postId));
  };

  const deleteComment = async (commentId) => {
    await deleteDoc(doc(db, "posts", post?.postId, "comments", commentId));
  };

  const manageBookmark = async () => {
    if (hasBookmarked) {
      await deleteDoc(doc(db, "posts", post?.postId, "bookmarks", userId));
    } else {
      await setDoc(doc(db, "posts", post?.postId, "bookmarks", userId), {
        creatorDisplayName: displayName,
        creatorId: userId,
        creatorPhotoUrl: photoURL,
      });
    }
  };

  const renderBookmark = () => {
    if (userId !== post?.creatorId) {
      if (!hasBookmarked) {
        return <BookmarkIcon className="postBtn" onClick={manageBookmark} />;
      } else {
        return (
          <BookmarkIconFilled className="postBtn" onClick={manageBookmark} />
        );
      }
    } else return;
  };

  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* Header */}
      <div className="flex items-center p-5">
        <img
          src={
            post?.photoURL ??
            "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
          }
          alt="user"
          className="rounded-full h-12 w-12 object-contain p-1 mr-3 border"
        />
        <Link
          to={`/user/${post?.creatorDisplayName}`}
          className="flex-1 font-bold"
        >
          {post?.creatorDisplayName}
        </Link>
        {userId === post?.creatorId && (
          <TrashIcon className="h-5 cursor-pointer" onClick={deletePost} />
        )}
      </div>
      {/* img  */}
      <img src={post?.image} alt="post" className="object-cover w-full" />
      {/* buttons */}
      <div className="flex justify-between px-4 pt-4">
        <div className="flex space-x-4">
          {!hasLiked ? (
            <HeartIcon onClick={likeUnlikePost} className="postBtn" />
          ) : (
            <HeartIconFilled
              onClick={likeUnlikePost}
              className="postBtn text-red-500"
            />
          )}
          <ChatIcon
            className="postBtn"
            onClick={() => commentInputRef?.current?.focus()}
          />
          <PaperAirplaneIcon className="postBtn" />
        </div>
        {renderBookmark()}
      </div>

      {/* caption */}
      <p className="p-5 truncate">
        {likes.length > 0 ? (
          <span className="font-bold mb-1 block">
            {likes.length > 1 ? `${likes.length} likes` : "1 like"}
          </span>
        ) : (
          <span className="font-bold mb-1 block">0 likes</span>
        )}
        <Link
          to={`/user/${post?.creatorDisplayName}`}
          className="font-bold mr-1"
        >
          <span className="font-bold mr-1">{post?.creatorDisplayName}</span>
        </Link>
        {post?.caption}
      </p>

      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="flex items-center space-x-2 mb-3"
              >
                <img
                  src={
                    comment.creatorPhotoUrl ??
                    "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
                  }
                  alt="auhtor"
                  className="h-7 rounded-full"
                />
                <p className="text-sm flex-1 flex items-center">
                  <Link
                    to={
                      comment?.creatorDisplayName === displayName
                        ? `/my-profile/${comment?.creatorDisplayName}`
                        : `/user/${comment?.creatorDisplayName}`
                    }
                    className="font-bold"
                  >
                    <span className="font-bold mr-[5px]">
                      {comment.creatorDisplayName}
                    </span>
                  </Link>
                  {comment.comment}
                  {(userId === comment.creatorId ||
                    userId === post?.creatorId) && (
                    <TrashIcon
                      onClick={() => deleteComment(comment.id)}
                      className="ml-3 h-4 cursor-pointer"
                    />
                  )}
                </p>
                <Moment fromNow className="pr-5 text-xs">
                  {comment.timestamp}
                </Moment>
              </div>
            );
          })}
        </div>
      )}

      {/* input box */}
      <form className="flex items-center p-4 relative" onSubmit={sendComment}>
        <EmojiHappyIcon
          className="h-7 cursor-pointer"
          onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
        />
        {isEmojiPickerVisible && (
          <Picker
            set="apple"
            style={{ position: "absolute", bottom: "20px", left: "50px" }}
            onSelect={(emoji) => {
              const cursor = commentInputRef.current.selectionStart;
              const text =
                comment.slice(0, cursor) +
                emoji?.native +
                comment.slice(cursor);
              setComment(text);
              setIsEmojiPickerVisible(false);
            }}
          />
        )}
        <input
          ref={commentInputRef}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (e.target.value.includes("@")) {
              dispatch(setIsTagModalOpen(true));
            }
          }}
          type="text"
          className="border-none flex-1 focus:ring-0 outline-none"
          placeholder="Add a comment..."
        />
        <button
          disabled={!comment.trim()}
          type="submit"
          className="font-semibold text-blue-400 disabled:cursor-not-allowed disabled:text-blue-200"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Post;
