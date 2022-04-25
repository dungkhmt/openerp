import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateProject from "../component/taskmanagement/CreateProject";
import ListProject from "../component/taskmanagement/ListProject";

export default function TaskManagementRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={CreateProject}
          exact
          path={`${path}/project/create`}
        ></Route>
        <Route
          component={ListProject}
          exact
          path={`${path}/project/list`}
        ></Route>
      </Switch>
    </div>
  );
}
