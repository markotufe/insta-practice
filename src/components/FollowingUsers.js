const UsersToFollow = ({ user, handleUnfollow }) => {
  return (
    <div className="flex">
      {user?.displayName}
      <img
        src={
          user?.photoURL ??
          "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
        }
        alt="profile pic"
        className="h-10 w-10 rounded-full cursor-pointer"
      />
      <button onClick={() => handleUnfollow(user?.documentId, user?.userId)}>
        Unfollow
      </button>
    </div>
  );
};

export default UsersToFollow;
