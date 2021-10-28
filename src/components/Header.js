import { useEffect, useState } from "react";
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { useHistory } from "react-router";
import { setModal } from "../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserByUsername } from "../helpers/getUserByUsername";
import HeaderDropdown from "../components/MyProfile/HeaderDropdown";

function Header() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { displayName } = useSelector((state) => state.user.userData);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState();

  const handleSearchQuery = async () => {
    const result = await getUserByUsername(searchQuery.toLowerCase());
    setResult(result);
  };

  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        handleSearchQuery();
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const renderList = () => {
    return (
      <ul className="list-none border absolute bg-white mx-auto py-2 px-2 shadow-2xl rounded">
        {result?.displayName}
      </ul>
    );
  };

  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-5 lg:mx-auto">
        {/* left */}
        <div
          className="relative hidden lg:inline-grid w-24 cursor-pointer items-center"
          onClick={() => history.push("/")}
        >
          <img
            alt="logo"
            className="object-cover"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2880px-Instagram_logo.svg.png"
          />
        </div>

        <div
          className="relative w-10 lg:hidden flex-shrink-0 cursor-pointer"
          onClick={() => history.push("/")}
        >
          <img
            alt="profile"
            className="object-cover"
            src="https://1000logos.net/wp-content/uploads/2017/02/insta-logo.png"
          />
        </div>
        {/* middle search input filed */}
        <div className="max-w-sm">
          <div className="relative mt-1 p-3 rounded-m">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 z-20" />
            </div>
            <input
              type="text"
              placeholder="Search user"
              className="
                bg-gray-50 block w-full pl-10 sm:text-sm
                border-gray-300 focus:ring-black
                focus:border-black rounded-md
              "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && renderList()}
        </div>

        {/* right */}
        <div className="flex items-center justify-end space-x-4">
          <HomeIcon className="navBtn" onClick={() => history.push("/")} />
          <MenuIcon className="h-6 md:hidden cursor-pointer" />
          <Link to="/chat" className="relative navBtn">
            <PaperAirplaneIcon className="navBtn" />
            <div className="absolute -top-1 -right-1 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
              3
            </div>
          </Link>
          <PlusCircleIcon
            className="navBtn"
            onClick={() => dispatch(setModal(true))}
          />
          <Link to="/explore">
            <UserGroupIcon className="navBtn" />
          </Link>
          <div className="relative navBtn">
            <HeartIcon className="navBtn" />
            <div className="absolute -top-1 -right-1 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
              25
            </div>
          </div>
          <HeaderDropdown displayName={displayName} />
        </div>
      </div>
    </div>
  );
}

export default Header;
