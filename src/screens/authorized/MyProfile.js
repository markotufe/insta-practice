/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getMyFollowing from "../../helpers/getMyFollowing";
import getMyFollowers from "../../helpers/getMyFollowers";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";
import { setModal } from "../../redux/slices/modalSlice";
import NoPostsMessage from "../../components/NoPostsMessage";

import { FollowingModal } from "../../components/MyProfile/FollowingModal";
import { FollowersModal } from "../../components/MyProfile/FollowersModal";
import { OnePostModal } from "../../components/OnePostModal";
import MyPosts from "../../components/MyProfile/MyPosts";
import MyProfileData from "../../components/MyProfile/MyProfileData";

const UserProfile = () => {
  let { id: usernameFromUrl } = useParams();
  const dispatch = useDispatch();
  const { userData, followers, following } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState();

  getMyFollowing(userData?.documentId);
  getMyFollowers(userData?.documentId);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        where("creatorDisplayName", "==", userData?.displayName),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setUserPosts(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }
    );
    return unsubscribe;
  }, []);

  return (
    <>
      <FollowingModal followingUsers={following?.listOfFollowing} />
      <FollowersModal followers={followers?.listOfFollowers} />
      <OnePostModal post={selectedPost} setSelectedPost={setSelectedPost} />
      <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-5 xl:max-w-6xl mx-auto pt-6 min-h-screen mb-5">
        <div className="col-span-1 mr-5">
          <MyProfileData
            followingCount={following?.listOfFollowing?.length}
            followersCount={followers?.listOfFollowers?.length}
            postsCount={userPosts?.length}
            fullName={userData?.fullName}
          />
        </div>
        <div className="col-span-4">
          {!userPosts.length ? (
            <NoPostsMessage
              message="Create your first post"
              btnText="Create post"
              btnFunction={() => dispatch(setModal(true))}
              showCreatePostButton={usernameFromUrl === userData?.displayName}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 mx-auto w-11/12">
              {userPosts.map((post) => (
                <MyPosts
                  key={post?.postId}
                  post={post}
                  setSelectedPost={setSelectedPost}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
