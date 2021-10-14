const Suggestion = ({ profile }) => {
  return (
    <div key={profile.id} className="flex items-center justify-between mt-3">
      <img
        src={profile.avatar}
        className="w-10 h-10 rounded-full border p-[2px]"
        alt="profile"
      />

      <div className="flex-1 ml-4">
        <h2 className="font-semibold text-sm">{profile.username}</h2>
        <h3 className="text-xs text-gray-400">
          Works at {profile.company.name}
        </h3>
      </div>

      <div className="text-blue-400 text-sm font-bold">Follow</div>
    </div>
  );
};

export default Suggestion;
