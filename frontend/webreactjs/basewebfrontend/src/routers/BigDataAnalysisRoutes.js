import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DataQualityCheck from "component/bigdataanalysis/DataQualityCheck";

export default function BigDataAnalysisRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={DataQualityCheck}
          exact
          path={`${path}/quality-check`}
        ></Route>
      </Switch>
    </div>
  );
}
