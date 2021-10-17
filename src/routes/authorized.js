import FeedScreen from "../screens/authorized/Feed";
import Me from "../screens/authorized/Me";
import Users from "../screens/authorized/Users";
import ExploreFriends from "../screens/authorized/ExploreFriends";

const unauthorised = [
  {
    path: "/",
    name: "Feed",
    component: FeedScreen,
  },
  {
    path: "/me/:id",
    name: "Me",
    component: Me,
  },
  {
    path: "/profile/:id",
    name: "Users",
    component: Users,
  },
  {
    path: "/explore",
    name: "ExploreFriends",
    component: ExploreFriends,
  },
];

export default unauthorised;
