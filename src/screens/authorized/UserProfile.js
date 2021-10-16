/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFollowingUsers } from "../../helpers/getFollowingUsers";
import { updateUserFollowing } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import FollowingUsers from "../../components/FollowingUsers";
import { unfollowUser } from "../../helpers/followUnfollowUser";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [followingUsers, setFollowingUsers] = useState([]);
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
    <div>
      {followingUsers.map((user) => {
        return (
          <FollowingUsers
            key={user?.userId}
            user={user}
            handleUnfollow={handleUnfollow}
          />
        );
      })}
    </div>
  );
};

export default UserProfile;
