import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import OrderPickupPlanning from "../component/sscm/wms/orderpickupplanning/OrderPickupPlanning";
import CreateWarehouse from "../component/sscm/wms/management/CreateWarehouse";
import ListWarehouse from "../component/sscm/wms/management/ListWarehouse";
export default function WMSRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={OrderPickupPlanning}
          exact
          path={`${path}/order-pickup-planning/home`}
        ></Route>
        <Route
          component={CreateWarehouse}
          exact
          path={`${path}/warehouse/create`}
        ></Route>
        <Route
          component={ListWarehouse}
          exact
          path={`${path}/warehouse/list`}
        ></Route>
      </Switch>
    </div>
  );
}
