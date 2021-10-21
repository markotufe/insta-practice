/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { getUserByUsername } from "../../helpers/getUserByUsername";
import { FollowersModal } from "../../components/UserProfile/UserFollowersModal";
import { FollowingModal } from "../../components/UserProfile/UserFollowingModal";
import { followUser, unfollowUser } from "../../helpers/followUnfollowUser";
import UserProfileData from "../../components/UserProfile/UserProfileData";
import UserPosts from "../../components/UserProfile/UserPosts";
import NoPostsMessage from "../../components/NoPostsMessage";
import getUserFollowing from "../../helpers/getUserFollowing";
import getUserFollowers from "../../helpers/getUserFollowers";
import getMyFollowing from "../../helpers/getMyFollowing";
import findMeInUserFollowers from "../../helpers/findMeInUserFollowers";

const UserProfile = () => {
  const dispatch = useDispatch();
  let { id: usernameFromUrl } = useParams();

  const [userPosts, setUserPosts] = useState([]);
  const [userFromUrl, setUserFromUrl] = useState();

  const { followers, following } = useSelector((state) => state.users);

  const { userData, following: myFollowing } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (usernameFromUrl) {
      async function handleGetUserByUsername() {
        const results = await getUserByUsername(usernameFromUrl);
        setUserFromUrl(results);
      }
      handleGetUserByUsername();
    }
  }, [usernameFromUrl]);

  useEffect(() => {
    if (userFromUrl) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "posts"),
          where("creatorDisplayName", "==", userFromUrl?.displayName),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setUserPosts(snapshot.docs.map((doc) => ({ ...doc.data() })));
        }
      );
      return unsubscribe;
    }
  }, [userFromUrl]);

  getUserFollowing(userFromUrl?.documentId);
  getUserFollowers(userFromUrl?.documentId);
  getMyFollowing(userData?.documentId);

  const activeUserFollowingProfileData = myFollowing?.listOfFollowing.find(
    (user) => user?.userId === userFromUrl?.userId
  );

  const { myDocumentInUserFollowers } = findMeInUserFollowers(
    userFromUrl?.documentId,
    userData?.userId
  );

  const handleUnfollow = async () => {
    await unfollowUser(
      userData,
      activeUserFollowingProfileData,
      myDocumentInUserFollowers
    );
  };

  const handleFollow = async () => {
    await followUser(userData, userFromUrl);
  };

  return (
    <>
      <FollowingModal followingUsers={following?.listOfFollowing} />
      <FollowersModal followers={followers?.listOfFollowers} />
      <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-5 xl:max-w-6xl mx-auto pt-6 min-h-screen mb-5">
        <div className="col-span-1 mr-5">
          <UserProfileData
            followingCount={following?.listOfFollowing?.length}
            followersCount={followers?.listOfFollowers?.length}
            postsCount={userPosts?.length}
            fullName={userFromUrl?.fullName}
            isActiveUserFollowingProfile={activeUserFollowingProfileData}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
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
                <UserPosts key={post?.postId} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
