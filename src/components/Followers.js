import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useGetFollowers from "../helpers/getFollowers";
import { setFollowersModal } from "../redux/slices/modalSlice";

const Followers = ({ user, handleUnfollow, handleFollow, followingUsers }) => {
  const dispatch = useDispatch();
  const { followers } = useGetFollowers(user?.documentId);
  const { userData } = useSelector((state) => state.user);

  const activeUser = followers.find(
    (user) => user?.userId === userData?.userId
  );

  const isFollowing =
    followingUsers.find(
      (followingUser) => followingUser?.userId === user?.userId
    ) !== undefined;

  return (
    <Link
      to={{
        pathname: `/profile/${user?.displayName}`,
        state: { fullName: user?.fullName },
      }}
      onClick={() => dispatch(setFollowersModal(false))}
      className="flex items-center justify-between outline-none border-b-2 border-opacity-40 py-2"
    >
      <div className="flex items-center flex-1">
        <img
          src={
            user?.photoURL ??
            "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
          }
          alt="profile pic"
          className="h-10 w-10 rounded-full cursor-pointer"
        />
        <div className="ml-2">
          <p className="font-bold text-sm">{user?.displayName}</p>
          <p className="text-gray-400">{user?.fullName}</p>
        </div>
      </div>

      {isFollowing ? (
        <button
          className="text-blue-500 font-bold"
          onClick={() => handleUnfollow(user, activeUser?.followerDocumentId)}
        >
          Unfollow
        </button>
      ) : (
        <button
          className="text-blue-500 font-bold"
          onClick={() => handleUnfollow(user, activeUser?.followerDocumentId)}
        >
          Follow
        </button>
      )}
    </Link>
  );
};

export default Followers;
