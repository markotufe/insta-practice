import LoginScreen from "../screens/unauthorized/Login";
import Registration from "../screens/unauthorized/Registration";

const unauthorised = [
  {
    path: "/",
    name: "Login",
    component: LoginScreen,
  },
  {
    path: "/register",
    name: "Register",
    component: Registration,
  },
];

export default unauthorised;
