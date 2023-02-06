import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateFacility from "component/sscm/wmsv2/management/createFacility/createFacility";
import ListFacility from "component/sscm/wmsv2/management/listFacility/listFacility";

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
        <Route
          component={ListFacility}
          exact
          path={`${path}/facility/list`}
        ></Route>
      </Switch>
    </div>
  );
}
