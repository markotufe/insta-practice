import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setFollowingModal } from "../../redux/slices/modalSlice";
import findMeInUserFollowers from "../../helpers/findMeInUserFollowers";
import { unfollowUser } from "../../helpers/followUnfollowUser";

const FollowingUsers = ({ followingUser }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { myDocumentInUserFollowers } = findMeInUserFollowers(
    followingUser?.documentId
  );

  const handleUnfollow = async () => {
    await unfollowUser(userData, followingUser, myDocumentInUserFollowers);
  };

  return (
    <div className="flex items-center justify-between border-b-2 border-opacity-40 py-2">
      <Link
        to={`/user/${followingUser?.displayName}`}
        onClick={() => dispatch(setFollowingModal(false))}
        className="flex items-center outline-none"
      >
        <img
          src={
            followingUser?.photoURL ??
            "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
          }
          alt="profile pic"
          className="h-10 w-10 rounded-full cursor-pointer"
        />
        <div className="ml-2">
          <p className="font-bold text-sm">{followingUser?.displayName}</p>
          <p className="text-gray-400">{followingUser?.fullName}</p>
        </div>
      </Link>

      <button
        className="text-red-500 font-bold"
        onClick={() => handleUnfollow(followingUser, myDocumentInUserFollowers)}
      >
        Unfollow
      </button>
    </div>
  );
};

export default FollowingUsers;
