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
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import {
  HeartIcon as HeartIconFilled,
  BookmarkIcon as BookmarkIconFilled,
} from "@heroicons/react/solid";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

const Post = ({ id, username, caption, img, userImg }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const commentInputRef = useRef(null);

  const { data: session } = useSession();

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    //id posta koji zelimo da komentarisemo
    //comments je kolekcija koja se nalazi unutar posta
    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      profileImg: session.user?.image,
      timestamp: serverTimestamp(),
    });
  };

  useEffect(() => {
    //snapshot je real-time lisener na nasu bazu, prati promene
    //id je id posta
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
    return unsubscribe;
  }, [db, id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts", id, "likes")),
      (snapshot) => {
        setLikes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );
    return unsubscribe;
  }, [db, id]);

  useEffect(() => {
    // -1 ako nista ne nadje
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts", id, "bookmarks")),
      (snapshot) => {
        setBookmarks(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
    return unsubscribe;
  }, [db, id]);

  useEffect(() => {
    // -1 ako nista ne nadje
    setHasBookmarked(
      bookmarks.findIndex((bookmark) => bookmark.id === session?.user?.uid) !==
        -1
    );
  }, [bookmarks]);

  const likeUnlikePost = async () => {
    //koristi se korisnikov ID kao ID dokumenta za lajk, zato nam je to peti argument. Zasto? Pa zato da bismo bili sigurni da ne mogu biti dva lajka istog korisnika na isti post.
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user?.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user?.uid), {
        username: session?.user?.username,
      });
    }
  };

  const deletePost = async () => {
    await deleteDoc(doc(db, "posts", id));
  };

  const deleteComment = async (commentId) => {
    await deleteDoc(doc(db, "posts", id, "comments", commentId));
  };

  const manageBookmark = async () => {
    if (hasBookmarked) {
      await deleteDoc(doc(db, "posts", id, "bookmarks", session.user?.uid));
    } else {
      await setDoc(doc(db, "posts", id, "bookmarks", session.user?.uid), {
        username: session?.user?.username,
      });
    }
  };

  const renderBookmark = () => {
    if (session.user.username !== username) {
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
          src={userImg}
          alt="user"
          className="rounded-full h-12 w-12 object-contain p-1 mr-3 border"
        />
        <p className="flex-1 font-bold">{username}</p>
        {session.user.username === username && (
          <TrashIcon className="h-5 cursor-pointer" onClick={deletePost} />
        )}
      </div>
      {/* img  */}
      <img src={img} alt="post" className="object-cover w-full" />
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
          <span className="font-bold mb-1 block">{likes.length} likes</span>
        ) : (
          <span className="font-bold mb-1">0 likes</span>
        )}
        <span className="font-bold mr-1">{username}</span> {caption}
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
                  src={comment.profileImg}
                  alt="auhtor"
                  className="h-7 rounded-full"
                />
                <p className="text-sm flex-1 flex items-center">
                  <span className="font-bold mr-[5px]">{comment.username}</span>
                  {comment.comment}
                  {(session.user.username === comment.username ||
                    session.user.username === username) && (
                    <TrashIcon
                      onClick={() => deleteComment(comment.id)}
                      className="ml-3 h-4 cursor-pointer"
                    />
                  )}
                </p>
                <Moment fromNow className="pr-5 text-xs">
                  {comment.timestamp?.toDate()}
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
          onChange={(e) => setComment(e.target.value)}
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
