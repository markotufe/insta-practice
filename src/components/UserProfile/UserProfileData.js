import { useDispatch } from "react-redux";
import {
  setFollowingModal,
  setFollowersModal,
} from "../../redux/slices/modalSlice";

const UserProfileData = ({
  followingCount,
  followersCount,
  postsCount,
  fullName,
  isActiveUserFollowingProfile,
  handleFollow,
  handleUnfollow,
  displayName,
}) => {
  const dispatch = useDispatch();

  const handleOpetChatModal = () => {
    console.log("chat with " + displayName);
  };

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
        <h2 className="mt-1 text-center font-medium text-lg text-gray-500">
          @{displayName}
        </h2>
      </div>
      <div className="flex justify-between text-center mt-6 w-full ">
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
        {isActiveUserFollowingProfile ? (
          <button
            onClick={handleUnfollow}
            type="submit"
            className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded w-full mt-5"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            type="submit"
            className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded w-full mt-5"
          >
            Follow
          </button>
        )}
        <button
          onClick={handleOpetChatModal}
          type="submit"
          className="bg-transparent text-black font-semibold hover:text-gray-400 py-2 px-4 border border-gray-100 hover:border-gray-200 rounded w-full mt-3 text-center"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default UserProfileData;
