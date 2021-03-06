import { useSelector } from "react-redux";
import { followUser } from "../../helpers/followUnfollowUser";
import UsersToFollow from "../../components/UsersToFollow";
import Loader from "../../components/Loader";
import getUsersToFollow from "../../helpers/getUsersToFollow";

const ExploreFriends = () => {
  const { userData, usersToFollow } = useSelector((state) => state.user);

  const handleFollow = async (userToFollow) => {
    await followUser(userData, userToFollow);
  };

  const { loading } = getUsersToFollow();

  return (
    <div className="mb-5">
      {!loading ? (
        <>
          <h1 className="text-center my-10 uppercase text-3xl text-gray-800">
            Explore users
          </h1>

          {!usersToFollow?.length ? (
            <h1 className="text-center text-xl">No users to follow</h1>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-4/5 mx-auto">
              {usersToFollow?.map((user) => (
                <UsersToFollow
                  key={user?.user?.userId}
                  userToFollow={user}
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
