import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Suggestion from "./Suggestion";
import getUsersToFollow from "../helpers/getUsersToFollow";

const Suggestions = () => {
  getUsersToFollow();

  const usersToFollow = useSelector((state) => state.user.usersToFollow);

  return (
    <div className="mt-4 ml-10">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <Link to="/explore" className="text-gray-600 font-semibold">
          See all
        </Link>
      </div>

      {usersToFollow?.slice(0, 5)?.map((user) => {
        return <Suggestion key={user?.user?.userId} userToFollow={user} />;
      })}
    </div>
  );
};

export default Suggestions;
