import { LinearProgress } from "@material-ui/core";
import React, { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute";
import { Home } from "../component";
import { Layout } from "../layout";
import { drawerWidth } from "../layout/sidebar/v1/SideBar";
import { useNotificationState } from "../state/NotificationState";
import NotFound from "../views/errors/NotFound";
import AccountActivationRoute from "./AccountActivationRoute";
import AdminRoute from "./AdminRoute";
import ProgrammingContestRoutes from "./ProgrammingContestRoutes";

const EduRoute = lazy(() => import("./EduRoute"));
const UserLoginRoute = lazy(() => import("./UserLoginRoute"));
const TestGroupRoute = lazy(() => import("./TestGroupRoute"));
const UserGroupRoute = lazy(() => import("./UserGroupRoute"));

function MainAppRoute(props) {
  const location = useLocation();
  const notificationState = useNotificationState();

  useEffect(() => {
    notificationState.open.set(false);
  }, [location.pathname]);

  // const dispatch = useDispatch();

  // /**
  //  * This func has a bug, it only display properly when access menu in order, if access by random URL, it failed.
  //  */
  // useEffect(() => {
  //   if (location.pathname === "/" || location.pathname === "") {
  //     dispatch(updateSelectedFuction(null));
  //   }

  //   let selectedFunction = mapPathMenu.get(location.pathname);

  //   if (selectedFunction) {
  //     dispatch(updateSelectedFuction(selectedFunction));
  //   }
  // }, [location]);

  return (
    <Layout>
      <Suspense
        fallback={
          // <BouncingBallsLoader />
          <LinearProgress
            style={{
              position: "absolute",
              top: 0,
              left: -drawerWidth,
              width: "calc(100% + 300px)",
              zIndex: 1202,
            }}
          />
        }
      >
        <Switch>
          <Route component={Home} exact path="/" />

          <PrivateRoute component={UserLoginRoute} path="/userlogin" />

          <PrivateRoute component={EduRoute} path="/edu" />

          <PrivateRoute component={AdminRoute} path="/admin/data" />
          <PrivateRoute component={AccountActivationRoute} path="/activation" />
          <PrivateRoute component={ProgrammingContestRoutes} path="/programming-contest" />
          <PrivateRoute
            component={TestGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/test-group"
          />

          <PrivateRoute
            component={UserGroupRoute}
            isAuthenticated={props.isAuthenticated}
            path="/user-group"
          />

          {/* <Route component={error} path="*" /> */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default MainAppRoute;
