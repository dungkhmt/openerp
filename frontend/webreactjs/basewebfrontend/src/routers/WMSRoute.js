import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import OrderPickupPlanning from "../component/sscm/wms/orderpickupplanning/OrderPickupPlanning";
import CreateWarehouse from "../component/sscm/wms/management/CreateWarehouse/CreateWarehouse";
import ListWarehouse from "../component/sscm/wms/management/ListWarehouse";
import WarehouseDetail from "component/sscm/wms/management/WarehouseDetail";
import ListProduct from "component/sscm/wms/management/ListProduct/ListProduct";
import CreateProduct from "component/sscm/wms/management/CreateProduct/CreateProduct";
import ProductDetail from "component/sscm/wms/management/ProductDetail/ProductDetail";
import ListImport from "component/sscm/wms/management/ListImport/ListImport";
import ImportDetail from "component/sscm/wms/management/ImportOrder/ImportDetail";
import CreateImport from "component/sscm/wms/management/ImportOrder/CreateImport";
import CreateExport from "component/sscm/wms/management/ExportOrder/CreateExport";
import ListExport from "component/sscm/wms/management/ListExport/ListExport";
import ExportDetail from "component/sscm/wms/management/ExportOrder/ExportDetail";
import UpdateWarehouse from "component/sscm/wms/management/UpdateWarehouse/UpdateWarehouse";

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
          component={UpdateWarehouse}
          exact
          path={`${path}/warehouse/update/:id`}
        ></Route>
        <Route
          component={ListWarehouse}
          exact
          path={`${path}/warehouse/list`}
        ></Route>
        <Route
          component={ListProduct}
          exact
          path={`${path}/warehouse/products`}
        ></Route>
        <Route
          component={CreateProduct}
          exact
          path={`${path}/warehouse/products/create`}
        ></Route>
        <Route
          component={ProductDetail}
          exact
          path={`${path}/warehouse/products/:id`}
        ></Route>
        <Route
          component={CreateImport}
          exact
          path={`${path}/inventory/import/create`}
        ></Route>
        <Route
          component={ListImport}
          exact
          path={`${path}/inventory/import`}
        ></Route>
        <Route
          component={ImportDetail}
          exact
          path={`${path}/inventory/import/:id`}
        ></Route>
        <Route
          component={CreateExport}
          exact
          path={`${path}/inventory/export/create`}
        ></Route>
        <Route
          component={ListExport}
          exact
          path={`${path}/inventory/export`}
        ></Route>
        <Route
          component={ExportDetail}
          exact
          path={`${path}/inventory/export/:id`}
        ></Route>
        <Route
          component={WarehouseDetail}
          path={`${path}/warehouse/:id`}
          exact
        />
      </Switch>
    </div>
  );
}
