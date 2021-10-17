/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFollowingUsers } from "../../helpers/getFollowingUsers";
import { getUserById } from "../../helpers/getUserById";
import { updateUserFollowing } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
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

const UserProfile = () => {
  const dispatch = useDispatch();
  const [followingUsers, setFollowingUsers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState({});

  const {
    userId: activeUserId,
    following,
    documentId: activeUserDocumentId,
  } = useSelector((state) => state.user.userData);

  useEffect(() => {
    async function handleGetFollowingUsers() {
      const response = await getFollowingUsers(activeUserId);
      console.log(response);
      setFollowingUsers(response);
    }

    handleGetFollowingUsers();
  }, [following]);

  useEffect(() => {
    async function handleGetUserById() {
      const response = await getUserById(activeUserId);
      setLoggedInUserId(response?.userId);
    }

    handleGetUserById();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        where("creatorId", "==", activeUserId),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setUserPosts(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }
    );
    return unsubscribe;
  }, []);

  const handleUnfollow = async (userToFollowDocumentId, userToFollowId) => {
    await unfollowUser(
      activeUserDocumentId,
      activeUserId,
      userToFollowDocumentId,
      userToFollowId
    );

    dispatch(updateUserFollowing({ userToFollowId, followAction: false }));
  };

  const showFollowButton = loggedInUserId !== activeUserId;

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
        <UserProfileData showFollowButton={showFollowButton} />
      </div>
      <div className="col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 mx-auto w-11/12">
          {userPosts.map((post) => (
            <UserPosts key={post?.postId} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
