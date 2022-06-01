import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import TMSContainerHome from "../component/tmscontainer/TMSContainerHome";

export default function TMSContainerRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={TMSContainerHome} exact path={`${path}/home`}></Route>
      </Switch>
    </div>
  );
}
