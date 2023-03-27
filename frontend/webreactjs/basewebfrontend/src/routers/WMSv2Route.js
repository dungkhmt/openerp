import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateWarehouse from "component/sscm/wmsv2/management/createWarehouse/createWarehouse";
import ListWarehouse from "component/sscm/wmsv2/management/listWarehouse/listWarehouses";
import ProductDetail from "component/sscm/wmsv2/management/product/productDetail";
import ProductListing from "component/sscm/wmsv2/management/product/productListing";

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
          component={ProductListing}
          exact
          path={`${path}/product`}
        ></Route>
        <Route
          component={ProductDetail}
          exact
          path={`${path}/product/update/:id`}
        ></Route>
        <Route
          component={ProductDetail}
          exact
          path={`${path}/product/create`}
        ></Route>
      </Switch>
    </div>
  );
}
