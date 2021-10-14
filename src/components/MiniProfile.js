const MiniProfile = () => {
  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        src={
          "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
        }
        alt="profile"
        className="rounded-full border p-[2px] w-16 h-16"
      />

      <div className="flex-1 mx-4">
        <h2 className="font-bold">markotufe</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>
    </div>
  );
};

export default MiniProfile;
