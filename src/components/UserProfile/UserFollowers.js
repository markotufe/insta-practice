import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setFollowersModal } from "../../redux/slices/modalSlice";
import findMeInUserFollowers from "../../helpers/findMeInUserFollowers";
import { followUser, unfollowUser } from "../../helpers/followUnfollowUser";

const Followers = ({ follower }) => {
  const dispatch = useDispatch();
  const { following, userData } = useSelector((state) => state.user);

  const doIFollowUser = following?.listOfFollowing?.find(
    (followingUser) => followingUser?.userId === follower?.userId
  );

  const { myDocumentInUserFollowers } = findMeInUserFollowers(
    follower?.documentId
  );

  const isActiveUser = follower?.userId === userData?.userId;

  const handleUnfollow = async () => {
    await unfollowUser(userData, doIFollowUser, myDocumentInUserFollowers);
    console.log("hee");
  };

  const handleFollow = async () => {
    await followUser(userData, follower);
  };

  const renderFollowUnfollowBtn = () => {
    if (isActiveUser) return;
    else if (doIFollowUser) {
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
            ? `/my-profile/${follower?.displayName}`
            : `/user/${follower?.displayName}`
        }
        onClick={() => dispatch(setFollowersModal(false))}
        className="flex items-center outline-none"
      >
        <img
          src={
            follower?.photoURL ??
            "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
          }
          alt="profile pic"
          className="h-10 w-10 rounded-full cursor-pointer"
        />
        <div className="ml-2">
          <p className="font-bold text-sm">{follower?.displayName}</p>
          <p className="text-gray-400">{follower?.fullName}</p>
        </div>
      </Link>

      {renderFollowUnfollowBtn()}
    </div>
  );
};

export default Followers;
