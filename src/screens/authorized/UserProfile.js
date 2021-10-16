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
    <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-4 xl:max-w-6xl mx-auto pt-6 min-h-screen">
      {/* {followingUsers.map((user) => {
        return (
          <FollowingUsers
            key={user?.userId}
            user={user}
            handleUnfollow={handleUnfollow}
          />
        );
      })} */}
      <div className="col-span-1 bg-red-700">
        <div className="fixed">levo</div>
      </div>
      <div className="col-span-3 bg-yellow-400">desno</div>
    </div>
  );
};

export default UserProfile;
