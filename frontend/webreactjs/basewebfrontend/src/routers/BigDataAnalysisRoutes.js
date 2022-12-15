import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import DataQualityCheck from "component/bigdataanalysis/DataQualityCheck";
import DataQualityCheckResult from "component/bigdataanalysis/DataQualityCheckResult";
import DataQualityCheckMaster from "component/bigdataanalysis/DataQualityCheckMaster";
import DataQualityCheckDefineRules from "component/bigdataanalysis/DataQualityCheckDefineRules";
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
        <Route
          component={DataQualityCheckResult}
          exact
          path={`${path}/quality-check-result`}
        ></Route>
        <Route
          component={DataQualityCheckDefineRules}
          exact
          path={`${path}/quality-check/define-rules`}
        ></Route>
        <Route
          component={DataQualityCheckMaster}
          exact
          path={`${path}/data-quality-check-master/list`}
        ></Route>
      </Switch>
    </div>
  );
}
