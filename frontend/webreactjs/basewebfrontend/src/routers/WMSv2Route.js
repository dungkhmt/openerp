import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateWarehouse from "component/sscm/wmsv2/management/createWarehouse/createWarehouse";
import ListWarehouse from "component/sscm/wmsv2/management/listWarehouse/listWarehouses";
import ProductDetail from "component/sscm/wmsv2/management/product/productDetail";

export default function WMSv2Route() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={CreateWarehouse}
          exact
          path={`${path}/warehouse/create`}
        ></Route>
        <Route
          component={ListWarehouse}
          exact
          path={`${path}/warehouse`}
        ></Route>
        <Route
          component={CreateWarehouse}
          exact
          path={`${path}/warehouse/update/:id`}
        ></Route>
        <Route
          component={ProductDetail}
          exact
          path={`${path}/product`}
        ></Route>
      </Switch>
    </div>
  );
}
