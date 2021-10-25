import FeedScreen from "../screens/authorized/Feed";
import MyProfile from "../screens/authorized/MyProfile";
import UserProfile from "../screens/authorized/UserProfile";
import ExploreFriends from "../screens/authorized/ExploreFriends";

import Settings from "../screens/authorized/Settings";
import Bookmarks from "../screens/authorized/Bookmarks";
import EditProfile from "../screens/authorized/EditProfile";

const authorized = [
  {
    path: "/",
    name: "Feed",
    component: FeedScreen,
  },
  {
    path: "/explore",
    name: "ExploreFriends",
    component: ExploreFriends,
  },
  {
    path: "/user/:id",
    name: "UserProfile",
    component: UserProfile,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/bookmarks",
    name: "Bookmarks",
    component: Bookmarks,
  },
  {
    path: "/my-profile/:id",
    name: "MyProfile",
    component: MyProfile,
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile,
  },
];

export default authorized;
