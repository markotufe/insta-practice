/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFollowingUsers } from "../../helpers/getFollowingUsers";
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
import { useLocation, useParams } from "react-router-dom";

const UserProfile = () => {
  const location = useLocation();
  let { id: usernameFromUrl } = useParams();

  const userIdFromUrl = location.state;

  const dispatch = useDispatch();
  const [followingUsers, setFollowingUsers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const {
    userId: activeUserId,
    following,
    documentId: activeUserDocumentId,
    displayName,
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
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        where("creatorDisplayName", "==", usernameFromUrl ?? displayName),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setUserPosts(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }
    );
    return unsubscribe;
  }, [userIdFromUrl]);

  const handleUnfollow = async (userToFollowDocumentId, userToFollowId) => {
    await unfollowUser(
      activeUserDocumentId,
      activeUserId,
      userToFollowDocumentId,
      userToFollowId
    );

    dispatch(updateUserFollowing({ userToFollowId, followAction: false }));
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
        <UserProfileData showFollowButton={false} />
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
