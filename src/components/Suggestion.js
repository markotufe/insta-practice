import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { followUser } from "../helpers/followUnfollowUser";

const Suggestion = ({ userToFollow }) => {
  const { userData } = useSelector((state) => state.user);

  const handleFollow = async () => {
    await followUser(userData, userToFollow?.user);
  };

  return (
    <div
      key={userToFollow?.user?.userId}
      className="flex items-center justify-between mt-3"
    >
      <img
        src={
          userToFollow?.user?.photoURL ??
          "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
        }
        className="w-10 h-10 rounded-full border p-[2px]"
        alt="profile"
      />

      <div className="flex-1 ml-4">
        <Link
          to={`/user/${userToFollow?.user?.displayName}`}
          className="font-semibold text-sm"
        >
          {userToFollow?.user?.displayName}
        </Link>
        <h3 className="text-xs text-gray-400">
          {userToFollow?.user?.fullName}
        </h3>
      </div>

      <div
        className="text-blue-400 text-sm font-bold cursor-pointer"
        onClick={handleFollow}
      >
        Follow
      </div>
    </div>
  );
};

export default Suggestion;
