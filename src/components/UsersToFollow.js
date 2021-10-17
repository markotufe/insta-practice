import { Link } from "react-router-dom";

const UsersToFollow = ({ user, handleFollow }) => {
  console.log(user);

  return (
    <div className="w-full flex flex-col  items-center justify-between bg-white">
      {/* cover */}
      <div>
        <img
          src="https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
          alt="photourl"
          className="object-cover rounded-md"
        />
      </div>
      {/* userdata */}
      <div className="flex items-center justify-between w-full mt-3">
        <Link
          to={{
            pathname: `/profile/${user?.displayName}`,
            state: { userId: user?.userId },
          }}
          className="flex items-center cursor-pointer"
        >
          <img
            src={
              user?.photoURL ??
              "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
            }
            alt="profile pic"
            className="h-10 w-10 rounded-full"
          />
          <div className="ml-2">
            <p className="font-bold text-sm">{user?.displayName}</p>
            <p className="text-gray-400">{user?.fullName}</p>
          </div>
        </Link>
        <button
          onClick={() => handleFollow(user?.documentId, user?.userId)}
          className="text-blue-400 text-sm font-bold"
        >
          Follow
        </button>
      </div>
    </div>
  );
};

export default UsersToFollow;
