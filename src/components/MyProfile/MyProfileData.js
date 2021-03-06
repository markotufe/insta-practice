import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  setFollowingModal,
  setFollowersModal,
} from "../../redux/slices/modalSlice";

const UserProfileData = ({
  followingCount,
  followersCount,
  postsCount,
  fullName,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center justify-center mt-4 mx-auto">
      <img
        src={
          "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
        }
        alt="profile"
        className="rounded-full border p-[2px] w-24 h-24"
      />
      <div className="mt-6">
        <h2 className="font-bold text-2xl text-center">{fullName}</h2>
      </div>
      <div className="flex justify-between text-center mt-6 w-full">
        <div>
          <p className="text-lg font-semibold">{postsCount}</p>
          <p className="text-sm text-gray-500">posts</p>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => dispatch(setFollowersModal(true))}
        >
          <p className="text-lg font-semibold">{followersCount}</p>
          <p className="text-sm text-gray-500">followers</p>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => dispatch(setFollowingModal(true))}
        >
          <p className="text-lg font-semibold">{followingCount}</p>
          <p className="text-sm text-gray-500">following</p>
        </div>
      </div>
      <div className="w-full">
        <Link
          to="/edit-profile"
          type="submit"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full mt-5 text-center"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfileData;
