import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateWhiteBoard from "../component/education/whiteboard/CreateWhiteBoard";
import ListWhiteBoard from "../component/education/whiteboard/ListWhiteBoard";

export default function WhiteBoardRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={CreateWhiteBoard}
          exact
          path={`${path}/board/create`}
        ></Route>
        <Route
          component={ListWhiteBoard}
          exact
          path={`${path}/board/list`}
        ></Route>
      </Switch>
    </div>
  );
}
