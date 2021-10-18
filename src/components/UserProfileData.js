import { useDispatch } from "react-redux";
import { setFollowingModal } from "../redux/slices/modalSlice";

const UserProfileData = ({
  showFollowButton,
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
        <h2 className="font-bold text-2xl">{fullName}</h2>
      </div>
      <div className="flex justify-between text-center mt-6 w-full">
        <div>
          <p className="text-lg font-semibold">{postsCount}</p>
          <p className="text-sm text-gray-500">posts</p>
        </div>
        <div className="cursor-pointer">
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
        {showFollowButton ? (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:opacity-50 w-full mt-5"
          >
            Follow
          </button>
        ) : (
          <button
            type="submit"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full mt-5"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfileData;
