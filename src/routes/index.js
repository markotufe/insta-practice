import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { useSelector } from "react-redux";

import DashboardLayout from "../screens/authorized/DashboardLayout";

import authorized from "./authorized";
import unautorized from "./unauthorized";

function RoutesContainer() {
  const isLoggedIn = useSelector((state) => state.user?.userData?.userId);
  const isRegistered = useSelector((state) => state.user?.isRegistered);

  const renderUnautorizedRoutes = () => {
    return unautorized.map((route, index) => {
      return (
        <Route
          exact
          path={route.path}
          render={(props) => <route.component {...props} />}
          key={index}
        />
      );
    });
  };

  const renderAutorizedRoutes = () => {
    let routes = authorized.map((route, index) => {
      return (
        <Route
          exact
          path={route.path}
          render={(props) => <route.component {...props} />}
          key={index}
        />
      );
    });

    return <DashboardLayout routes={authorized}>{routes}</DashboardLayout>;
  };

  return (
    <Router>
      <Switch>
        {!isLoggedIn || !isRegistered
          ? renderUnautorizedRoutes()
          : renderAutorizedRoutes()}
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}

export default RoutesContainer;
