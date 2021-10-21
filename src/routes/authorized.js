import FeedScreen from "../screens/authorized/Feed";
import MyProfile from "../screens/authorized/MyProfile";
import UserProfile from "../screens/authorized/UserProfile";
import ExploreFriends from "../screens/authorized/ExploreFriends";

const authorized = [
  {
    path: "/",
    name: "Feed",
    component: FeedScreen,
  },
  {
    path: "/my-profile/:id",
    name: "MyProfile",
    component: MyProfile,
  },
  {
    path: "/user/:id",
    name: "UserProfile",
    component: UserProfile,
  },
  {
    path: "/explore",
    name: "ExploreFriends",
    component: ExploreFriends,
  },
];

export default authorized;
