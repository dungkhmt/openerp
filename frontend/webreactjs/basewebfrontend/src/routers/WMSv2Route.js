import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateFacility from "component/sscm/wmsv2/management/createFacility/createFacility";

export default function WMSv2Route() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={CreateFacility}
          exact
          path={`${path}/facility/create`}
        ></Route>
      </Switch>
    </div>
  );
}
