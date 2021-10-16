/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersToFollow from "../../components/UsersToFollow";
import Loader from "../../components/Loader";
import { getUsersToFollow } from "../../helpers/getUsersToFollow";
import { followUser } from "../../helpers/followUnfollowUser";
import { updateUserFollowing } from "../../redux/slices/userSlice";

const ExploreFriends = () => {
  const {
    userId: activeUserId,
    following,
    documentId: activeUserDocumentId,
  } = useSelector((state) => state.user.userData);
  const [usersToFollow, setUsersToFollow] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getUsersToFollow(following, activeUserId);
      setUsersToFollow(response);
      setLoading(false);
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

    dispatch(updateUserFollowing({ userToFollowId, followAction: true }));
  };

  return (
    <div className="mb-5">
      {!loading ? (
        <>
          <h1 className="text-center my-10 uppercase text-3xl">
            Explore users
          </h1>

          {!usersToFollow.length ? (
            <h1 className="text-center text-xl">No users to follow</h1>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-4/5 mx-auto">
              {usersToFollow?.map((user) => (
                <UsersToFollow
                  key={user?.userId}
                  user={user}
                  handleFollow={handleFollow}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <Loader />
          <p className="mt-5 text-xl font-bold text-gray-900">
            Fetching users...
          </p>
        </div>
      )}
    </div>
  );
};

export default ExploreFriends;
