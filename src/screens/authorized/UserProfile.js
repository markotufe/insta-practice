/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetFollowingUsers from "../../helpers/getFollowingUsers";
import useGetFollowers from "../../helpers/getFollowers";
import FollowingUsers from "../../components/FollowingUsers";
import UserPosts from "../../components/UserPosts";
import { unfollowUser } from "../../helpers/followUnfollowUser";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../../firebase";
import UserProfileData from "../../components/UserProfileData";
import { useLocation, useParams } from "react-router-dom";
import NoPostsMessage from "../../components/NoPostsMessage";
import { setModal } from "../../redux/slices/modalSlice";

const UserProfile = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  let { id: usernameFromUrl } = useParams();

  const [userPosts, setUserPosts] = useState([]);

  const { userData } = useSelector((state) => state.user);

  const { followingUsers } = useGetFollowingUsers(userData?.documentId);
  const { followers } = useGetFollowers(userData?.documentId);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        where(
          "creatorDisplayName",
          "==",
          usernameFromUrl ?? userData?.displayName
        ),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setUserPosts(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }
    );
    return unsubscribe;
  }, []);

  const handleUnfollow = async (
    userToUnfollow,
    activeUserDocumentIdInFollowers
  ) => {
    await unfollowUser(
      userData,
      userToUnfollow,
      activeUserDocumentIdInFollowers
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-5 xl:max-w-6xl mx-auto pt-6 min-h-screen mb-5">
      {/* {followingUsers.map((user) => {
        return (
          <FollowingUsers
            key={user?.userId}
            user={user}
            handleUnfollow={handleUnfollow}
          />
        );
      })} */}
      <div className="col-span-1 mr-5">
        <UserProfileData
          showFollowButton={false}
          followingCount={followingUsers?.length}
          followersCount={followers?.length}
          postsCount={userPosts.length}
          fullName={
            usernameFromUrl === userData?.displayName
              ? userData?.fullName
              : location?.state?.fullName
          }
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
  );
};

export default UserProfile;
