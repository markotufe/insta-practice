import { Link } from "react-router-dom";

const ChatProfileData = ({ profileData }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-14 mx-auto">
      <img
        src={
          profileData?.photoURL ??
          "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
        }
        alt="profile"
        className="rounded-full border p-[2px] w-24 h-24"
      />
      <div className="mt-6">
        <h2 className="font-bold text-2xl text-center">
          {profileData?.fullName}
        </h2>
        <h2 className="mt-1 text-center font-medium text-lg text-gray-500">
          @{profileData?.displayName}
        </h2>
      </div>
      <Link
        to={`/user/${profileData?.displayName}`}
        type="submit"
        className="bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded mt-5 text-center"
      >
        View Profile
      </Link>
    </div>
  );
};

export default ChatProfileData;
