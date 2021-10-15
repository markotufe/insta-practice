/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UsersToFollow from "../../components/UsersToFollow";
import { getUsersToFollow } from "../../helpers/getUsersToFollow";
import { followUser } from "../../helpers/followUnfollowUser";

const ExploreFriends = () => {
  const {
    userId: activeUserId,
    following,
    documentId: activeUserDocumentId,
  } = useSelector((state) => state.user.userData);
  const [usersToFollow, setUsersToFollow] = useState();

  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getUsersToFollow(following, activeUserId);
      setUsersToFollow(response);
    }

    suggestedProfiles();
  }, [following]);

  const handleFollow = async (userToFollowDocumentId, userToFollowId) => {
    await followUser(
      activeUserDocumentId,
      activeUserId,
      userToFollowDocumentId,
      userToFollowId
    );
  };

  return (
    <div>
      <h1>Exploer users</h1>
      {usersToFollow?.map((user) => (
        <UsersToFollow
          key={user?.userId}
          user={user}
          handleFollow={handleFollow}
        />
      ))}
    </div>
  );
};

export default ExploreFriends;
