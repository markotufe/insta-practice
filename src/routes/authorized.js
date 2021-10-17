import FeedScreen from "../screens/authorized/Feed";
import UserProfile from "../screens/authorized/UserProfile";
import ExploreFriends from "../screens/authorized/ExploreFriends";

const unauthorised = [
  {
    path: "/",
    name: "Feed",
    component: FeedScreen,
  },
  {
    path: "/profile/:id",
    name: "UserProfile",
    component: UserProfile,
  },
  {
    path: "/explore",
    name: "ExploreFriends",
    component: ExploreFriends,
  },
];

export default unauthorised;
