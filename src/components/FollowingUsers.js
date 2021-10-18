import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useGetFollowers from "../helpers/getFollowers";
import { setFollowingModal } from "../redux/slices/modalSlice";

const FollowingUsers = ({ user, handleUnfollow }) => {
  const dispatch = useDispatch();
  const { followers } = useGetFollowers(user?.documentId);
  const { userData } = useSelector((state) => state.user);

  const activeUser = followers.find(
    (user) => user?.userId === userData?.userId
  );

  return (
    <Link
      to={{
        pathname: `/profile/${user?.displayName}`,
        state: { fullName: user?.fullName },
      }}
      onClick={() => dispatch(setFollowingModal(false))}
      className="flex"
    >
      {user?.displayName}
      <img
        src={
          user?.photoURL ??
          "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
        }
        alt="profile pic"
        className="h-10 w-10 rounded-full cursor-pointer"
      />
      <button
        onClick={() => handleUnfollow(user, activeUser?.followerDocumentId)}
      >
        Unfollow
      </button>
    </Link>
  );
};

export default FollowingUsers;
