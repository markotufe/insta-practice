import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setFollowingModal } from "../../redux/slices/modalSlice";
import { followUser, unfollowUser } from "../../helpers/followUnfollowUser";
import findMeInUserFollowers from "../../helpers/findMeInUserFollowers";

const FollowingUsers = ({ followingUser }) => {
  const dispatch = useDispatch();
  const { userData, following } = useSelector((state) => state.user);
  const { myDocumentInUserFollowers } = findMeInUserFollowers(
    followingUser?.documentId
  );

  const isActiveUser = followingUser?.userId === userData?.userId;

  const doIFollowUser = following?.listOfFollowing?.find(
    (followingU) => followingU?.userId === followingUser?.userId
  );

  const handleUnfollow = async () => {
    await unfollowUser(userData, doIFollowUser, myDocumentInUserFollowers);
  };

  const handleFollow = async () => {
    await followUser(userData, followingUser);
  };

  const renderFollowUnfollowBtn = () => {
    if (isActiveUser) return;
    if (doIFollowUser) {
      return (
        <button className="text-red-500 font-bold" onClick={handleUnfollow}>
          Unfollow
        </button>
      );
    } else {
      return (
        <button className="text-blue-500 font-bold" onClick={handleFollow}>
          Follow
        </button>
      );
    }
  };

  return (
    <div className="flex items-center justify-between border-b-2 border-opacity-40 py-2">
      <Link
        to={
          isActiveUser
            ? `/my-profile/${followingUser?.displayName}`
            : `/user/${followingUser?.displayName}`
        }
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

      {renderFollowUnfollowBtn()}
    </div>
  );
};

export default FollowingUsers;
