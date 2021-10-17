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

function Header() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { displayName } = useSelector((state) => state.user.userData);

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
        <div className="max-w-xs">
          <div className="relative mt-1 p-3 rounded-m">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="
                bg-gray-50 block w-full pl-10 sm:text-sm
                border-gray-300 focus:ring-black
                focus:border-black rounded-md
              "
            />
          </div>
        </div>

        {/* right */}
        <div className="flex items-center justify-end space-x-4">
          <HomeIcon className="navBtn" onClick={() => history.push("/")} />
          <MenuIcon className="h-6 md:hidden cursor-pointer" />

          <div className="relative navBtn">
            <PaperAirplaneIcon className="navBtn" />
            <div className="absolute -top-1 -right-1 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
              3
            </div>
          </div>
          <PlusCircleIcon
            className="navBtn"
            onClick={() => dispatch(setModal(true))}
          />
          <Link to="/explore">
            <UserGroupIcon className="navBtn" />
          </Link>
          <HeartIcon className="navBtn" />

          <Link to={`/profile/${displayName}`}>
            <img
              src={
                "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
              }
              alt="profile pic"
              className="h-10 w-10 rounded-full cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
