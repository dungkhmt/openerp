import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import OrderPickupPlanning from "../component/sscm/wms/orderpickupplanning/OrderPickupPlanning";

export default function AdminRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={OrderPickupPlanning}
          exact
          path={`${path}/order-pickup-planning/home`}
        ></Route>
      </Switch>
    </div>
  );
}
